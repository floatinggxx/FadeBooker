# Telegram Notifications & Phone Verification (PR1)

Este documento describe la integración de verificación de teléfono vía Telegram y preferencias de notificación incluidas en PR1.

## Variables de entorno necesarias

- `TELEGRAM_BOT_TOKEN` - Token del bot Telegram (@FadeBookerBot)
- `TELEGRAM_BOT_USERNAME` - Nombre de usuario del bot (ej: FadeBookerBot)
- `PIN_EXPIRY_MINUTES` - (opcional) minutos de expiración para PIN (default: 5)

## Migraciones
Ejecutar las siguientes migraciones SQL en el orden indicado:

- `Documentación/Documentos/Migrations/20260611_AddTelegramToUsuario.sql`
- `Documentación/Documentos/Migrations/20260611_CreatePhoneVerifications.sql`
- `Documentación/Documentos/Migrations/20260611_CreateNotificationPreferences.sql`
- `Documentación/Documentos/Migrations/20260611_CreateNotificationLog.sql`

## Endpoints añadidos

- `POST /api/auth/telelink` - Inicia flujo de verificación por Telegram. Body: `{ phone }`.
  - Respuestas: `{ status: 'PIN_SENT' }` o `{ status: 'CHAT_NOT_OPEN', deep_link }`.

- `POST /api/auth/televerify` - Verifica PIN. Body: `{ phone, pin }`.
  - Respuestas: `{ status: 'VERIFIED' }` o error.

- `GET /api/preferences` - Obtiene preferencias de notificación del usuario (requiere `Authorization: Bearer <token>`).
- `PUT /api/preferences` - Actualiza preferencias. Body: `{ channel, enabled, notify_on_confirmed, notify_on_cancelled, notify_on_rescheduled }`.

- `POST /api/webhook/telegram` - Webhook público para recibir updates de Telegram (configurar en BotFather).

## Notas de seguridad

- PINs nunca se guardan en logs ni en texto claro; se almacena `pin_hash` con bcrypt.
- Rate limiter in-memory aplicado en `/api/auth/telelink` por IP y por `phone`.
- Limitar reintentos en `PhoneVerifications.max_attempts`.

## SMS

- PR1 implementa un `SmsServiceMock` para pruebas locales sin costo.
- PR2 puede integrar Twilio si se requiere envío real.

## Testing

- Tests unitarios incluidos para `PinGenerator` y flujo básico de `PhoneVerificationService`.
- Ejecutar tests con:

```bash
cd Producto/back-fadebooker
npm install
npm test
```

## Notas de despliegue

- Configurar `TELEGRAM_BOT_TOKEN` y `TELEGRAM_BOT_USERNAME` en el entorno de Azure App Service.
- Registrar webhook en Telegram: `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<PUBLIC_WEBHOOK_URL>/api/webhook/telegram`

