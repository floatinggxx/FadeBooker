const db = require('../../db/knex')

class ServicioRepositoryImpl {
  constructor() {
    this.db = db
  }

  async create(data) {
    const [id] = await this.db('Servicio').insert(data).returning('id_servicio')
    return id
  }

  async findById(id) {
    return this.db('Servicio').where({ id_servicio: id }).first()
  }

  async findByNombre(nombre) {
    return this.db('Servicio').where('nombre_servicio', 'like', `%${nombre}%`).select()
  }

  async update(id, data) {
    return this.db('Servicio').where({ id_servicio: id }).update(data)
  }

  async delete(id) {
    return this.db('Servicio').where({ id_servicio: id }).del()
  }

  async findAll() {
    return this.db('Servicio').select()
  }

  async findByTienda(id_tienda) {
    // Obtener servicios disponibles para una tienda usando ServicioTienda
    return this.db('ServicioTienda')
      .join('Servicio', 'ServicioTienda.id_servicio', '=', 'Servicio.id_servicio')
      .where('ServicioTienda.id_tienda', id_tienda)
      .where('ServicioTienda.disponible', true)
      .select('Servicio.*', 'ServicioTienda.precio_tienda as precio')
  }
}

module.exports = ServicioRepositoryImpl