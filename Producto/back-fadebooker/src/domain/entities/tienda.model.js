class Tienda {
  constructor({ id_tienda, id_dueño, nombre_tienda, direccion, ciudad, codigo_postal, telefono_tienda, email_tienda, horario_apertura, horario_cierre, dias_laborales, foto_portada_url, calificacion_promedio, este_activa, createdAt, updatedAt }) {
    this.id_tienda = id_tienda
    this.id_dueño = id_dueño
    this.nombre_tienda = nombre_tienda
    this.direccion = direccion
    this.ciudad = ciudad
    this.codigo_postal = codigo_postal
    this.telefono_tienda = telefono_tienda
    this.email_tienda = email_tienda
    this.horario_apertura = horario_apertura
    this.horario_cierre = horario_cierre
    this.dias_laborales = dias_laborales
    this.foto_portada_url = foto_portada_url
    this.calificacion_promedio = calificacion_promedio
    this.este_activa = este_activa
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

module.exports = Tienda