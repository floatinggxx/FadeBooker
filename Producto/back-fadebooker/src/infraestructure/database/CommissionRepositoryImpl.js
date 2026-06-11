const db = require('../../db/knex')

class CommissionRepositoryImpl {
  constructor() {
    this.db = db
  }

  async findByTienda(id_tienda) {
    return this.db('Commission').where({ id_tienda }).andWhere({ activo: 1 }).first();
  }

  async findGlobal() {
    return this.db('Commission').whereNull('id_tienda').andWhere({ activo: 1 }).first();
  }

  async create(data) {
    return this.db('Commission').insert(data);
  }

  async update(id, data) {
    return this.db('Commission').where({ id_commission: id }).update(data);
  }
}

module.exports = CommissionRepositoryImpl
