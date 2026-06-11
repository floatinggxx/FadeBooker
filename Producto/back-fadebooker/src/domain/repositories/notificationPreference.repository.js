/**
 * Interfaz de Repositorio: NotificationPreference
 * Define el contrato que debe cumplir cualquier implementación de repositorio
 */

class INotificationPreferenceRepository {
  async create(data) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByUserId(userId) {
    throw new Error('Method not implemented');
  }

  async update(userId, data) {
    throw new Error('Method not implemented');
  }

  async delete(userId) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }

  async createOrUpdate(userId, data) {
    throw new Error('Method not implemented');
  }
}

module.exports = INotificationPreferenceRepository;
