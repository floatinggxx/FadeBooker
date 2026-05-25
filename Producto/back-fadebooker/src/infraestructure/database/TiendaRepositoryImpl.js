const TiendaRepository = require('../../domain/repositories/tienda.repository')
const db = require('../../db/knex')

/**
 * TiendaRepositoryImpl
 * Implementación de TiendaRepository utilizando Knex.js
 */
class TiendaRepositoryImpl extends TiendaRepository {
  /**
   * Obtiene todas las tiendas, opcionalmente filtradas por ciudad
   * @param {Object} filtros - Filtros opcionales (ciudad, etc.)
   * @returns {Promise<Array>} Lista de tiendas
   */
  async findAll(filtros = {}) {
    let query = db('Tienda').where('este_activa', true)

    if (filtros.ciudad) {
      query = query.where('ciudad', 'LIKE', `%${filtros.ciudad}%`)
    }

    return query.select().orderBy('nombre_tienda')
  }

  /**
   * Busca una tienda por su ID
   * @param {number} id_tienda - ID de la tienda
   * @returns {Promise<Object>} La tienda o null
   */
  async findById(id_tienda) {
    return db('Tienda')
      .where({ id_tienda })
      .first()
  }

  /**
   * Busca tiendas por ciudad
   * @param {string} ciudad - Ciudad a buscar
   * @returns {Promise<Array>} Lista de tiendas en esa ciudad
   */
  async findByCiudad(ciudad) {
    return db('Tienda')
      .where({ ciudad, este_activa: true })
      .orderBy('nombre_tienda')
      .select()
  }

  /**
   * Crea una nueva tienda
   * @param {Object} data - Datos de la tienda
   * @returns {Promise<number>} ID de la tienda creada
   */
  async create(data) {
    try {
      const result = await db('Tienda')
        .insert({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning('id_tienda')
      
      if (result && Array.isArray(result) && result.length > 0) {
        const id = result[0]
        return typeof id === 'object' ? id.id_tienda : id
      }
      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * Actualiza una tienda existente
   * @param {number} id_tienda - ID de la tienda
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<boolean>} True si se actualizó
   */
  async update(id_tienda, data) {
    const updated = await db('Tienda')
      .where({ id_tienda })
      .update({
        ...data,
        updatedAt: new Date()
      })
    return updated > 0
  }

  /**
   * Elimina (desactiva) una tienda
   * @param {number} id_tienda - ID de la tienda
   * @returns {Promise<boolean>} True si se desactivó
   */
  async delete(id_tienda) {
    const deleted = await db('Tienda')
      .where({ id_tienda })
      .update({ este_activa: false, updatedAt: new Date() })
    return deleted > 0
  }

  /**
   * Obtiene las reseñas de una tienda
   * @param {number} id_tienda - ID de la tienda
   * @returns {Promise<Array>} Lista de reseñas
   */
  async getResenas(id_tienda) {
    return db('Reseña')
      .join('Usuario', 'Reseña.id_cliente', '=', 'Usuario.id_usuario')
      .where('Reseña.id_tienda', id_tienda)
      .select(
        'Reseña.*',
        'Usuario.nombre',
        'Usuario.apellido',
        'Usuario.foto_perfil_url'
      )
      .orderBy('Reseña.fecha_resena', 'desc')
  }
}

module.exports = TiendaRepositoryImpl
