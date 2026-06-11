/**
 * Interfaz de Repositorio: PhoneVerification
 * Define el contrato que debe cumplir cualquier implementación de repositorio
 */

class IPhoneVerificationRepository {
  async create(data) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByUserIdAndPhone(userId, phone) {
    throw new Error('Method not implemented');
  }

  async findByTelegramId(telegramId) {
    throw new Error('Method not implemented');
  }

  async findLastActiveByPhone(phone) {
    throw new Error('Method not implemented');
  }

  async update(id, data) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async deleteExpired() {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }
}

module.exports = IPhoneVerificationRepository;
