const db = require('../../db/knex')
const PagoRepository = require('../../domain/repositories/pago.repository')

class PagoRepositoryImpl extends PagoRepository {
  constructor() {
    super()
    this.db = db
  }

  async create(data) {
    // Soportar almacenamiento de comisión si viene en el objeto data
    const fields = ['id_cita', 'monto_pagado', 'metodo_pago', 'estado_pago', 'referencia_transaccion', 'fecha_pago'];
    const values = [data.id_cita, data.monto_pagado, data.metodo_pago, data.estado_pago, data.referencia_transaccion, data.fecha_pago || new Date()];
    if (typeof data.comision !== 'undefined') {
      fields.push('comision');
      values.push(data.comision);
    }

    const columnsSql = fields.map(f => `[${f}]`).join(', ');
    const placeholders = values.map(() => '?').join(', ');

    const sql = `\n      DECLARE @InsertedTable TABLE (id_pago INT);\n      INSERT INTO [dbo].[Pago] (${columnsSql})\n      OUTPUT INSERTED.id_pago INTO @InsertedTable\n      VALUES (${placeholders});\n      SELECT id_pago FROM @InsertedTable;\n    `;

    let result;
    try {
      result = await this.db.raw(sql, values);
    } catch (error) {
      console.error('--- ERROR en insert Pago - SQL:', sql);
      console.error('--- ERROR en insert Pago - values:', JSON.stringify(values));
      console.error('--- ERROR en insert Pago - error:', error && (error.message || error));
      // Re-lanzar para que el handler superior registre también la traza
      throw error;
    }

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