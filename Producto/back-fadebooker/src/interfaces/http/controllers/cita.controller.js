const CitaRepository = require('../../../infraestructure/database/CitaRepositoryImpl');
const ServicioRepository = require('../../../infraestructure/database/ServicioRepositoryImpl');
const CitaService = require('../../../application/usecases/cita.service');

const citaRepository = new CitaRepository();
const servicioRepository = new ServicioRepository();
const citaService = new CitaService(citaRepository, servicioRepository);

const CitaController = {
  async crear(req, res) {
    try {
      const citaId = await citaService.crearCita(req.body)
      res.status(201).json({ id: citaId, mensaje: 'Cita creada exitosamente' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async cambiarEstado(req, res) {
    try {
      const { id } = req.params
      const { estado, motivo_cancelacion } = req.body
      await citaService.actualizarEstado(id, estado, motivo_cancelacion)
      res.json({ mensaje: `Cita actualizada a estado: ${estado}` })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async checkDisponibilidad(req, res) {
    try {
      const { idBarbero, fecha, hora, duracion } = req.query
      if (!idBarbero || !fecha || !hora || !duracion) {
        return res.status(400).json({ error: 'Faltan parámetros: idBarbero, fecha, hora, duracion' })
      }
      const disponible = await citaService.verificarDisponibilidad(
        parseInt(idBarbero), 
        fecha, 
        hora, 
        parseInt(duracion)
      )
      res.json({ disponible })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params
      const cita = await citaService.obtenerCitaPorId(id)
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' })
      }
      res.json(cita)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params
      await citaService.eliminarCita(id)
      res.json({ mensaje: 'Cita eliminada' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = CitaController