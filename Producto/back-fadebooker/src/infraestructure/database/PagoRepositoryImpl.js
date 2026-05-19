const db = require('../../db/knex')
const PagoRepository = require('../../domain/repositories/pago.repository')

class PagoRepositoryImpl extends PagoRepository {
  constructor() {
    super()
    this.db = db
  }

  async create(data) {
    const result = await this.db.raw(`
      DECLARE @InsertedTable TABLE (id_pago INT);
      INSERT INTO [dbo].[Pago] (id_cita, monto_pagado, metodo_pago, estado_pago, referencia_transaccion, fecha_pago)
      OUTPUT INSERTED.id_pago INTO @InsertedTable
      VALUES (?, ?, ?, ?, ?, ?);
      SELECT id_pago FROM @InsertedTable;
    `, [
      data.id_cita,
      data.monto_pagado,
      data.metodo_pago,
      data.estado_pago,
      data.referencia_transaccion,
      data.fecha_pago || new Date()
    ]);

    const id_pago = result[0].id_pago || (result[0][0] ? result[0][0].id_pago : null);
    return id_pago;
  }

  async findById(id) {
    return this.db('Pago').where({ id_pago: id }).first()
  }

  async findByCitaId(id_cita) {
    return this.db('Pago').where({ id_cita }).orderBy('fecha_pago', 'desc').select()
  }

  async update(id, data) {
    await this.db('Pago').where({ id_pago: id }).update(data)
    return this.findById(id)
  }

  async findByReferencia(referencia) {
    return this.db('Pago').where({ referencia_transaccion: referencia }).first()
  }
}

module.exports = PagoRepositoryImpl