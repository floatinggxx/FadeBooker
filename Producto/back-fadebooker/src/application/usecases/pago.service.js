const { client, Preference, Payment } = require('../../config/mercadopago');
const { sendTelegramMessage } = require('../../infraestructure/notifications/telegram');

class PagoService {
  constructor(pagoRepository, citaRepository) {
    this.pagoRepository = pagoRepository;
    this.citaRepository = citaRepository;
  }

  async crearPreferenciaPago(id_cita, tipo_pago = 'total') {
    try {
      // Obtener datos de la cita
      const cita = await this.citaRepository.findById(id_cita);
      if (!cita) {
        throw new Error('Cita no encontrada');
      }

      // Calcular monto a pagar
      let montoAPagar = 0;
      const montoPendiente = cita.monto_total - (cita.pago_abono || 0);

      if (tipo_pago === 'abono') {
        // En FadeBooker el abono es el 50% del total (o lo que falte si ya hay algo pero menos del 50%)
        const abonoRequerido = cita.monto_total * 0.5;
        if ((cita.pago_abono || 0) >= abonoRequerido) {
           throw new Error('El abono del 50% ya ha sido cubierto. Seleccione pagar el total.');
        }
        montoAPagar = abonoRequerido - (cita.pago_abono || 0);
      } else {
        montoAPagar = montoPendiente;
      }

      if (montoAPagar <= 0) {
        throw new Error('La cita ya está completamente pagada o el monto solicitado es inválido');
      }

      // Regla de Negocio: No permitir generar pagos para citas que ya excedieron el tiempo límite (3.2 min)
      const creationTime = new Date(cita.createdAt).getTime();
      const minutesSinceCreation = (Date.now() - creationTime) / 1000 / 60;
      if (minutesSinceCreation > 3.5 && (cita.pago_abono || 0) === 0) { 
        // Solo aplica el límite de 3 min si no ha pagado nada aún (primera reserva)
        await this.citaRepository.update(id_cita, {
          estado: 'cancelada',
          notas: (cita.notas || '') + ' [Automatización: Cita cancelada por exceder el tiempo de pago (3 minutos)].'
        });
        throw new Error('La cita ha expirado por tiempo de espera (límite 3 minutos). Por favor genere una nueva cita.');
      }

      // Calcular comisión ANTES de crear la preferencia y sumarla al unit_price
      // Fuente de verdad para la tasa: 1) fila específica en tabla Commission por tienda, 2) fila global en Commission, 3) env var COMMISSION_RATE, 4) default 5%
      let comisionAplicada = 0;
      try {
        const tiendaId = cita.id_tienda;

        // Obtener configuración por tienda si existe
        let commissionRow = null;
        try {
          commissionRow = await this.pagoRepository.db('Commission').where({ id_tienda: tiendaId, activo: 1 }).first();
        } catch (eDb) {
          // tabla o consulta puede no existir en entornos de pruebas; proceder con fallback
          console.warn('No se pudo leer Commission por tienda:', eDb.message || eDb);
        }

        // Obtener global si no hay por tienda
        let globalRow = null;
        if (!commissionRow) {
          try {
            globalRow = await this.pagoRepository.db('Commission').whereNull('id_tienda').andWhere({ activo: 1 }).first();
          } catch (eDb2) {
            console.warn('No se pudo leer Commission global:', eDb2.message || eDb2);
          }
        }

        // Determinar porcentaje y fijo a aplicar
        const porcentajeFuente = commissionRow ? Number(commissionRow.porcentaje || 0)
                                : (globalRow ? Number(globalRow.porcentaje || 0) : (process.env.COMMISSION_RATE ? Number(process.env.COMMISSION_RATE) : 5));
        const fijoFuente = commissionRow ? Number(commissionRow.fijo || 0)
                          : (globalRow ? Number(globalRow.fijo || 0) : 0);

        // Calcular comisión como (porcentaje * montoAPagar / 100) + fijo
        const rawComision = (Number(montoAPagar) * porcentajeFuente / 100) + fijoFuente;

        // Si la tienda tiene suscripción VIP que exime comisiones, anular la comisión
        try {
          const tiendaRow = await this.pagoRepository.db('Tienda').where({ id_tienda: tiendaId }).first();
          if (tiendaRow && (String(tiendaRow.suscripcion || '').toLowerCase() === 'vip')) {
            comisionAplicada = 0;
          } else {
            // CLP no maneja decimales: redondear a entero (nearest) para evitar problemas con Mercado Pago
            comisionAplicada = Math.round(Number(rawComision));
          }
        } catch (eT) {
          console.warn('No se pudo leer información de tienda para evaluar suscripción VIP:', eT.message || eT);
          comisionAplicada = Math.round(Number(rawComision));
        }
      } catch (e) {
        console.warn('No se pudo calcular comisión (tabla Commission ausente o error):', e.message || e);
        comisionAplicada = 0;
      }

      // Crear preferencia en Mercado Pago con expiración de 10 minutos para dar tiempo al usuario a pagar
        // Dedupe: si ya existe un pago pendiente asociado a esta cita, devolver sus datos en lugar de crear otra preferencia.
        try {
          const pagosCita = await this.pagoRepository.findByCitaId(id_cita);
          const pagoPendiente = (pagosCita || []).find(p => String(p.estado_pago).toLowerCase() === 'pendiente');
          if (pagoPendiente) {
            if (process.env.NODE_ENV !== 'production') {
              console.log('Dedupe: pago pendiente encontrado para cita', id_cita, pagoPendiente);
            }
            // Devolver información útil al frontend para evitar crear nuevas preferencias
            return {
              url: pagoPendiente.init_point || null,
              preference_id: pagoPendiente.referencia_transaccion || null,
              montoBase: pagoPendiente.monto_base || montoAPagar,
              comision: typeof pagoPendiente.comision !== 'undefined' ? pagoPendiente.comision : comisionAplicada,
              montoConComision: pagoPendiente.monto_pagado || (montoAPagar + comisionAplicada),
              totalNeto: pagoPendiente.monto_pagado || (montoAPagar + comisionAplicada),
              moneda: 'CLP',
              existing: true
            };
          }
        } catch (eDed) {
          console.warn('Dedupe check falló:', eDed.message || eDed);
          // continuar con flujo normal si falla la deducción
        }

      const preference = new Preference(client);
      const unitPriceToSend = Number((Number(montoAPagar) + Number(comisionAplicada)).toFixed(2));
      const body = {
        items: [
          {
            title: `Reserva FadeBooker - ${tipo_pago === 'abono' ? 'Abono 50%' : 'Pago Total'} Cita #${id_cita}`,
            quantity: 1,
            unit_price: unitPriceToSend
          }
        ],
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pago-exitoso`,
          failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pago-fallido`,
          pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pago-pendiente`
        },
        notification_url: (process.env.BACKEND_URL && !process.env.BACKEND_URL.includes('localhost')) 
          ? `${process.env.BACKEND_URL.startsWith('http') ? '' : 'https://'}${process.env.BACKEND_URL}/api/pagos/webhook`
          : 'https://fadebooker-backend-ok.azurewebsites.net/api/pagos/webhook', // Fallback hardcoded para producción si falla env
        external_reference: `cita_${id_cita}`,
        expires: true,
        expiration_date_to: new Date(Date.now() + 3 * 60 * 1000).toISOString() // Expira en 3 minutos para el link de pago
      };

      const response = await preference.create({ body });
      const preferenceResult = response?.body || response?.response || response;

      // Crear registro de pago pendiente con monto final (base + comision)
      const pagoData = {
        id_cita: id_cita,
        monto_pagado: unitPriceToSend,
        monto_base: montoAPagar,
        metodo_pago: 'mercadopago',
        estado_pago: 'pendiente',
        referencia_transaccion: preferenceResult.id,
        comision: comisionAplicada
      };

      await this.pagoRepository.create(pagoData);

      const totalNeto = Number(unitPriceToSend.toFixed(2));
      return {
        url: preferenceResult.init_point || response.init_point,
        preference_id: preferenceResult.id || response.id,
        montoBase: montoAPagar,
        comision: comisionAplicada,
        montoConComision: unitPriceToSend,
        totalNeto: totalNeto,
        moneda: 'CLP'
      };

    } catch (error) {
      // Log contextual information to help debug why preference creation fails
      try {
        const debugInfo = {
          id_cita: id_cita || null,
          tipo_pago: tipo_pago || null,
          monto_total: cita ? cita.monto_total : null,
          pago_abono: cita ? cita.pago_abono : null,
          montoPendiente: typeof montoAPagar !== 'undefined' ? montoAPagar : null,
          comisionCalculada: typeof comisionAplicada !== 'undefined' ? comisionAplicada : null
        };
        if (process.env.NODE_ENV !== 'production') {
          console.error('DEBUG pago.crearPreferencia fallo - contexto:', JSON.stringify(debugInfo, null, 2));
        } else {
          // In production only log minimal error
          console.error('Error creando preferencia de pago para cita', id_cita);
        }
      } catch (eLog) {
        console.error('Error registrando contexto de fallo de pago:', eLog.message || eLog);
      }

      // If the error is one of our validation messages, rethrow as-is to preserve clarity
      if (error && error.message && (error.message.includes('La cita ya') || error.message.includes('abono') || error.message.includes('expir') || error.message.includes('inválido'))) {
        throw error;
      }

      // Enrich message slightly for UI without leaking internals
      const userMessage = error && error.message ? error.message : 'Error desconocido al crear preferencia de pago';
      console.error('Error creando preferencia de pago:', userMessage);
      throw new Error(`Error al crear preferencia de pago: ${userMessage}`);
    }
  }

  async procesarWebhook(data) {
    try {
      console.log('[MercadoPago Webhook] Payload crudo recibido:', JSON.stringify(data, null, 2));

      let payload = data && data.data ? data.data : data;
      let id = payload.id || data.id;
      let status = payload.status || data.status || payload.payment_status || data.payment_status;
      let external_reference = payload.external_reference || data.external_reference;

      // Si no tenemos external_reference o status en el payload del webhook (comportamiento oficial de Mercado Pago),
      // debemos consultar la API de Mercado Pago usando el id del pago para recuperar los detalles reales.
      if (id && (!external_reference || !status)) {
        try {
          console.log(`[MercadoPago Webhook] Consultando API de Mercado Pago para pago id: ${id}...`);
          const paymentInstance = new Payment(client);
          const paymentResponse = await paymentInstance.get({ id: String(id) });
          const paymentDetails = paymentResponse?.body || paymentResponse?.response || paymentResponse;
          
          if (paymentDetails) {
            console.log('[MercadoPago Webhook] Detalles obtenidos de la API:', JSON.stringify(paymentDetails, null, 2));
            status = paymentDetails.status;
            external_reference = paymentDetails.external_reference;
          }
        } catch (apiError) {
          console.error(`[MercadoPago Webhook] Error al consultar la API para el pago ${id}:`, apiError.message);
          // Si falla la API pero tenemos datos en el hook, seguimos con lo que hay.
        }
      }

      // Verificar que es una referencia de cita
      if (!external_reference || !external_reference.startsWith('cita_')) {
        console.warn('Webhook recibido pero no corresponde a una cita de FadeBooker o falta la referencia:', external_reference);
        return;
      }

      const id_cita = external_reference.replace('cita_', '');

      // Buscar pago por referencia o fallback por id_cita si no coincide el ID de transacción con el de preferencia
      let pago = await this.pagoRepository.findByReferencia(id);
      if (!pago && id_cita) {
        // Fallback robusto: Buscar pagos pendientes vinculados a la cita para auto-corregir la referencia transaccional
        const pagosCita = await this.pagoRepository.findByCitaId(id_cita);
        pago = pagosCita.find(p => p.estado_pago === 'pendiente');
        if (pago) {
          console.log(`[MercadoPago] Auto-vinculando pago local #${pago.id_pago} con la transacción de pago #${id}`);
          await this.pagoRepository.update(pago.id_pago, {
            referencia_transaccion: String(id)
          });
        }
      }

      if (!pago) {
        console.warn('Pago no encontrado para referencia:', id);
        return;
      }

      // Actualizar estado del pago
      let nuevoEstado = 'pendiente';
      if (status === 'approved') {
        nuevoEstado = 'completado';
      } else if (['rejected', 'cancelled', 'cancelled_by_user', 'failure'].includes(status)) {
        nuevoEstado = 'fallido';
      }

      await this.pagoRepository.update(pago.id_pago, {
        estado_pago: nuevoEstado,
        fecha_pago: new Date()
      });

      // Si el pago fue aprobado, actualizar la cita (con regla de negocio estricta de expiración)
      if (nuevoEstado === 'completado') {
        const cita = await this.citaRepository.findById(id_cita);
        if (cita) {
          // Verificar si ha vencido el tiempo límite de reserva (3 minutos desde cita.createdAt)
          const creationTime = new Date(cita.createdAt).getTime();
          const currentTime = Date.now();
          const diffMinutes = (currentTime - creationTime) / 1000 / 60; // diferencia en minutos

          // Si pasaron más de 3.2 minutos (dando margen de 12 segundos por latencia de red), se rechaza
          if (diffMinutes > 3.2) {
            console.warn(`[MercadoPago Webhook] Límite de tiempo superado. No se acepta la transacción para la cita #${id_cita} (Creada hace ${diffMinutes.toFixed(2)} minutos).`);
            
            // Revertir el estado del pago a fallido en nuestra base de datos
            await this.pagoRepository.update(pago.id_pago, {
              estado_pago: 'fallido',
              fecha_pago: new Date()
            });

            // Registrar en la cita que fue cancelada por expiración
            await this.citaRepository.update(id_cita, {
              estado: 'cancelada',
              notas: (cita.notas || '') + ' [Automatizón: Cita cancelada por exceder el tiempo de pago (3 minutos)].'
            });
            return;
          }

          // Si la cita ya estaba explícitamente cancelada por administración u otro motivo previo
          if (cita.estado === 'cancelada') {
            console.warn(`[MercadoPago Webhook] La cita #${id_cita} ya se encuentra como "cancelada". No se actualizará a confirmada.`);
            return;
          }

          const nuevoAbono = (cita.pago_abono || 0) + pago.monto_pagado;
          const citaUpdate = {
            pago_abono: nuevoAbono,
            metodo_pago: 'mercadopago',
            estado: 'confirmada' // Pasar de pendiente a confirmada al pagar a tiempo
          };

          // Guard defensivo: nunca permitir que el webhook marque la cita como 'completada' directamente.
          try {
            console.log(`[PagoService] Actualizando cita #${id_cita} a estado 'confirmada' (monto: ${pago.monto_pagado})`);
            await this.citaRepository.update(id_cita, citaUpdate);
            console.log(`[PagoService] Cita #${id_cita} actualizada correctamente a 'confirmada'.`);
          } catch (updateErr) {
            console.error(`[PagoService] Error actualizando cita #${id_cita}:`, updateErr.message || updateErr);
            throw updateErr;
          }

          // Enviar notificación a Power Automate tras confirmar el pago
          try {
            const { enviarReserva } = require('../../infraestructure/automation/PowerAutomateService');
            const citaDetalle = await this.citaRepository.findByIdConDetalles(id_cita);
            if (citaDetalle) {
              const fechaHoraInicio = new Date(citaDetalle.fecha_hora_inicio);
              const fechaHoraFin = new Date(fechaHoraInicio.getTime() + (citaDetalle.duracion_minutos || 30) * 60000);
              try {
                await enviarReserva({
                  cliente: citaDetalle.cliente_nombre || '',
                  telefono: citaDetalle.cliente_telefono || '',
                  correo: citaDetalle.cliente_email || '',
                  fecha: fechaHoraInicio.toISOString().split('T')[0],
                  hora: fechaHoraInicio.toISOString().split('T')[1].slice(0, 5),
                  fecha_hora_iso: fechaHoraInicio.toISOString(),
                  fecha_hora_fin_iso: fechaHoraFin.toISOString(),
                  duracion: citaDetalle.duracion_minutos || 30,
                  servicio: citaDetalle.nombre_servicio || '',
                  barbero: citaDetalle.barbero_nombre || '',
                  tienda: citaDetalle.nombre_tienda || '',
                  id_cita: citaDetalle.id_cita
                });
                console.log(`[PowerAutomate] Notificación de confirmación de pago enviada para cita #${id_cita}`);
              } catch (notificationError) {
                console.error('[PowerAutomate] Error enviando notificación de confirmación:', notificationError.message || notificationError);
              }

              // Enviar mensaje a Telegram cuando el pago de la cita quede confirmado
              try {
                const telegramChatId = process.env.TELEGRAM_CHAT_ID;
                const fechaHoraTexto = `${fechaHoraInicio.toISOString().split('T')[0]} ${fechaHoraInicio.toISOString().split('T')[1].slice(0, 5)}`;
                const mensajeTelegram = `Pago confirmado\n` +
                  `Tu reserva #${id_cita} ha sido confirmada.\n` +
                  `Servicio: ${citaDetalle.nombre_servicio || 'N/A'}\n` +
                  `Barbero: ${citaDetalle.barbero_nombre || 'N/A'}\n` +
                  `Fecha: ${fechaHoraTexto}\n` +
                  `Monto: $${pago.monto_pagado}`;

                if (telegramChatId) {
                  console.log('[Telegram] Chat ID disponible, enviando mensaje...');
                  await sendTelegramMessage(telegramChatId, mensajeTelegram);
                  console.log(`[Telegram] Intento de envío completado para chat ${telegramChatId} y cita #${id_cita}`);
                } else {
                  console.warn('[Telegram] TELEGRAM_CHAT_ID no definido; mensaje no enviado');
                }
              } catch (telegramError) {
                console.error('[Telegram] Error enviando mensaje de confirmación de pago:', telegramError.message || telegramError);
              }
            }
          } catch (notificationError) {
            console.error('[PowerAutomate] Error enviando notificación de confirmación:', notificationError.message || notificationError);
          }
        }
      }

      console.log(`Pago ${id} actualizado a estado: ${nuevoEstado}`);

    } catch (error) {
      console.error('Error procesando webhook:', error);
      throw error;
    }
  }
}

module.exports = PagoService;