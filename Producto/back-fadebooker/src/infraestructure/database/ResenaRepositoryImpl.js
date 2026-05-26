const db = require('../../db/knex')

class ResenaRepositoryImpl {
  async create(resenaData) {
    const [id] = await db('Reseña').insert({
      id_cita: resenaData.id_cita,
      id_cliente: resenaData.id_cliente,
      id_barbero: resenaData.id_barbero,
      id_tienda: resenaData.id_tienda,
      puntuacion: resenaData.puntuacion,
      comentario: resenaData.comentario,
      fecha_resena: new Date()
    }).returning('id_resena')
    
    return id
  }

  async getByCitaId(id_cita) {
    return await db('Reseña').where({ id_cita }).first()
  }

  async getByTiendaId(id_tienda) {
    return await db('Reseña')
      .select('Reseña.*', 'Usuario.nombre as nombre_cliente', 'Usuario.apellido as apellido_cliente')
      .join('Usuario', 'Reseña.id_cliente', '=', 'Usuario.id_usuario')
      .where({ id_tienda })
      .orderBy('fecha_resena', 'desc')
  }
}

module.exports = new ResenaRepositoryImpl()
