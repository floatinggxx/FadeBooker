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