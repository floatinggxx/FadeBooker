const Usuario = require('./usuario.model')

class Cliente extends Usuario {
  constructor({ id_usuario, email, nombre, apellido, telefono, rol, estado, foto_perfil_url, fecha_registro, ultimo_login, createdAt, updatedAt, puntos_acumulados }) {
    super({ id_usuario, email, nombre, apellido, telefono, rol, estado, foto_perfil_url, fecha_registro, ultimo_login, createdAt, updatedAt })
    this.puntos_acumulados = puntos_acumulados || 0
  }
}

module.exports = Cliente