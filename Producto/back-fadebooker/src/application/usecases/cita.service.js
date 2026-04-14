const CitaRepository = require('../../infraestructure/database/CitaRepositoryImpl')
const citaRepository = new CitaRepository()

const CitaService = {
  async crearCita(data) {
    // validar disponibilidad
    const existente = await citaRepository.findByFecha(data.fecha_hora_inicio)

    if (existente && existente.length > 0) {
      throw new Error('Horario no disponible')
    }

    // crear cita
    return citaRepository.create({
      ...data,
      estado: 'CREADO'
    })
  },

  async actualizarEstado(id, estado) {
    return citaRepository.update(id, { estado })
  },

  async obtenerCitaPorId(id) {
    return citaRepository.findById(id)
  },

  async obtenerCitasDelCliente(id_cliente) {
    return citaRepository.findByClienteId(id_cliente)
  },

  async obtenerCitasDelBarbero(id_barbero) {
    return citaRepository.findByBarberoId(id_barbero)
  },

  async obtenerCitasPorEstado(estado) {
    return citaRepository.findByEstado(estado)
  },

  async eliminarCita(id) {
    return citaRepository.delete(id)
  }
}

module.exports = CitaService
