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

    // Use DB-specific insert: for sqlite (tests) use knex insert and return id, for mssql keep the T-SQL with OUTPUT
    const clientName = (this.db.client && this.db.client.config && this.db.client.config.client) || '';
    try {
      if (clientName && clientName.includes('sqlite')) {
        const insertData = {};
        fields.forEach((f, i) => { insertData[f] = values[i]; });
        const [id] = await this.db('Pago').insert(insertData);
        // sqlite returns last inserted id
        return id;
      } else {
        const sql = `\n      DECLARE @InsertedTable TABLE (id_pago INT);\n      INSERT INTO [dbo].[Pago] (${columnsSql})\n      OUTPUT INSERTED.id_pago INTO @InsertedTable\n      VALUES (${placeholders});\n      SELECT id_pago FROM @InsertedTable;\n    `;
        const result = await this.db.raw(sql, values);
        const id_pago = result[0].id_pago || (result[0][0] ? result[0][0].id_pago : null);
        return id_pago;
      }
    } catch (error) {
      console.error('--- ERROR en insert Pago - SQL (or knex insert) - values:', JSON.stringify(values));
      console.error('--- ERROR en insert Pago - error:', error && (error.message || error));
      throw error;
    }
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