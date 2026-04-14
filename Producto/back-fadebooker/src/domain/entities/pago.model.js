class Pago {
    constructor(id_pago, monto, pago_abono, fecha, metodoPago) {
        this.id_pago = id_pago;
        this.monto = monto;
        this.pago_abono = pago_abono;
        this.fecha = fecha;
        this.metodoPago = metodoPago;
    }   
}

module.exports = Pago;