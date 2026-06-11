class SmsServiceMock {
  constructor() {}

  async sendSms(phone, text) {
    console.log('[SmsServiceMock] Simulando envío SMS a', phone, 'mensaje:', text);
    // Simular pequeña latencia
    await new Promise(r => setTimeout(r, 50));
    return { status: 'sent', provider: 'mock' };
  }
}

module.exports = SmsServiceMock;
