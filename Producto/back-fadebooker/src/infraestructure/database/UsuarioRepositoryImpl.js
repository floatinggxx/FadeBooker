const db = require('../../db/knex')

class UsuarioRepositoryImpl {
  constructor() {
    this.db = db
  }

  async create(data) {
    const [result] = await this.db('Usuario').insert(data).returning('id_usuario')
    // 🛡️ Manejo robusto para MSSQL/Tedious que a veces retorna el objeto o el valor
    const id = (result && typeof result === 'object') ? result.id_usuario : result
    return id
  }

  async findById(id) {
    return this.db('Usuario').where({ id_usuario: id }).first()
  }

  async findByEmail(email) {
    return this.db('Usuario').where({ email }).first()
  }

  async update(id, data) {
    return this.db('Usuario').where({ id_usuario: id }).update(data)
  }

  async delete(id) {
    return this.db('Usuario').where({ id_usuario: id }).del()
  }

  async findAll() {
    return this.db('Usuario').select()
  }
}

module.exports = UsuarioRepositoryImpl