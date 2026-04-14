class ServicioTienda {
    constructor({ id_servicio_tienda, id_servicio, id_tienda, precio_tienda, disponible, createdAt }) {
        this.id_servicio_tienda = id_servicio_tienda;
        this.id_servicio = id_servicio;
        this.id_tienda = id_tienda;
        this.precio_tienda = precio_tienda;
        this.disponible = disponible;
        this.createdAt = createdAt;
    }
}

module.exports = ServicioTienda;
