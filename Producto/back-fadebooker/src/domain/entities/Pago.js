class Pago {
  constructor({
    id_pago,
    id_cita,
    monto_pagado,
    metodo_pago,
    estado_pago = 'pendiente',
    referencia_transaccion,
    fecha_pago
  }) {
    this.id_pago = id_pago;
    this.id_cita = id_cita;
    this.monto_pagado = monto_pagado;
    this.metodo_pago = metodo_pago;
    this.estado_pago = estado_pago;
    this.referencia_transaccion = referencia_transaccion;
    this.fecha_pago = fecha_pago;
  }
}

module.exports = Pago;