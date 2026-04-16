const ServicioRepository = require('../../infraestructure/database/ServicioRepositoryImpl')
const servicioRepository = new ServicioRepository()

/**
 * ServicioService
 * 
 * ACTUALIZADO (v1.1.0):
 * - Método findByTienda() reemplazado con findByBarbero()
 * - Servicios ahora se obtienen a nivel de barbero, no de tienda
 */
const ServicioService = {
  async crearServicio(data) {
    return servicioRepository.create(data)
  },

  async obtenerServicioPorId(id) {
    return servicioRepository.findById(id)
  },

  async buscarServicioPorNombre(nombre) {
    return servicioRepository.findByNombre(nombre)
  },

  async obtenerTodosLosServicios() {
    return servicioRepository.findAll()
  },

  async actualizarServicio(id, data) {
    return servicioRepository.update(id, data)
  },

  async eliminarServicio(id) {
    return servicioRepository.delete(id)
  },

  /**
   * ACTUALIZADO (v1.1.0): Obtiene servicios disponibles para un barbero específico
   * Reemplaza obtenerServiciosPorTienda()
   * 
   * @param {number} id_barbero - ID del barbero
   * @returns {Promise<Array>} Servicios que puede ofrecer el barbero
   */
  async obtenerServiciosPorBarbero(id_barbero) {
    return servicioRepository.findByBarbero(id_barbero)
  }
}

module.exports = ServicioService
