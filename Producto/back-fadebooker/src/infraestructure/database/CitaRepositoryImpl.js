const db = require('../../db/knex')

class CitaRepositoryImpl {
  constructor() {
    this.db = db
  }

  async create(data) {
    const [id] = await this.db('Cita').insert(data).returning('id_cita')
    return id
  }

  async findById(id) {
    return this.db('Cita').where({ id_cita: id }).first()
  }

  async findByClienteId(id_cliente) {
    return this.db('Cita').where({ Cliente_id_cliente: id_cliente }).select()
  }

  async findByBarberoId(id_barbero) {
    return this.db('Cita').where({ Barbero_id_barbero: id_barbero }).select()
  }

  async update(id, data) {
    return this.db('Cita').where({ id_cita: id }).update(data)
  }

  async delete(id) {
    return this.db('Cita').where({ id_cita: id }).del()
  }

  async findByFecha(fecha) {
    return this.db('Cita').where('fecha_hora_inicio', '>=', fecha).andWhere('fecha_hora_inicio', '<', fecha + ' 23:59:59').select()
  }

  async findByEstado(estado) {
    return this.db('Cita').where({ estado }).select()
  }
}

module.exports = CitaRepositoryImpl