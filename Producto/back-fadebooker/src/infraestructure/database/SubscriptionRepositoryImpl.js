const db = require('../../db/knex')

class SubscriptionRepositoryImpl {
  constructor() { this.db = db }

  async create(data) {
    return this.db('Subscription').insert(data)
  }

  async cancel(id) {
    return this.db('Subscription').where({ id }).update({ status: 'cancelled', cancelled_at: new Date() })
  }

  async findById(id) {
    return this.db('Subscription').where({ id }).first()
  }

  async findByProvider(provider_id) {
    return this.db('Subscription').where({ provider_id }).select()
  }

  async findByProvider(provider_id) {
    return this.db('Subscription').where({ provider_id }).select()
  }
}

module.exports = SubscriptionRepositoryImpl
