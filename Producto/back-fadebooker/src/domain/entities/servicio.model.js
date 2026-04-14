class Servicio {
    constructor({ id_servicio, nombre_servicio, descripcion, duracion_minutos, precio_base, activo, createdAt, updatedAt }) {
        this.id_servicio = id_servicio;
        this.nombre_servicio = nombre_servicio;
        this.descripcion = descripcion;
        this.duracion_minutos = duracion_minutos;
        this.precio_base = precio_base;
        this.activo = activo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = Servicio;