class Usuario {
  constructor({ id_usuario, email, nombre, apellido, telefono, rol, estado, foto_perfil_url, fecha_registro, ultimo_login, createdAt, updatedAt }) {
    this.id_usuario = id_usuario
    this.email = email
    this.nombre = nombre
    this.apellido = apellido
    this.telefono = telefono
    this.rol = rol
    this.estado = estado
    this.foto_perfil_url = foto_perfil_url
    this.fecha_registro = fecha_registro
    this.ultimo_login = ultimo_login
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

module.exports = Usuario