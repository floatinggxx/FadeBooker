class Resena {
    constructor(id_resena, idUsuario, idProducto, calificacion, comentario) {
        this.id_resena = id_resena;
        this.idUsuario = idUsuario;
        this.idProducto = idProducto;
        this.calificacion = calificacion;
        this.comentario = comentario;
    }
}

module.exports = Resena;