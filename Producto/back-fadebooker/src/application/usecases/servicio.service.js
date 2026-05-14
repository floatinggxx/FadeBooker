class ServicioService {
  constructor(servicioRepository) {
    this.servicioRepository = servicioRepository;
  }

  async crearServicio(data) {
    return this.servicioRepository.create(data)
  }

  async obtenerServicioPorId(id) {
    return this.servicioRepository.findById(id)
  }

  async buscarServicioPorNombre(nombre) {
    return this.servicioRepository.findByNombre(nombre)
  }

  async obtenerTodosLosServicios() {
    return this.servicioRepository.findAll()
  }

  async actualizarServicio(id, data) {
    return this.servicioRepository.update(id, data)
  }

  async eliminarServicio(id) {
    return this.servicioRepository.delete(id)
  }

  async obtenerServiciosPorBarbero(id_barbero) {
    return this.servicioRepository.findByBarbero(id_barbero)
  }
}

module.exports = ServicioService
