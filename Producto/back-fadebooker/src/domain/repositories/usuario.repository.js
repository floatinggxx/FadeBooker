class UsuarioRepository {
  async create(data) {
    throw new Error('Método create() debe ser implementado')
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado')
  }

  async findByEmail(email) {
    throw new Error('Método findByEmail() debe ser implementado')
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
}

module.exports = UsuarioRepository