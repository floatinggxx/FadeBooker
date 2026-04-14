const UsuarioRepository = require('./usuario.repository')

class ClienteRepository extends UsuarioRepository {
  async findByTelefono(telefono) {
    throw new Error('Método findByTelefono() debe ser implementado')
  }

  async findByNombre(nombre) {
    throw new Error('Método findByNombre() debe ser implementado')
  }

  async actualizarPuntos(id_cliente, puntos) {
    throw new Error('Método actualizarPuntos() debe ser implementado')
  }
}

module.exports = ClienteRepository