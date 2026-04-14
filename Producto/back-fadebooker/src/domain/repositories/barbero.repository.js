const UsuarioRepository = require('./usuario.repository')

class BarberoRepository extends UsuarioRepository {
  async findByEspecialidad(especialidad) {
    throw new Error('Método findByEspecialidad() debe ser implementado')
  }

  async actualizarHorario(id_barbero, horario) {
    throw new Error('Método actualizarHorario() debe ser implementado')
  }

  async obtenerDisponibilidad(id_barbero, fecha) {
    throw new Error('Método obtenerDisponibilidad() debe ser implementado')
  }
}

module.exports = BarberoRepository