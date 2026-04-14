const ServicioRepository = require('../../infraestructure/database/ServicioRepositoryImpl')
const servicioRepository = new ServicioRepository()

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

  async obtenerServiciosPorTienda(id_tienda) {
    return servicioRepository.findByTienda(id_tienda)
  }
}

module.exports = ServicioService
