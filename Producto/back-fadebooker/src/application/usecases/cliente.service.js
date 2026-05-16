class ClienteService {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async crearCliente(data) {
    return this.clienteRepository.create(data)
  }

  async obtenerClientePorId(id) {
    return this.clienteRepository.findById(id)
  }

  async obtenerClientePorEmail(email) {
    return this.clienteRepository.findByEmail(email)
  }

  async buscarClientePorNombre(nombre) {
    return this.clienteRepository.findByNombre(nombre)
  }

  async buscarClientePorTelefono(telefono) {
    return this.clienteRepository.findByTelefono(telefono)
  }

  async obtenerTodosLosClientes() {
    return this.clienteRepository.findAll()
  }

  async actualizarCliente(id, data) {
    return this.clienteRepository.update(id, data)
  }

  async eliminarCliente(id) {
    return this.clienteRepository.delete(id)
  }

  async actualizarPuntosCliente(id_cliente, puntos) {
    return this.clienteRepository.actualizarPuntos(id_cliente, puntos)
  }
}

module.exports = ClienteService
