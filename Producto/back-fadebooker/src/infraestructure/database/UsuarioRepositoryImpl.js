const db = require('../../db/knex')

class UsuarioRepositoryImpl {
  constructor() {
    this.db = db
  }

  async create(data) {
<<<<<<< Updated upstream
    // 🛡️ Manejo robusto para Azure SQL (MSSQL/Tedious)
    const result = await this.db('Usuario')
      .insert(data)
      .returning('id_usuario')
    
    // Knex suele retornar un array con los IDs insertados en PostgreSQL/MSSQL
    if (result && Array.isArray(result) && result.length > 0) {
      const inserted = result[0]
      return (inserted && typeof inserted === 'object') ? inserted.id_usuario : inserted
    }
    
    return result
=======
    const result = await this.db('Usuario')
      .insert(data)
      .returning('id_usuario');

    if (Array.isArray(result) && result.length > 0) {
      const idPayload = result[0];
      return (idPayload && typeof idPayload === 'object') ? idPayload.id_usuario : idPayload;
    }

    return result;
>>>>>>> Stashed changes
  }

  async findById(id) {
    const row = await this.db('Usuario').where({ id_usuario: id }).first()
    return this._mapToDomain(row)
  }

  async findByEmail(email) {
    const row = await this.db('Usuario').where({ email }).first()
    return this._mapToDomain(row)
  }

  _mapToDomain(row) {
    if (!row) return null
    return {
      ...row,
      id: row.id_usuario,
      fotoUrl: row.foto_perfil_url
    }
  }

  async update(id, data) {
    const updateData = { ...data }
    if (updateData.fotoUrl !== undefined) {
      updateData.foto_perfil_url = updateData.fotoUrl
      delete updateData.fotoUrl
    }
    // Asegurarse de no intentar actualizar el id o id_usuario
    delete updateData.id
    delete updateData.id_usuario
    
    return this.db('Usuario').where({ id_usuario: id }).update(updateData)
  }

  async delete(id) {
    return this.db('Usuario').where({ id_usuario: id }).del()
  }

  async findAll() {
    return this.db('Usuario').select()
  }
}

module.exports = UsuarioRepositoryImpl
