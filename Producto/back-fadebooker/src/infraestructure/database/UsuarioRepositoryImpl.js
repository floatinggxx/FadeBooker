const db = require('../../db/knex')

class UsuarioRepositoryImpl {
  constructor() {
    this.db = db
  }

  async create(data) {
<<<<<<< Updated upstream
    // Para Azure SQL, es más seguro usar returning o manejar el resultado de insert
    const result = await this.db('Usuario')
      .insert(data)
      .returning('id_usuario')
    
    // Knex suele retornar un array con los IDs insertados
    if (result && Array.isArray(result) && result.length > 0) {
      const id = result[0]
      return typeof id === 'object' ? id.id_usuario : id
    }
    
    return result
=======
    const [result] = await this.db('Usuario').insert(data).returning('id_usuario')
    // 🛡️ Manejo robusto para MSSQL/Tedious que a veces retorna el objeto o el valor
    const id = (result && typeof result === 'object') ? result.id_usuario : result
    return id
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