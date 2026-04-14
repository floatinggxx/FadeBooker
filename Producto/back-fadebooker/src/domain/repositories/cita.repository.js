class CitaRepository {
  async create(data) {
    throw new Error('Método create() debe ser implementado')
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado')
  }

  async findByClienteId(id_cliente) {
    throw new Error('Método findByClienteId() debe ser implementado')
  }

  async findByBarberoId(id_barbero) {
    throw new Error('Método findByBarberoId() debe ser implementado')
  }

  async update(id, data) {
    throw new Error('Método update() debe ser implementado')
  }

  async delete(id) {
    throw new Error('Método delete() debe ser implementado')
  }

  async findByFecha(fecha) {
    throw new Error('Método findByFecha() debe ser implementado')
  }

  async findByEstado(estado) {
    throw new Error('Método findByEstado() debe ser implementado')
  }
}

module.exports = CitaRepository