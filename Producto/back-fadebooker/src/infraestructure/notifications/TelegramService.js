const telegram = require('./telegram');

class TelegramService {
  constructor() {}

  async sendMessage(chatId, text) {
    return await telegram.sendTelegramMessage(chatId, text);
  }
}

module.exports = new TelegramService();
