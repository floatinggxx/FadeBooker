class Cita {
  constructor({ id_cita, id_cliente, id_barbero, id_servicio, id_tienda, fecha_hora_inicio, duracion_minutos, estado, monto_total, pago_abono, metodo_pago, notas, createdAt, updatedAt }) {
    this.id_cita = id_cita
    this.id_cliente = id_cliente
    this.id_barbero = id_barbero
    this.id_servicio = id_servicio
    this.id_tienda = id_tienda
    this.fecha_hora_inicio = fecha_hora_inicio
    this.duracion_minutos = duracion_minutos
    this.estado = estado
    this.monto_total = monto_total
    this.pago_abono = pago_abono
    this.metodo_pago = metodo_pago
    this.notas = notas
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

module.exports = Cita