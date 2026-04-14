const ClienteRepository = require('../../infraestructure/database/ClienteRepositoryImpl')
const clienteRepository = new ClienteRepository()

const ClienteService = {
  async crearCliente(data) {
    return clienteRepository.create(data)
  },

  async obtenerClientePorId(id) {
    return clienteRepository.findById(id)
  },

  async obtenerClientePorEmail(email) {
    return clienteRepository.findByEmail(email)
  },

  async buscarClientePorNombre(nombre) {
    return clienteRepository.findByNombre(nombre)
  },

  async buscarClientePorTelefono(telefono) {
    return clienteRepository.findByTelefono(telefono)
  },

  async obtenerTodosLosClientes() {
    return clienteRepository.findAll()
  },

  async actualizarCliente(id, data) {
    return clienteRepository.update(id, data)
  },

  async eliminarCliente(id) {
    return clienteRepository.delete(id)
  },

  async actualizarPuntosCliente(id_cliente, puntos) {
    return clienteRepository.actualizarPuntos(id_cliente, puntos)
  }
}

module.exports = ClienteService
