const BOT_API_BASE = 'https://api.telegram.org';

async function sendTelegramMessage(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN no definido; mensaje no enviado');
    return;
  }

  const url = `${BOT_API_BASE}/bot${token}/sendMessage`;
  console.log('[Telegram] Enviando mensaje a chat', chatId);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const body = await res.text();
    if (!res.ok) {
      console.error('[Telegram] Error enviando mensaje:', res.status, body);
    } else {
      console.log('[Telegram] Mensaje enviado con éxito:', body);
    }
  } catch (err) {
    console.error('[Telegram] Excepción enviando mensaje:', err);
  }
}

module.exports = { sendTelegramMessage };
