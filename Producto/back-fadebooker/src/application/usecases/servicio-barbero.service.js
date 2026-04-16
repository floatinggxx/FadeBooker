const ServicioBarberoRepository = require('../../infraestructure/database/ServicioBarberoRepositoryImpl')
const barberoRepository = new ServicioBarberoRepository()

/**
 * ServicioBarberoService
 * 
 * NUEVO (v1.1.0): Gestiona la relación entre Servicios y Barberos
 * Permite asignar servicios específicos a barberos con precios/duraciones personalizadas
 */
const ServicioBarberoService = {
  /**
   * Obtiene todos los servicios que puede ofrecer un barbero
   * @param {number} id_barbero - ID del barbero
   */
  async obtenerServiciosPorBarbero(id_barbero) {
    return barberoRepository.findByBarbero(id_barbero)
  },

  /**
   * Obtiene todos los barberos que pueden ofrecer un servicio específico
   * @param {number} id_servicio - ID del servicio
   */
  async obtenerBarberoPorServicio(id_servicio) {
    return barberoRepository.findByServicio(id_servicio)
  },

  /**
   * Crea relación entre servicio y barbero
   * @param {number} id_servicio - ID del servicio
   * @param {number} id_barbero - ID del barbero
   * @param {number} precio_barbero - Precio override (opcional)
   * @param {number} tiempo_servicio_minutos - Duración override (opcional)
   */
  async crearServicioBarbero(id_servicio, id_barbero, precio_barbero = null, tiempo_servicio_minutos = null) {
    return barberoRepository.create(id_servicio, id_barbero, precio_barbero, tiempo_servicio_minutos)
  },

  /**
   * Verifica si un barbero puede hacer un servicio específico
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   */
  async validarServicioBarbero(id_barbero, id_servicio) {
    return barberoRepository.canBarberoDoServicio(id_barbero, id_servicio)
  },

  /**
   * Obtiene información específica de la relación Servicio-Barbero
   * @param {number} id_servicio_barbero - ID de la relación
   */
  async obtenerPorId(id_servicio_barbero) {
    return barberoRepository.findById(id_servicio_barbero)
  },

  /**
   * Actualiza precio o disponibilidad de un servicio para un barbero
   * @param {number} id_servicio_barbero - ID de la relación
   * @param {Object} data - Datos a actualizar
   */
  async actualizarServicioBarbero(id_servicio_barbero, data) {
    return barberoRepository.update(id_servicio_barbero, data)
  },

  /**
   * Elimina la relación entre servicio y barbero
   * @param {number} id_servicio_barbero - ID de la relación
   */
  async eliminarServicioBarbero(id_servicio_barbero) {
    return barberoRepository.delete(id_servicio_barbero)
  },

  /**
   * Elimina todos los servicios de un barbero
   * @param {number} id_barbero - ID del barbero
   */
  async eliminarServiciosPorBarbero(id_barbero) {
    return barberoRepository.deleteByBarbero(id_barbero)
  },

  /**
   * Obtiene precio efectivo para una cita
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   */
  async obtenerPrecioEfectivo(id_barbero, id_servicio) {
    return barberoRepository.getPrecioEfectivo(id_barbero, id_servicio)
  },

  /**
   * Obtiene duración efectiva para una cita
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   */
  async obtenerDuracionEfectiva(id_barbero, id_servicio) {
    return barberoRepository.getDuracionEfectiva(id_barbero, id_servicio)
  },

  /**
   * Obtiene todos los servicios con información extendida
   */
  async obtenerTodos() {
    return barberoRepository.findAll()
  },

  /**
   * Cuenta cuántos barberos ofrecen un servicio específico
   * @param {number} id_servicio - ID del servicio
   */
  async contarBarberosPorServicio(id_servicio) {
    return barberoRepository.countBarberosByServicio(id_servicio)
  },

  /**
   * Cuenta cuántos servicios ofrece un barbero
   * @param {number} id_barbero - ID del barbero
   */
  async contarServiciosPorBarbero(id_barbero) {
    return barberoRepository.countServiciosByBarbero(id_barbero)
  }
}

module.exports = ServicioBarberoService
