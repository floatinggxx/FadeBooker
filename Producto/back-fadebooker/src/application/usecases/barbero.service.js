const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl')
const barberoRepository = new BarberoRepository()

const BarberoService = {
  async crearBarbero(data) {
    return barberoRepository.create(data)
  },

  async obtenerBarberoPorId(id) {
    return barberoRepository.findById(id)
  },

  async obtenerBarberoPorEmail(email) {
    return barberoRepository.findByEmail(email)
  },

  async buscarBarberosPorEspecialidad(especialidad) {
    return barberoRepository.findByEspecialidad(especialidad)
  },

  async obtenerTodosLosBarberos() {
    return barberoRepository.findAll()
  },

  async actualizarBarbero(id, data) {
    return barberoRepository.update(id, data)
  },

  async eliminarBarbero(id) {
    return barberoRepository.delete(id)
  },

  async actualizarHorarioBarbero(id_barbero, horario) {
    return barberoRepository.actualizarHorario(id_barbero, horario)
  },

  async obtenerDisponibilidadBarbero(id_barbero, fecha) {
    return barberoRepository.obtenerDisponibilidad(id_barbero, fecha)
  }
}

module.exports = BarberoService
