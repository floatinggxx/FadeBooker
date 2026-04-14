const UsuarioRepositoryImpl = require('./UsuarioRepositoryImpl')
const db = require('../../db/knex')

class ClienteRepositoryImpl extends UsuarioRepositoryImpl {
  async findByTelefono(telefono) {
    return db('Usuario').where({ telefono, rol: 'cliente' }).first()
  }

  async findByNombre(nombre) {
    return db('Usuario')
      .where('nombre', 'like', `%${nombre}%`)
      .where({ rol: 'cliente' })
      .select()
  }

  async actualizarPuntos(id_usuario, puntos) {
    return db('Usuario').where({ id_usuario }).update({ puntos_acumulados: puntos })
  }

  async findAll() {
    return db('Usuario').where({ rol: 'cliente' }).orderBy('nombre').select()
  }

  async findById(id_usuario) {
    return db('Usuario').where({ id_usuario, rol: 'cliente' }).first()
  }
}

module.exports = ClienteRepositoryImpl