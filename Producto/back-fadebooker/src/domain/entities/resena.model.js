class Resena {
    constructor({ id_resena, id_cita, id_cliente, id_barbero, id_tienda, puntuacion, comentario, fecha_resena, createdAt }) {
        this.id_resena = id_resena;
        this.id_cita = id_cita;
        this.id_cliente = id_cliente;
        this.id_barbero = id_barbero;
        this.id_tienda = id_tienda;
        this.puntuacion = puntuacion;
        this.comentario = comentario;
        this.fecha_resena = fecha_resena;
        this.createdAt = createdAt;
    }
}

module.exports = Resena;