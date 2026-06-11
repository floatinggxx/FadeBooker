/**
 * Modelo de Dominio: NotificationPreference
 * Representa las preferencias de notificación de un usuario
 */

class NotificationPreference {
  constructor({
    id,
    user_id,
    channel,
    enabled,
    notify_on_confirmed,
    notify_on_cancelled,
    notify_on_rescheduled,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.user_id = user_id;
    this.channel = channel || 'telegram';  // 'telegram' | 'sms' | 'none'
    this.enabled = enabled !== undefined ? enabled : true;
    this.notify_on_confirmed = notify_on_confirmed !== undefined ? notify_on_confirmed : true;
    this.notify_on_cancelled = notify_on_cancelled !== undefined ? notify_on_cancelled : true;
    this.notify_on_rescheduled = notify_on_rescheduled !== undefined ? notify_on_rescheduled : true;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Verifica si las notificaciones están habilitadas
   */
  isNotificationEnabled(type) {
    if (!this.enabled) return false;
    
    switch (type) {
      case 'confirmed':
        return this.notify_on_confirmed;
      case 'cancelled':
        return this.notify_on_cancelled;
      case 'rescheduled':
        return this.notify_on_rescheduled;
      default:
        return false;
    }
  }

  /**
   * Obtiene resumen de preferencias activas
   */
  getSummary() {
    return {
      enabled: this.enabled,
      channel: this.channel,
      notifications: {
        confirmed: this.notify_on_confirmed && this.enabled,
        cancelled: this.notify_on_cancelled && this.enabled,
        rescheduled: this.notify_on_rescheduled && this.enabled
      }
    };
  }
}

module.exports = NotificationPreference;
