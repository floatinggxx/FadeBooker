const db = require('../../db/knex')

/**
 * ServicioBarberoRepositoryImpl
 * 
 * Gestiona la relación N:N entre Servicios y Barberos
 * Permite que cada barbero tenga servicios específicos que puede ofrecer
 * con precios y duraciones personalizadas (override de valores base)
 * 
 * v1.1.0: Creado como parte de refactorización ServicioTienda → ServicioBarbero
 */
class ServicioBarberoRepositoryImpl {
  constructor() {
    this.db = db
  }

  /**
   * Obtiene todos los servicios que puede ofrecer un barbero
   * @param {number} id_barbero - ID del barbero
   * @returns {Promise<Array>} Array de servicios con precios/duraciones del barbero
   */
  async findByBarbero(id_barbero) {
    return this.db('ServicioBarbero')
      .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
      .where('ServicioBarbero.id_barbero', id_barbero)
      .where('ServicioBarbero.disponible', true)
      .select(
        'Servicio.id_servicio',
        'Servicio.nombre_servicio',
        'Servicio.descripcion',
        'Servicio.duracion_minutos',
        'Servicio.precio_base',
        'ServicioBarbero.id_servicio_barbero',
        'ServicioBarbero.precio_barbero',
        'ServicioBarbero.tiempo_servicio_minutos'
      )
  }

  /**
   * Obtiene todos los barberos que pueden ofrecer un servicio específico
   * @param {number} id_servicio - ID del servicio
   * @returns {Promise<Array>} Array de barberos que ofrecen el servicio
   */
  async findByServicio(id_servicio) {
    return this.db('ServicioBarbero')
      .join('Barbero', 'ServicioBarbero.id_barbero', '=', 'Barbero.id_barbero')
      .join('Usuario', 'Barbero.id_usuario', '=', 'Usuario.id_usuario')
      .where('ServicioBarbero.id_servicio', id_servicio)
      .where('ServicioBarbero.disponible', true)
      .where('Barbero.activo', true)
      .select(
        'Barbero.id_barbero',
        'Usuario.nombre',
        'Usuario.apellido',
        'Usuario.email',
        'Barbero.especialidad',
        'Barbero.calificacion_promedio',
        'ServicioBarbero.id_servicio_barbero',
        'ServicioBarbero.precio_barbero',
        'ServicioBarbero.tiempo_servicio_minutos'
      )
  }

  /**
   * Crea relación entre servicio y barbero
   * @param {number} id_servicio - ID del servicio
   * @param {number} id_barbero - ID del barbero
   * @param {number} precio_barbero - Precio override (nullable, usa precio_base si no se proporciona)
   * @param {number} tiempo_servicio_minutos - Duración override (nullable, usa duracion_minutos si no se proporciona)
   * @returns {Promise<number>} ID de la nueva relación (id_servicio_barbero)
   */
  async create(id_servicio, id_barbero, precio_barbero = null, tiempo_servicio_minutos = null) {
    const [id] = await this.db('ServicioBarbero').insert({
      id_servicio,
      id_barbero,
      precio_barbero,
      tiempo_servicio_minutos,
      disponible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return id.id_servicio_barbero || id
  }

  /**
   * Verifica si un barbero puede hacer un servicio específico
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   * @returns {Promise<boolean>} true si el barbero puede hacer el servicio
   */
  async canBarberoDoServicio(id_barbero, id_servicio) {
    const result = await this.db('ServicioBarbero')
      .where('id_barbero', id_barbero)
      .where('id_servicio', id_servicio)
      .where('disponible', true)
      .first()
    return !!result
  }

  /**
   * Obtiene información específica de la relación Servicio-Barbero
   * @param {number} id_servicio_barbero - ID de la relación
   * @returns {Promise<Object>} Detalles de la relación
   */
  async findById(id_servicio_barbero) {
    return this.db('ServicioBarbero')
      .where('id_servicio_barbero', id_servicio_barbero)
      .first()
  }

  /**
   * Actualiza precio o disponibilidad de un servicio para un barbero
   * @param {number} id_servicio_barbero - ID de la relación
   * @param {Object} data - Datos a actualizar {precio_barbero, tiempo_servicio_minutos, disponible}
   * @returns {Promise<number>} Número de filas actualizadas
   */
  async update(id_servicio_barbero, data) {
    return this.db('ServicioBarbero')
      .where('id_servicio_barbero', id_servicio_barbero)
      .update({
        ...data,
        updatedAt: new Date()
      })
  }

  /**
   * Elimina la relación entre servicio y barbero
   * @param {number} id_servicio_barbero - ID de la relación
   * @returns {Promise<number>} Número de filas eliminadas
   */
  async delete(id_servicio_barbero) {
    return this.db('ServicioBarbero')
      .where('id_servicio_barbero', id_servicio_barbero)
      .del()
  }

  /**
   * Elimina todos los servicios de un barbero
   * @param {number} id_barbero - ID del barbero
   * @returns {Promise<number>} Número de filas eliminadas
   */
  async deleteByBarbero(id_barbero) {
    return this.db('ServicioBarbero')
      .where('id_barbero', id_barbero)
      .del()
  }

  /**
   * Obtiene precio efectivo para una cita (precio_barbero o precio_base)
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   * @returns {Promise<number>} Precio efectivo a cobrar
   */
  async getPrecioEfectivo(id_barbero, id_servicio) {
    const result = await this.db('ServicioBarbero')
      .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
      .where('ServicioBarbero.id_barbero', id_barbero)
      .where('ServicioBarbero.id_servicio', id_servicio)
      .select(
        this.db.raw('ISNULL(ServicioBarbero.precio_barbero, Servicio.precio_base) as precio_efectivo')
      )
      .first()
    return result ? result.precio_efectivo : null
  }

  /**
   * Obtiene duración efectiva para una cita (tiempo_servicio_minutos o duracion_minutos)
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   * @returns {Promise<number>} Duración en minutos
   */
  async getDuracionEfectiva(id_barbero, id_servicio) {
    const result = await this.db('ServicioBarbero')
      .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
      .where('ServicioBarbero.id_barbero', id_barbero)
      .where('ServicioBarbero.id_servicio', id_servicio)
      .select(
        this.db.raw('ISNULL(ServicioBarbero.tiempo_servicio_minutos, Servicio.duracion_minutos) as duracion_efectiva')
      )
      .first()
    return result ? result.duracion_efectiva : null
  }

  /**
   * Obtiene todos los servicios con información extendida (servicio + barbero + precios/duraciones)
   * @returns {Promise<Array>} Array de todas las relaciones servicios-barberos
   */
  async findAll() {
    return this.db('ServicioBarbero')
      .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
      .join('Barbero', 'ServicioBarbero.id_barbero', '=', 'Barbero.id_barbero')
      .select(
        'ServicioBarbero.id_servicio_barbero',
        'ServicioBarbero.id_servicio',
        'ServicioBarbero.id_barbero',
        'Servicio.nombre_servicio',
        'Barbero.id_usuario',
        'ServicioBarbero.precio_barbero',
        'ServicioBarbero.tiempo_servicio_minutos',
        'ServicioBarbero.disponible'
      )
  }

  /**
   * Cuenta cuántos barberos ofrecen un servicio específico
   * @param {number} id_servicio - ID del servicio
   * @returns {Promise<number>} Cantidad de barberos
   */
  async countBarberosByServicio(id_servicio) {
    const result = await this.db('ServicioBarbero')
      .where('id_servicio', id_servicio)
      .where('disponible', true)
      .count('id_barbero as count')
      .first()
    return result.count
  }

  /**
   * Cuenta cuántos servicios ofrece un barbero
   * @param {number} id_barbero - ID del barbero
   * @returns {Promise<number>} Cantidad de servicios
   */
  async countServiciosByBarbero(id_barbero) {
    const result = await this.db('ServicioBarbero')
      .where('id_barbero', id_barbero)
      .where('disponible', true)
      .count('id_servicio as count')
      .first()
    return result.count
  }
}

module.exports = ServicioBarberoRepositoryImpl
