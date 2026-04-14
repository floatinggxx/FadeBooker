class ServicioRepository {
  async create(data) {
    throw new Error('Método create() debe ser implementado')
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado')
  }

  async findByNombre(nombre) {
    throw new Error('Método findByNombre() debe ser implementado')
  }

  async update(id, data) {
    throw new Error('Método update() debe ser implementado')
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado')
  }

  async findAll() {
    throw new Error('Método findAll() debe ser implementado')
  }

  async findByTienda(id_tienda) {
    throw new Error('Método findByTienda() debe ser implementado')
  }
}

module.exports = ServicioRepository