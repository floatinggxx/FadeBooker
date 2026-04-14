const db = require('../../db/knex')

class UsuarioRepositoryImpl {
  constructor() {
    this.db = db
  }

  async create(data) {
    const [id] = await this.db('Usuario').insert(data).returning('id_usuario')
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