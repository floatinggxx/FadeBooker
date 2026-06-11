/**
 * Implementación de Repositorio: PhoneVerification
 * Maneja persistencia en BD para verificaciones de teléfono
 */

const db = require('../../db/knex');
const PhoneVerification = require('../../domain/entities/phoneVerification.model');

class PhoneVerificationRepositoryImpl {
  constructor() {
    this.db = db;
  }

  async create(data) {
    const result = await this.db('PhoneVerifications')
      .insert(data)
      .returning('id');

    if (Array.isArray(result) && result.length > 0) {
      const idPayload = result[0];
      return typeof idPayload === 'object' ? idPayload.id : idPayload;
    }

    return result;
  }

  async findById(id) {
    const row = await this.db('PhoneVerifications').where({ id }).first();
    return this._mapToDomain(row);
  }

  async findByUserIdAndPhone(userId, phone) {
    const row = await this.db('PhoneVerifications')
      .where({ user_id: userId, phone })
      .orderBy('created_at', 'desc')
      .first();
    return this._mapToDomain(row);
  }

  async findByTelegramId(telegramId) {
    const row = await this.db('PhoneVerifications')
      .where({ telegram_id: telegramId })
      .orderBy('created_at', 'desc')
      .first();
    return this._mapToDomain(row);
  }

  async findLastActiveByPhone(phone) {
    const row = await this.db('PhoneVerifications')
      .where({ phone })
      .whereNull('verified_at')
      .orderBy('created_at', 'desc')
      .first();
    return this._mapToDomain(row);
  }

  async update(id, data) {
    delete data.id;
    delete data.user_id;
    
    return await this.db('PhoneVerifications')
      .where({ id })
      .update({
        ...data,
        updated_at: new Date()
      });
  }

  async delete(id) {
    return await this.db('PhoneVerifications').where({ id }).del();
  }

  async deleteExpired() {
    return await this.db('PhoneVerifications')
      .where('expires_at', '<', new Date())
      .whereNull('verified_at')
      .del();
  }

  async findAll() {
    const rows = await this.db('PhoneVerifications').select();
    return rows.map(row => this._mapToDomain(row));
  }

  _mapToDomain(row) {
    if (!row) return null;
    return new PhoneVerification({
      id: row.id,
      user_id: row.user_id,
      phone: row.phone,
      pin_hash: row.pin_hash,
      via_channel: row.via_channel,
      attempts: row.attempts,
      max_attempts: row.max_attempts,
      verified_at: row.verified_at,
      expires_at: row.expires_at,
      telegram_id: row.telegram_id,
      created_at: row.created_at,
      updated_at: row.updated_at
    });
  }
}

module.exports = PhoneVerificationRepositoryImpl;
