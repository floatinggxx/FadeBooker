const BloqueHorarioRepository = require('../../domain/repositories/bloqueHorario.repository')
const db = require('../../db/knex')

class BloqueHorarioRepositoryImpl extends BloqueHorarioRepository {
  async crear(id_barbero, fecha_hora_inicio, fecha_hora_fin, motivo) {
    try {
      const result = await db('BloqueHorario')
        .insert({
          id_barbero,
          fecha_hora_inicio,
          fecha_hora_fin,
          motivo: motivo || null,
          estado: 1,
          createdAt: db.raw('GETDATE()'),
          updatedAt: db.raw('GETDATE()')
        })
        .returning('id_bloque')

      let id_bloque = null
      if (result && Array.isArray(result) && result.length > 0) {
        const id = result[0]
        id_bloque = typeof id === 'object' ? id.id_bloque : id
      } else {
        id_bloque = result
      }

      return await this.obtenerPorId(id_bloque)
    } catch (error) {
      throw new Error(`Error al crear bloque horario: ${error.message}`)
    }
  }

  async obtenerPorBarberoYFecha(id_barbero, fecha) {
    try {
      // La fecha viene en formato 'YYYY-MM-DD'
      const inicioDelDia = `${fecha} 00:00:00`
      const finDelDia = `${fecha} 23:59:59`

      return await db('BloqueHorario')
        .where({ id_barbero, estado: 1 })
        .whereBetween('fecha_hora_inicio', [inicioDelDia, finDelDia])
        .orderBy('fecha_hora_inicio', 'asc')
        .select()
    } catch (error) {
      throw new Error(`Error al obtener bloques por barbero y fecha: ${error.message}`)
    }
  }

  async obtenerPorId(id_bloque) {
    try {
      return await db('BloqueHorario')
        .where({ id_bloque, estado: 1 })
        .first()
    } catch (error) {
      throw new Error(`Error al obtener bloque: ${error.message}`)
    }
  }

  async eliminar(id_bloque) {
    try {
      return await db('BloqueHorario')
        .where({ id_bloque })
        .update({ 
          estado: 0, 
          updatedAt: db.raw('GETDATE()') 
        })
    } catch (error) {
      throw new Error(`Error al eliminar bloque: ${error.message}`)
    }
  }

  async obtenerPorBarbero(id_barbero) {
    try {
      return await db('BloqueHorario')
        .where({ id_barbero, estado: 1 })
        .orderBy('fecha_hora_inicio', 'desc')
        .select()
    } catch (error) {
      throw new Error(`Error al obtener bloques por barbero: ${error.message}`)
    }
  }
}

module.exports = BloqueHorarioRepositoryImpl
