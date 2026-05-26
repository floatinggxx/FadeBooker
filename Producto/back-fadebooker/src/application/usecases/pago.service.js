const { client, Preference } = require('../../config/mercadopago');

class PagoService {
  constructor(pagoRepository, citaRepository) {
    this.pagoRepository = pagoRepository;
    this.citaRepository = citaRepository;
  }

  async crearPreferenciaPago(id_cita) {
    try {
      // Obtener datos de la cita
      const cita = await this.citaRepository.findById(id_cita);
      if (!cita) {
        throw new Error('Cita no encontrada');
      }

      // Calcular monto a pagar (total - abono ya pagado)
      const montoPendiente = cita.monto_total - (cita.pago_abono || 0);
      if (montoPendiente <= 0) {
        throw new Error('La cita ya está completamente pagada');
      }

      // Crear instancia de Preferencia
      const preference = new Preference(client);

      // Crear preferencia en Mercado Pago
      const body = {
        items: [
          {
            title: `Reserva FadeBooker - Cita #${id_cita}`,
            quantity: 1,
            unit_price: Number(montoPendiente)
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
        external_reference: `cita_${id_cita}`
      };

      const response = await preference.create({ body });

      // Crear registro de pago pendiente
      const pagoData = {
        id_cita: id_cita,
        monto_pagado: montoPendiente,
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
      const payload = data && data.data ? data.data : data;
      const id = payload.id || data.id;
      const status = payload.status || data.status || payload.payment_status || data.payment_status;
      const external_reference = payload.external_reference || data.external_reference;

      // Verificar que es una referencia de cita
      if (!external_reference || !external_reference.startsWith('cita_')) {
        console.warn('Webhook recibido pero no corresponde a una cita:', external_reference);
        return;
      }

      const id_cita = external_reference.replace('cita_', '');

      // Buscar pago por referencia
      const pago = await this.pagoRepository.findByReferencia(id);
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

      // Si el pago fue aprobado, actualizar la cita
      if (nuevoEstado === 'completado') {
        const cita = await this.citaRepository.findById(id_cita);
        if (cita) {
          const nuevoAbono = (cita.pago_abono || 0) + pago.monto_pagado;
          const citaUpdate = {
            pago_abono: nuevoAbono,
            metodo_pago: 'mercadopago',
            estado: 'confirmada' // Pasar de pendiente a confirmada al pagar
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