const { client, Preference, Payment } = require('../../config/mercadopago');

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
        throw new Error('La cita ha expirado por tiempo de espera (límite 3 minutos). Por favor genere una nueva cita.');
      }

      // Crear instancia de Preferencia
      const preference = new Preference(client);

      // Crear preferencia en Mercado Pago con expiración de 10 minutos para dar tiempo al usuario a pagar
      const body = {
        items: [
          {
            title: `Reserva FadeBooker - ${tipo_pago === 'abono' ? 'Abono 50%' : 'Pago Total'} Cita #${id_cita}`,
            quantity: 1,
            unit_price: Number(montoAPagar)
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
        expiration_date_to: new Date(Date.now() + 10 * 60 * 1000).toISOString() // Expira en 10 minutos para el link de pago
      };

      const response = await preference.create({ body });

      // Crear registro de pago pendiente
      const pagoData = {
        id_cita: id_cita,
        monto_pagado: montoAPagar,
        metodo_pago: 'mercadopago',
        estado_pago: 'pendiente',
        referencia_transaccion: response.id
      };

      await this.pagoRepository.create(pagoData);

      return {
        url: response.init_point,
        preference_id: response.id
      };

    } catch (error) {
      console.error('Error creando preferencia de pago:', error);
      throw new Error(`Error al crear preferencia de pago: ${error.message}`);
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
          const paymentDetails = await paymentInstance.get({ id: String(id) });
          
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

          await this.citaRepository.update(id_cita, citaUpdate);
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