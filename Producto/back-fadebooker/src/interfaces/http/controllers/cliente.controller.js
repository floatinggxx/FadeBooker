const ClienteRepository = require('../../../infraestructure/database/ClienteRepositoryImpl')
const ClienteService = require('../../../application/usecases/cliente.service')

const clienteRepository = new ClienteRepository()
const clienteService = new ClienteService(clienteRepository)

const ClienteController = {
  async crear(req, res) {
    try {
      const cliente = await clienteService.crearCliente(req.body)
      res.status(201).json(cliente)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params
      const cliente = await clienteService.obtenerClientePorId(id)
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' })
      }
      res.json(cliente)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorEmail(req, res) {
    try {
      const { email } = req.params
      const cliente = await clienteService.obtenerClientePorEmail(email)
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' })
      }
      res.json(cliente)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async buscarPorNombre(req, res) {
    try {
      const { nombre } = req.query
      const clientes = await clienteService.buscarClientePorNombre(nombre)
      res.json(clientes)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async buscarPorTelefono(req, res) {
    try {
      const { telefono } = req.params
      const cliente = await clienteService.buscarClientePorTelefono(telefono)
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' })
      }
      res.json(cliente)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerTodos(req, res) {
    try {
      const clientes = await clienteService.obtenerTodosLosClientes()
      res.json(clientes)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params
      const cliente = await clienteService.actualizarCliente(id, req.body)
      res.json(cliente)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params
      await clienteService.eliminarCliente(id)
      res.json({ mensaje: 'Cliente eliminado' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizarPuntos(req, res) {
    try {
      const { id } = req.params
      const { puntos } = req.body
      await clienteService.actualizarPuntosCliente(id, puntos)
      res.json({ mensaje: 'Puntos actualizados' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = ClienteController
