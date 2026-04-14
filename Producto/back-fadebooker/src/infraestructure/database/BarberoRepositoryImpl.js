const UsuarioRepositoryImpl = require('./UsuarioRepositoryImpl')
const db = require('../../db/knex')

class BarberoRepositoryImpl extends UsuarioRepositoryImpl {
  async findByEspecialidad(especialidad) {
    // La especialidad en realidad está en el nombre del servicio que ofrece
    // Podemos filtrar por barberos activos que tengan servicios
    return db('Barbero')
      .where({ activo: true })
      .orderBy('calificacion_promedio', 'desc')
      .select()
  }

  async actualizarHorario(id_barbero, horario) {
    // Actualizar nota en el comentario del barbero si es necesario
    return db('Barbero').where({ id_barbero }).update({ updatedAt: db.raw('GETDATE()') })
  }

  async obtenerDisponibilidad(id_barbero, fecha) {
    // Obtener citas del barbero en la fecha para verificar disponibilidad
    return db('Cita')
      .where({ id_barbero })
      .whereBetween('fecha_hora_inicio', [
        `${fecha} 00:00:00`,
        `${fecha} 23:59:59`
      ])
      .whereIn('estado', ['confirmada', 'en_progreso'])
      .select('id_cita', 'fecha_hora_inicio', 'duracion_minutos', 'estado')
  }

  async findAll() {
    return db('Barbero')
      .leftJoin('Usuario', 'Barbero.id_usuario', '=', 'Usuario.id_usuario')
      .where({ 'Barbero.activo': true })
      .orderBy('Usuario.nombre')
      .select('Barbero.*', 'Usuario.email', 'Usuario.nombre', 'Usuario.apellido', 'Usuario.telefono', 'Usuario.foto_perfil_url')
  }

  async findById(id_usuario) {
    return db('Barbero')
      .leftJoin('Usuario', 'Barbero.id_usuario', '=', 'Usuario.id_usuario')
      .where('Barbero.id_usuario', id_usuario)
      .first()
  }
}

module.exports = BarberoRepositoryImpl