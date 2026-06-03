const db = require('../../db/knex')

class ResenaRepositoryImpl {
  async create(resenaData) {
    const result = await db.raw(`
      DECLARE @InsertedTable TABLE (id_resena INT);
      INSERT INTO [dbo].[Reseña] (id_cita, id_cliente, id_barbero, id_tienda, puntuacion, comentario, fecha_resena)
      OUTPUT INSERTED.id_resena INTO @InsertedTable
      VALUES (?, ?, ?, ?, ?, ?, ?);
      SELECT id_resena FROM @InsertedTable;
    `, [
      resenaData.id_cita,
      resenaData.id_cliente,
      resenaData.id_barbero,
      resenaData.id_tienda,
      resenaData.puntuacion,
      resenaData.comentario,
      new Date()
    ]);

    const extractId = (value) => {
      if (value == null) return null;
      if (Array.isArray(value)) {
        for (const item of value) {
          const found = extractId(item);
          if (found) return found;
        }
        return null;
      }
      if (typeof value === 'object') {
        if (value.id_resena != null) return value.id_resena;
        for (const key of Object.keys(value)) {
          const found = extractId(value[key]);
          if (found) return found;
        }
      }
      return null;
    };

    const id_resena = extractId(result);
    if (!id_resena) {
      throw new Error('No se pudo obtener el id de la reseña insertada');
    }
    return id_resena;
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
