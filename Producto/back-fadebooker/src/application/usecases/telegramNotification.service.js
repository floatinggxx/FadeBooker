class TelegramNotificationService {
  constructor(telegramService, notificationLogRepository, notificationPreferenceRepository, usuarioRepository) {
    this.telegramService = telegramService;
    this.notificationLogRepository = notificationLogRepository;
    this.notificationPreferenceRepository = notificationPreferenceRepository;
    this.usuarioRepository = usuarioRepository;
  }

  async sendAppointmentNotification({ userId, appointmentId, type, message }) {
    // check preferences
    const prefs = await this.notificationPreferenceRepository.findByUserId(userId);
    if (prefs && !prefs.isNotificationEnabled(type)) {
      await this.notificationLogRepository.logNotification({
        user_id: userId,
        appointment_id: appointmentId,
        notification_type: type,
        channel: prefs ? prefs.channel : 'telegram',
        status: 'skipped',
        message_text: message,
        error_reason: 'Disabled by user',
        telegram_id: null,
        phone: null
      });
      return { status: 'skipped', reason: 'disabled' };
    }

    const user = await this.usuarioRepository.findById(userId);
    if (!user) throw new Error('User not found');
    if (!user.telegram_id || user.phone_verified !== 1) {
      await this.notificationLogRepository.logNotification({
        user_id: userId,
        appointment_id: appointmentId,
        notification_type: type,
        channel: 'telegram',
        status: 'skipped',
        message_text: message,
        error_reason: 'No telegram_id or phone not verified',
        telegram_id: user.telegram_id || null,
        phone: user.telefono || null
      });
      return { status: 'skipped', reason: 'no_channel' };
    }

    try {
      await this.telegramService.sendMessage(user.telegram_id, message);
      await this.notificationLogRepository.logNotification({
        user_id: userId,
        appointment_id: appointmentId,
        notification_type: type,
        channel: 'telegram',
        status: 'sent',
        message_text: message,
        error_reason: null,
        telegram_id: user.telegram_id,
        phone: user.telefono || null
      });
      return { status: 'sent' };
    } catch (err) {
      await this.notificationLogRepository.logNotification({
        user_id: userId,
        appointment_id: appointmentId,
        notification_type: type,
        channel: 'telegram',
        status: 'failed',
        message_text: message,
        error_reason: err.message,
        telegram_id: user.telegram_id,
        phone: user.telefono || null
      });
      return { status: 'failed', reason: err.message };
    }
  }
}

module.exports = TelegramNotificationService;
