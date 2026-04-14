const ServicioService = require('../../../application/usecases/servicio.service')

const ServicioController = {
  async crear(req, res) {
    try {
      const servicio = await ServicioService.crearServicio(req.body)
      res.status(201).json(servicio)
    } catch (error) {
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
      const servicio = await ServicioService.actualizarServicio(id, req.body)
      res.json(servicio)
    } catch (error) {
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

  async obtenerPorTienda(req, res) {
    try {
      const { id_tienda } = req.params
      const servicios = await ServicioService.obtenerServiciosPorTienda(id_tienda)
      res.json(servicios)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = ServicioController