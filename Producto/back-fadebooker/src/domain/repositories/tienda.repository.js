/**
 * TiendaRepository Interface
 */
class TiendaRepository {
  async findAll(filtros = {}) {
    throw new Error('Método findAll() debe ser implementado')
  }

  async findById(id_tienda) {
    throw new Error('Método findById() debe ser implementado')
  }

  async findByComuna(comuna) {
    throw new Error('Método findByComuna() debe ser implementado')
  }

  async findByRegion(region) {
    throw new Error('Método findByRegion() debe ser implementado')
  }

  async create(data) {
    throw new Error('Método create() debe ser implementado')
  }

  async update(id_tienda, data) {
    throw new Error('Método update() debe ser implementado')
  }

  async delete(id_tienda) {
    throw new Error('Método delete() debe ser implementado')
  }
}

module.exports = TiendaRepository
