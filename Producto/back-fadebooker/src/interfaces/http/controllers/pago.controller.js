const PagoRepositoryImpl = require('../../../infraestructure/database/PagoRepositoryImpl');
const CitaRepositoryImpl = require('../../../infraestructure/database/CitaRepositoryImpl');
const PagoService = require('../../../application/usecases/pago.service');

const pagoRepository = new PagoRepositoryImpl();
const citaRepository = new CitaRepositoryImpl();
const pagoService = new PagoService(pagoRepository, citaRepository);

const PagoController = {
  async crearPreferencia(req, res, next) {
    try {
      const { id_cita, tipo_pago } = req.body;

      if (!id_cita) {
        return res.status(400).json({ error: 'id_cita es requerido' });
      }

      const resultado = await pagoService.crearPreferenciaPago(id_cita, tipo_pago);
      res.json(resultado);
    } catch (error) {
      console.error('Error en crearPreferencia:', error && error.message ? error.message : error);
      // Errores de validación o de negocio deben responderse con 400 para que el frontend pueda mostrar mensajes claros
      const msg = error && error.message ? error.message : 'Error desconocido al crear preferencia';
      if (typeof msg === 'string' && (msg.includes('La cita ya') || msg.includes('abono') || msg.includes('expir') || msg.includes('inválido'))) {
        return res.status(400).json({ error: msg });
      }
      next(error);
    }
  },

  async webhook(req, res, next) {
    try {
      console.log('Webhook recibido (body):', req.body);
      console.log('Webhook recibido (query):', req.query);

      // Combinar query params y body para dar soporte completo tanto a Webhooks como a notificaciones IPN de Mercado Pago
      const webhookData = { ...req.query, ...req.body };

      await pagoService.procesarWebhook(webhookData);

      res.sendStatus(200);
    } catch (error) {
      console.error('Error en webhook:', error);
      next(error);
    }
  },

  async simular(req, res) {
    try {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Simulación de pagos no está permitida en producción' });
      }

      const { id_cita, monto, referencia } = req.body;
      if (!id_cita) return res.status(400).json({ error: 'id_cita es requerido para simular pago' });

      console.log('[PagoController.simular] petición simulación recibida:', { id_cita, monto, referencia });
      // Crear registro de pago completado directamente
      // Limitar el monto aplicado para no exceder monto_total de la cita
      const cita = await citaRepository.findById(id_cita);
      if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
      const montoTotal = Number(cita.monto_total || 0);
      const pagoActual = Number(cita.pago_abono || 0);
      const montoSolicitado = Number(monto || 0);
      const montoAplicable = Math.min(montoSolicitado, Math.max(0, montoTotal - pagoActual));

      const pagoData = {
        id_cita: id_cita,
        monto_pagado: montoAplicable,
        monto_base: montoAplicable,
        metodo_pago: 'sandbox_simulado',
        estado_pago: 'completado',
        referencia_transaccion: referencia || `sim_${Date.now()}`,
        fecha_pago: new Date()
      };

      const id_pago = await pagoRepository.create(pagoData);

      // Actualizar la cita como confirmada y sumar el abono (capped)
      const nuevoAbono = pagoActual + montoAplicable;
      await citaRepository.update(id_cita, {
        pago_abono: nuevoAbono,
        metodo_pago: 'sandbox_simulado',
        estado: 'confirmada'
      });

      return res.json({ success: true, id_pago, id_cita, monto_aplicado: montoAplicable, monto_solicitado: montoSolicitado });
    } catch (err) {
      console.error('Error simulando pago:', err);
      return res.status(500).json({ error: err.message || String(err) });
    }
  },

  async obtenerPagosCita(req, res) {
    try {
      const { id_cita } = req.params;
      const pagos = await pagoRepository.findByCitaId(id_cita);
      res.json(pagos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = PagoController;