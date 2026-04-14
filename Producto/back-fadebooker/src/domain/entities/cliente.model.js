const Usuario = require('./usuario.model')

class Cliente extends Usuario {
  constructor({ id_usuario, email, contrasena, rol, fecha_registro, nombre, telefono, puntos_acumulados }) {
    super({ id_usuario, email, contrasena, rol, fecha_registro }) // Llama al constructor de Usuario
    this.nombre = nombre
    this.telefono = telefono
    this.puntos_acumulados = puntos_acumulados || 0
  }
}

module.exports = Cliente