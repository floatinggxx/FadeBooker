const Usuario = require('./usuario.model')

class Barbero extends Usuario {
  constructor({ id_usuario, email, contrasena, rol, fecha_registro, especialidad, horario_disponible, nombre_barbero, foto_perfil }) {
    super({ id_usuario, email, contrasena, rol, fecha_registro }) // Llama al constructor de Usuario
    this.especialidad = especialidad
    this.horario_disponible = horario_disponible
    this.nombre_barbero = nombre_barbero
    this.foto_perfil = foto_perfil
  }
}

module.exports = Barbero