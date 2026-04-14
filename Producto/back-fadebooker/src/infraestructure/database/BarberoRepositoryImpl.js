const UsuarioRepositoryImpl = require('./UsuarioRepositoryImpl')

class BarberoRepositoryImpl extends UsuarioRepositoryImpl {
  async findByEspecialidad(especialidad) {
    return this.db('Barbero').where({ especialidad }).select()
  }

  async actualizarHorario(id_barbero, horario) {
    return this.db('Barbero').where({ id_barbero }).update({ horario_disponible: horario })
  }

  async obtenerDisponibilidad(id_barbero, fecha) {
    // Asumiendo una tabla o lógica para disponibilidad; ajusta según tu esquema
    return this.db('Disponibilidad').where({ id_barbero, fecha }).select()
  }
}

module.exports = BarberoRepositoryImpl