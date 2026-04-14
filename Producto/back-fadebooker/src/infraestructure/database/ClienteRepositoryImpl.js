const UsuarioRepositoryImpl = require('./UsuarioRepositoryImpl')

class ClienteRepositoryImpl extends UsuarioRepositoryImpl {
  async findByTelefono(telefono) {
    return this.db('Cliente').where({ telefono }).first()
  }

  async findByNombre(nombre) {
    return this.db('Cliente').where('nombre', 'like', `%${nombre}%`).select()
  }

  async actualizarPuntos(id_cliente, puntos) {
    return this.db('Cliente').where({ id_cliente }).update({ puntos_acumulados: puntos })
  }
}

module.exports = ClienteRepositoryImpl