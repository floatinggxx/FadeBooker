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
    return this.db('Cita').where({ id_cliente }).orderBy('fecha_hora_inicio', 'desc').select()
  }

  async findByBarberoId(id_barbero) {
    return this.db('Cita').where({ id_barbero }).orderBy('fecha_hora_inicio', 'desc').select()
  }

  async findByCliente(id_cliente) {
    return this.db('Cita').where({ id_cliente }).orderBy('fecha_hora_inicio', 'desc').select()
  }

  async findByBarbero(id_barbero) {
    return this.db('Cita').where({ id_barbero }).orderBy('fecha_hora_inicio', 'desc').select()
  }

  async verificarDisponibilidad(id_barbero, fecha_hora_inicio, duracion_minutos) {
    const fecha_hora_fin = new Date(new Date(fecha_hora_inicio).getTime() + duracion_minutos * 60000)
    return this.db('Cita')
      .where({ id_barbero })
      .whereIn('estado', ['confirmada', 'en_progreso'])
      .where(kb => {
        kb.whereBetween('fecha_hora_inicio', [fecha_hora_inicio, fecha_hora_fin])
      })
      .select()
  }

  async findAll() {
    return this.db('Cita').orderBy('fecha_hora_inicio', 'desc').select()
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