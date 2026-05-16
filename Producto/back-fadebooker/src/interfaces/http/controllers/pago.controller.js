const PagoRepositoryImpl = require('../../../infraestructure/database/PagoRepositoryImpl');
const CitaRepositoryImpl = require('../../../infraestructure/database/CitaRepositoryImpl');
const PagoService = require('../../../application/usecases/pago.service');

const pagoRepository = new PagoRepositoryImpl();
const citaRepository = new CitaRepositoryImpl();
const pagoService = new PagoService(pagoRepository, citaRepository);

const PagoController = {
  async crearPreferencia(req, res) {
    try {
      const { id_cita } = req.body;

      if (!id_cita) {
        return res.status(400).json({ error: 'id_cita es requerido' });
      }

      const resultado = await pagoService.crearPreferenciaPago(id_cita);
      res.json(resultado);
    } catch (error) {
      console.error('Error en crearPreferencia:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async webhook(req, res) {
    try {
      console.log('Webhook recibido:', req.body);

      await pagoService.procesarWebhook(req.body);

      res.sendStatus(200);
    } catch (error) {
      console.error('Error en webhook:', error);
      res.status(500).json({ error: error.message });
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