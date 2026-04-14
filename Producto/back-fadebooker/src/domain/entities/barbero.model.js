const Usuario = require('./usuario.model')

class Barbero extends Usuario {
  constructor({ id_usuario, email, nombre, apellido, telefono, rol, estado, foto_perfil_url, fecha_registro, ultimo_login, createdAt, updatedAt, id_barbero, id_tienda, especialidad, anos_experiencia, tarifa_base, calificacion_promedio, total_resenas, activo }) {
    super({ id_usuario, email, nombre, apellido, telefono, rol, estado, foto_perfil_url, fecha_registro, ultimo_login, createdAt, updatedAt })
    this.id_barbero = id_barbero
    this.id_tienda = id_tienda
    this.especialidad = especialidad
    this.anos_experiencia = anos_experiencia
    this.tarifa_base = tarifa_base
    this.calificacion_promedio = calificacion_promedio
    this.total_resenas = total_resenas
    this.activo = activo
  }
}

module.exports = Barbero