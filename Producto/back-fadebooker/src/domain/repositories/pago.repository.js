class PagoRepository {
  async create(data) {
    throw new Error('Método create() debe ser implementado')
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado')
  }

  async findByCitaId(id_cita) {
    throw new Error('Método findByCitaId() debe ser implementado')
  }

  async update(id, data) {
    throw new Error('Método update() debe ser implementado')
  }

  async findByReferencia(referencia) {
    throw new Error('Método findByReferencia() debe ser implementado')
  }
}

module.exports = PagoRepository;