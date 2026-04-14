const CitaService = require('../../../application/usecases/cita.service')

const CitaController = {
  async crear(req, res) {
    try {
      const cita = await CitaService.crearCita(req.body)
      res.json(cita)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async cambiarEstado(req, res) {
    try {
      const { id } = req.params
      const { estado } = req.body
      await CitaService.actualizarEstado(id, estado)
      res.json({ mensaje: 'Estado actualizado' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = CitaController