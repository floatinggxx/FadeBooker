class LogRecord {
  constructor({ id_log, mensaje, stack_trace, usuario_id, endpoint, metodo_http, nivel, createdAt }) {
    this.id_log = id_log
    this.mensaje = mensaje
    this.stack_trace = stack_trace
    this.usuario_id = usuario_id
    this.endpoint = endpoint
    this.metodo_http = metodo_http
    this.nivel = nivel || 'Error'
    this.createdAt = createdAt || new Date()
  }
}

module.exports = LogRecord
