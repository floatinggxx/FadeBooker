const db = require('../../db/knex')

class UsuarioRepositoryImpl {
  constructor() {
    this.db = db
  }

  async create(data) {
    // Normalizar rol: primera letra mayúscula y resto minúscula
    const normalizeRol = (r) => {
      if (!r || typeof r !== 'string') return r
      const trimmed = r.trim()
      if (trimmed.length === 0) return r
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
    }

    const payload = { ...data }
    if (payload.rol !== undefined) payload.rol = normalizeRol(payload.rol)

    // Normalizar telefono a formato +56912345678
    const normalizePhone = (p) => {
      if (!p || typeof p !== 'string') return p
      // eliminar espacios y caracteres comunes
      let digits = p.replace(/[^0-9]/g, '')
      if (digits.length === 0) return p

      // casos comunes:
      // 9xxxxxxxx -> agregar country code 56
      // 56 9xxxxxxxx -> prefijar +
      // 0 9xxxxxxxx -> quitar 0 agregar +56
      if (/^9\d{8}$/.test(digits)) {
        return '+56' + digits
      }
      if (/^56?9\d{8}$/.test(digits)) {
        // asegurarse de que empieza con 56
        if (digits.startsWith('56')) return '+' + digits
        return '+56' + digits.slice(digits.indexOf('9'))
      }
      if (/^0?9\d{8}$/.test(digits)) {
        // quitar cero inicial
        const nd = digits.replace(/^0/, '')
        return '+56' + nd
      }

      // si ya tiene country code con 56 y resto, asegurar prefijo +
      if (/^56\d{8,}$/.test(digits)) return '+' + digits

      // fallback: devolver con + si no existe
      return '+' + digits
    }

    if (payload.telefono !== undefined) payload.telefono = normalizePhone(payload.telefono)

    // Intentar insertar y obtener id usando returning (Postgres, SQLite)
    try {
      const result = await this.db('Usuario')
        .insert(payload)
        .returning('id_usuario')

      // Knex puede devolver diferentes formatos según el cliente (array o objeto)
      if (Array.isArray(result) && result.length > 0) {
        const idPayload = result[0]
        return (idPayload && typeof idPayload === 'object') ? idPayload.id_usuario : idPayload
      }

      if (result && typeof result === 'number') return result
      if (result && typeof result === 'object' && result.id_usuario) return result.id_usuario
    } catch (err) {
      // Si falla (por ejemplo MSSQL con triggers y OUTPUT), caeremos al fallback
      // console.warn('[UsuarioRepositoryImpl] returning() failed, usando fallback SCOPE_IDENTITY()', err && err.message)
    }

    // Fallback para MSSQL o adaptadores que no soportan returning(): insertar y leer SCOPE_IDENTITY()
    // Usamos raw para asegurar compatibilidad con SQL Server
    const trx = await this.db.transaction()
    try {
      await trx('Usuario').insert(payload)
      const rows = await trx.raw('SELECT SCOPE_IDENTITY() AS id')
      await trx.commit()

      // rows puede variar según driver: en tedious, rows.recordset[0].id
      if (rows && rows.recordset && rows.recordset[0] && rows.recordset[0].id) {
        return rows.recordset[0].id
      }
      if (Array.isArray(rows) && rows.length > 0 && rows[0].id) return rows[0].id
      if (rows && rows.id) return rows.id

      // último recurso: retornar null y dejar que quien llama maneje el caso
      return null
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }

  async findById(id) {
    const row = await this.db('Usuario').where({ id_usuario: id }).first()
    return this._mapToDomain(row)
  }

  async findByEmail(email) {
    const row = await this.db('Usuario').where({ email }).first()
    return this._mapToDomain(row)
  }

  async findByPhone(phone) {
    const row = await this.db('Usuario').where({ telefono: phone }).first()
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
