class LogRepository {
  async save(logRecord) {
    throw new Error('Método save() debe ser implementado')
  }

  async findAll() {
    throw new Error('Método findAll() debe ser implementado')
  }
}

module.exports = LogRepository
