/**
 * Implementación de Repositorio: NotificationPreference
 * Maneja persistencia en BD para preferencias de notificación
 */

const db = require('../../db/knex');
const NotificationPreference = require('../../domain/entities/notificationPreference.model');

class NotificationPreferenceRepositoryImpl {
  constructor() {
    this.db = db;
  }

  async create(data) {
    const result = await this.db('NotificationPreferences')
      .insert(data)
      .returning('id');

    if (Array.isArray(result) && result.length > 0) {
      const idPayload = result[0];
      return typeof idPayload === 'object' ? idPayload.id : idPayload;
    }

    return result;
  }

  async findById(id) {
    const row = await this.db('NotificationPreferences').where({ id }).first();
    return this._mapToDomain(row);
  }

  async findByUserId(userId) {
    const row = await this.db('NotificationPreferences')
      .where({ user_id: userId })
      .first();
    return this._mapToDomain(row);
  }

  async update(userId, data) {
    delete data.id;
    delete data.user_id;

    return await this.db('NotificationPreferences')
      .where({ user_id: userId })
      .update({
        ...data,
        updated_at: new Date()
      });
  }

  async delete(userId) {
    return await this.db('NotificationPreferences')
      .where({ user_id: userId })
      .del();
  }

  async findAll() {
    const rows = await this.db('NotificationPreferences').select();
    return rows.map(row => this._mapToDomain(row));
  }

  /**
   * Crea o actualiza preferencias de notificación para un usuario
   * Si existen, actualiza; si no, crea nuevas
   */
  async createOrUpdate(userId, data) {
    const existing = await this.findByUserId(userId);
    
    if (existing) {
      await this.update(userId, data);
      return await this.findByUserId(userId);
    } else {
      const id = await this.create({ user_id: userId, ...data });
      return await this.findById(id);
    }
  }

  _mapToDomain(row) {
    if (!row) return null;
    return new NotificationPreference({
      id: row.id,
      user_id: row.user_id,
      channel: row.channel,
      enabled: row.enabled,
      notify_on_confirmed: row.notify_on_confirmed,
      notify_on_cancelled: row.notify_on_cancelled,
      notify_on_rescheduled: row.notify_on_rescheduled,
      created_at: row.created_at,
      updated_at: row.updated_at
    });
  }
}

module.exports = NotificationPreferenceRepositoryImpl;
