const PhoneVerificationRepository = require('../../../infraestructure/database/PhoneVerificationRepositoryImpl');
const PhoneVerificationService = require('../../../application/usecases/phoneVerification.service');
const UsuarioRepository = require('../../../infraestructure/database/UsuarioRepositoryImpl');
const NotificationLogRepository = require('../../../infraestructure/database/NotificationLogRepositoryImpl');
const TelegramService = require('../../../infraestructure/notifications/TelegramService');

const phoneVerificationRepository = new PhoneVerificationRepository();
const usuarioRepository = new UsuarioRepository();
const notificationLogRepository = new NotificationLogRepository();
const phoneVerificationService = new PhoneVerificationService(phoneVerificationRepository, usuarioRepository, notificationLogRepository, TelegramService);

const WebhookController = {
  async telegram(req, res) {
    try {
      const update = req.body;
      if (!update) return res.status(400).send('No update');

      // Manejar mensajes /start con payload
      const message = update.message || update.channel_post || null;
      if (!message) return res.status(200).send('ok');

      const chatId = message.chat && message.chat.id;
      const text = message.text || '';

      if (text && text.startsWith('/start')) {
        // payload puede ser: /start link_<phone_encoded>
        const parts = text.split(' ');
        const payload = parts[1] || '';
        if (payload && payload.startsWith('link_')) {
          const phoneEncoded = payload.replace('link_', '');
          const phone = decodeURIComponent(phoneEncoded);

          // Buscar verificación pendiente por phone
          const record = await phoneVerificationRepository.findLastActiveByPhone(phone);
          if (record) {
            await phoneVerificationRepository.update(record.id, { telegram_id: chatId });

            // enviar PIN si aún no enviado o reenviar
            // No tenemos el PIN en claro aquí; la práctica segura es generar otro o rely en proceso previo
            // Para UX, informamos al usuario de que su chat fue conectado y que revisen la app
            await TelegramService.sendMessage(chatId, `Hola! Hemos recibido tu inicio de chat. Por favor vuelve a la app y solicita el código si no lo recibiste.`);

            await notificationLogRepository.logNotification({
              user_id: record.user_id,
              appointment_id: null,
              notification_type: 'verification',
              channel: 'telegram',
              status: 'sent',
              message_text: 'User opened chat with bot; telegram_id linked',
              error_reason: null,
              telegram_id: chatId,
              phone
            });

            return res.status(200).json({ ok: true });
          }

          // Si no hay record, registrar telegram_id para el usuario si existe
          // Intentar asociar por usuario.telefono
          // Buscar usuario por telefono
          const UsuarioRepo = new UsuarioRepository();
          const user = await UsuarioRepo.findByPhone ? await UsuarioRepo.findByPhone(phone) : null;
          if (user) {
            await UsuarioRepo.update(user.id_usuario, { telegram_id: chatId });
            await TelegramService.sendMessage(chatId, 'Hola! Tu cuenta ha sido asociada.');
          }
        }
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[webhook.telegram] Error:', err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }
};

module.exports = WebhookController;
