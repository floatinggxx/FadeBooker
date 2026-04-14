class Tienda {
    constructor(id_tienda, nombre_tienda, direccion,lat_y_long, foto_local_url) {
        this.id_tienda = id_tienda;
        this.nombre_tienda = nombre_tienda;
        this.direccion = direccion;
        this.lat_y_long = lat_y_long;
        this.foto_local_url = foto_local_url;
    }
}

module.exports = Tienda;