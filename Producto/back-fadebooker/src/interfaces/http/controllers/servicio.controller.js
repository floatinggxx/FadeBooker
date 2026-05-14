const ServicioService = require('../../../application/usecases/servicio.service')
const { ServicioSchema } = require('../validations/servicioBarbero.validation')

const ServicioController = {
  async crear(req, res) {
    try {
      const validatedData = ServicioSchema.parse(req.body)
      const servicio = await ServicioService.crearServicio(validatedData)
      res.status(201).json(servicio)
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Error de validación', detalles: error.errors })
      }
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params
      const servicio = await ServicioService.obtenerServicioPorId(id)
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' })
      }
      res.json(servicio)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async buscarPorNombre(req, res) {
    try {
      const { nombre } = req.query
      const servicios = await ServicioService.buscarServicioPorNombre(nombre)
      res.json(servicios)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerTodos(req, res) {
    try {
      const servicios = await ServicioService.obtenerTodosLosServicios()
      res.json(servicios)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params
      // Usar partial() para actualizaciones parciales
      const validatedData = ServicioSchema.partial().parse(req.body)
      const servicio = await ServicioService.actualizarServicio(id, validatedData)
      res.json(servicio)
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Error de validación', detalles: error.errors })
      }
      res.status(400).json({ error: error.message })
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params
      await ServicioService.eliminarServicio(id)
      res.json({ mensaje: 'Servicio eliminado' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorBarbero(req, res) {
    try {
      const { id_barbero } = req.params
      const servicios = await ServicioService.obtenerServiciosPorBarbero(id_barbero)
      res.json(servicios)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = ServicioController
