const PhoneVerificationRepository = require('../../../infraestructure/database/PhoneVerificationRepositoryImpl');
const UsuarioRepository = require('../../../infraestructure/database/UsuarioRepositoryImpl');
const NotificationLogRepository = require('../../../infraestructure/database/NotificationLogRepositoryImpl');
const PhoneVerificationService = require('../../../application/usecases/phoneVerification.service');
const Telegram = require('../../../infraestructure/notifications/telegram');

const phoneVerificationRepository = new PhoneVerificationRepository();
const usuarioRepository = new UsuarioRepository();
const notificationLogRepository = new NotificationLogRepository();
const phoneVerificationService = new PhoneVerificationService(phoneVerificationRepository, usuarioRepository, notificationLogRepository, Telegram);

const PhoneVerificationController = {
  async telelink(req, res) {
    try {
      const { phone } = req.body;
      // buscar usuario por teléfono
      const user = await usuarioRepository.findByPhone ? await usuarioRepository.findByPhone(phone) : null;
      if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

      const result = await phoneVerificationService.initiateVerification({ userId: user.id_usuario, phone, via: 'telegram' });

      if (result.status === 'skipped' && result.reason === 'CHAT_NOT_OPEN') {
        const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'FadeBookerBot';
        const encoded = encodeURIComponent(phone);
        const deepLink = `https://t.me/${botUsername}?start=link_${encoded}`;
        return res.json({ status: 'CHAT_NOT_OPEN', deep_link: deepLink });
      }

      return res.json({ status: 'PIN_SENT' });
    } catch (err) {
      console.error('[telelink] Error:', err);
      return res.status(500).json({ status: 'error', message: err.message });
    }
  },

  async televerify(req, res) {
    try {
      const { phone, pin } = req.body;
      await phoneVerificationService.verifyPin({ phone, pin });
      return res.json({ status: 'VERIFIED' });
    } catch (err) {
      return res.status(400).json({ status: 'error', message: err.message });
    }
  }
}

module.exports = PhoneVerificationController;
