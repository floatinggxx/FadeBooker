const db = require('../../db/knex')
const PagoRepository = require('../../domain/repositories/pago.repository')

class PagoRepositoryImpl extends PagoRepository {
  constructor() {
    super()
    this.db = db
  }

  async create(data) {
    const [id] = await this.db('Pago').insert(data).returning('id_pago')
    return id
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