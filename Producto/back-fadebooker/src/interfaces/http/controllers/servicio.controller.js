const ServicioRepository = require('../../../infraestructure/database/ServicioRepositoryImpl');
const ServicioService = require('../../../application/usecases/servicio.service');

const servicioRepository = new ServicioRepository();
const servicioService = new ServicioService(servicioRepository);

const ServicioController = {
  async crear(req, res) {
    try {
      const servicio = await servicioService.crearServicio(req.body)
      res.status(201).json(servicio)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params
      const servicio = await servicioService.obtenerServicioPorId(id)
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
      const servicios = await servicioService.buscarServicioPorNombre(nombre)
      res.json(servicios)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerTodos(req, res) {
    try {
      const servicios = await servicioService.obtenerTodosLosServicios()
      res.json(servicios)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params
      const servicio = await servicioService.actualizarServicio(id, req.body)
      res.json(servicio)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params
      await servicioService.eliminarServicio(id)
      res.json({ mensaje: 'Servicio eliminado' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorBarbero(req, res) {
    try {
      const { id_barbero } = req.params
      const servicios = await servicioService.obtenerServiciosPorBarbero(id_barbero)
      res.json(servicios)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = ServicioController
