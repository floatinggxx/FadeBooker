const db = require('../../db/knex')

class ServicioRepositoryImpl {
  constructor() {
    this.db = db
  }

  async create(data) {
    const result = await this.db('Servicio')
      .insert(data)
      .returning('id_servicio')
    
    if (result && Array.isArray(result) && result.length > 0) {
      const id = result[0]
      return typeof id === 'object' ? id.id_servicio : id
    }
    return result
  }

  async findById(id) {
    return this.db('Servicio').where({ id_servicio: id }).first()
  }

  async findByNombre(nombre) {
    return this.db('Servicio').where('nombre_servicio', 'like', `%${nombre}%`).select()
  }

  async update(id, data) {
    return this.db('Servicio').where({ id_servicio: id }).update(data)
  }

  async delete(id) {
    return this.db('Servicio').where({ id_servicio: id }).del()
  }

  async findAll() {
    return this.db('Servicio').select()
  }

  /**
   * ACTUALIZADO (v1.1.0): Obtener servicios disponibles para un barbero específico
   * Reemplaza findByTienda() con lógica de ServicioBarbero
   * 
   * @param {number} id_barbero - ID del barbero
   * @returns {Promise<Array>} Servicios que puede ofrecer el barbero
   */
  async findByBarbero(id_barbero) {
    // Obtener servicios disponibles para un barbero usando ServicioBarbero
    return this.db('ServicioBarbero')
      .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
      .where('ServicioBarbero.id_barbero', id_barbero)
      .where('ServicioBarbero.disponible', true)
      .select(
        'Servicio.*',
        this.db.raw('ISNULL(ServicioBarbero.precio_barbero, Servicio.precio_base) as precio'),
        this.db.raw('ISNULL(ServicioBarbero.tiempo_servicio_minutos, Servicio.duracion_minutos) as duracion')
      )
  }
}

module.exports = ServicioRepositoryImpl