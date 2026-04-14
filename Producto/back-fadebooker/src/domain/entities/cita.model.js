class Cita {
  constructor({ id_cita, fecha_hora_inicio, estado }) {
    this.id_cita = id_cita
    this.fecha_hora_inicio = fecha_hora_inicio
    this.estado = estado
  }
}

module.exports = Cita