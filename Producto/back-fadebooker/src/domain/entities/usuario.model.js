class Usuario {
  constructor({ id_usuario, email, contrasena, rol, fecha_registro }) {
    this.id_usuario = id_usuario
    this.email = email
    this.contrasena = contrasena
    this.rol = rol
    this.fecha_registro = fecha_registro
  }
}

module.exports = Usuario