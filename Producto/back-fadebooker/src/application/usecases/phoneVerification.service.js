const BcryptHasher = require('../../infraestructure/security/BcryptHasher');
const PinGenerator = require('../../infraestructure/security/PinGenerator');

class PhoneVerificationService {
  constructor(phoneVerificationRepository, usuarioRepository, notificationLogRepository, telegramService) {
    this.phoneVerificationRepository = phoneVerificationRepository;
    this.usuarioRepository = usuarioRepository;
    this.notificationLogRepository = notificationLogRepository;
    this.telegramService = telegramService;
    this.hasher = new BcryptHasher();
  }

  async initiateVerification({ userId, phone, via = 'telegram', expiresMinutes = 5 }) {
    const pin = PinGenerator.generate(6);
    const pinHash = await this.hasher.hash(pin);
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

    const payload = {
      user_id: userId,
      phone,
      pin_hash: pinHash,
      via_channel: via,
      expires_at: expiresAt
    };

    const id = await this.phoneVerificationRepository.create(payload);

    // Try to send via telegram if user has telegram_id
    const user = await this.usuarioRepository.findById(userId);
    const telegramId = user && user.telegram_id;

    let sendResult = { status: 'skipped' };

    if (via === 'telegram' && telegramId) {
      try {
        await this.telegramService.sendMessage(telegramId, `Tu código de verificación es: ${pin}`);
        sendResult = { status: 'sent' };
      } catch (err) {
        sendResult = { status: 'failed', error: err.message };
      }
    } else if (via === 'telegram' && !telegramId) {
      sendResult = { status: 'skipped', reason: 'CHAT_NOT_OPEN' };
    }

    // Log notification attempt if applicable
    await this.notificationLogRepository.logNotification({
      user_id: userId,
      appointment_id: null,
      notification_type: 'verification',
      channel: via,
      status: sendResult.status,
      message_text: null, // no guardar PIN en logs
      error_reason: sendResult.error || sendResult.reason || null,
      telegram_id: telegramId || null,
      phone
    });

    return { id, status: sendResult.status, reason: sendResult.reason || null };
  }

  async verifyPin({ phone, pin }) {
    const record = await this.phoneVerificationRepository.findLastActiveByPhone(phone);
    if (!record) throw new Error('No verification record found or expired');
    if (record.isExpired()) throw new Error('PIN expired');
    if (record.isMaxAttemptsExceeded()) throw new Error('Max attempts exceeded');

    const match = await this.hasher.compare(pin, record.pin_hash);
    if (!match) {
      // increment attempts
      await this.phoneVerificationRepository.update(record.id, { attempts: record.attempts + 1 });
      throw new Error('Invalid PIN');
    }

    // mark verified
    await this.phoneVerificationRepository.update(record.id, { verified_at: new Date() });

    // update user
    if (record.user_id) {
      await this.usuarioRepository.update(record.user_id, { phone_verified: 1, verified_phone: phone, telegram_id: record.telegram_id || null });
    }

    await this.notificationLogRepository.logNotification({
      user_id: record.user_id,
      appointment_id: null,
      notification_type: 'verification',
      channel: record.via_channel,
      status: 'sent',
      message_text: 'Phone verified',
      error_reason: null,
      telegram_id: record.telegram_id || null,
      phone
    });

    return { success: true };
  }
}

module.exports = PhoneVerificationService;
