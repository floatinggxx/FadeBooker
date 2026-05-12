const db = require('../../db/knex')
const LogRepository = require('../../domain/repositories/LogRepository')

class LogRepositoryImpl extends LogRepository {
  constructor() {
    super()
    this.db = db
  }

  async save(logRecord) {
    try {
      await this.db('LogErrores').insert({
        mensaje: logRecord.mensaje,
        stack_trace: logRecord.stack_trace,
        usuario_id: logRecord.usuario_id,
        endpoint: logRecord.endpoint,
        metodo_http: logRecord.metodo_http,
        nivel: logRecord.nivel,
        fecha_error: logRecord.createdAt // Asumiendo que el campo en BD podría ser fecha_error
      })
    } catch (error) {
      // Manejo silencioso para evitar bucles infinitos
      console.error('Error crítico guardando LOG en BD:', error.message)
    }
  }

  async findAll() {
    return this.db('LogErrores').select('*').orderBy('id_log', 'desc')
  }
}

module.exports = LogRepositoryImpl
