/**
 * Implementación de Repositorio: NotificationLog
 * Maneja auditoría completa de envíos de notificaciones
 */

const db = require('../../db/knex');

class NotificationLogRepositoryImpl {
  constructor() {
    this.db = db;
  }

  /**
   * Registra un intento de envío de notificación
   */
  async logNotification(data) {
    const result = await this.db('NotificationLog')
      .insert({
        user_id: data.user_id,
        appointment_id: data.appointment_id,
        notification_type: data.notification_type,
        channel: data.channel,
        status: data.status,
        message_text: data.message_text,
        error_reason: data.error_reason,
        telegram_id: data.telegram_id,
        phone: data.phone
      })
      .returning('id');

    if (Array.isArray(result) && result.length > 0) {
      const idPayload = result[0];
      return typeof idPayload === 'object' ? idPayload.id : idPayload;
    }

    return result;
  }

  /**
   * Obtiene historial de notificaciones de un usuario
   */
  async findByUserId(userId, limit = 50) {
    return await this.db('NotificationLog')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  /**
   * Obtiene historial de notificaciones de una cita
   */
  async findByAppointmentId(appointmentId) {
    return await this.db('NotificationLog')
      .where({ appointment_id: appointmentId })
      .orderBy('created_at', 'desc');
  }

  /**
   * Obtiene estadísticas de envíos
   */
  async getStatistics(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.db('NotificationLog')
      .where({ user_id: userId })
      .andWhere('created_at', '>=', startDate)
      .select('status')
      .select('channel')
      .select('notification_type')
      .count('* as count')
      .groupBy('status', 'channel', 'notification_type');
  }

  /**
   * Obtiene todos los registros (con filtros opcionales)
   */
  async findAll(filters = {}) {
    let query = this.db('NotificationLog');

    if (filters.status) {
      query = query.where({ status: filters.status });
    }
    if (filters.channel) {
      query = query.where({ channel: filters.channel });
    }
    if (filters.user_id) {
      query = query.where({ user_id: filters.user_id });
    }
    if (filters.from_date) {
      query = query.where('created_at', '>=', filters.from_date);
    }
    if (filters.to_date) {
      query = query.where('created_at', '<=', filters.to_date);
    }

    return await query
      .orderBy('created_at', 'desc')
      .limit(filters.limit || 100);
  }

  /**
   * Elimina logs antiguos (cleanup de auditoría)
   */
  async deleteOlderThan(days = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await this.db('NotificationLog')
      .where('created_at', '<', cutoffDate)
      .del();
  }
}

module.exports = NotificationLogRepositoryImpl;
