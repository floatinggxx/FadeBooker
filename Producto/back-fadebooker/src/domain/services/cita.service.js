const db = require('../../db/knex')

const CitaService = {
  async crearCita(data) {
    // validar disponibilidad
    const existente = await db('Cita')
      .where({
        fecha_hora_inicio: data.fecha_hora_inicio,
        id_cliente: data.id_cliente
      })
      .first()

    if (existente) {
      throw new Error('Horario no disponible')
    }

    // crear cita
    return db('Cita').insert({
      ...data,
      estado: 'CREADO'
    })
  },

  async actualizarEstado(id, estado) {
    return db('Cita')
      .where({ id_cita: id })
      .update({ estado })
  }
}

module.exports = CitaService