class Servicio {
    constructor({ id_servicio, nombre_servicio, precio, duracion }) {
        this.id_servicio = id_servicio;
        this.nombre_servicio = nombre_servicio;
        this.precio = precio;
        this.duracion = duracion;
    }
}

module.exports = Servicio;