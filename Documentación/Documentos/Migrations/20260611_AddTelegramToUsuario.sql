-- Migración: Agregar campos Telegram a tabla Usuario
-- Fecha: 2026-06-11
-- Descripción: Agrega soporte para verificación de teléfono vía Telegram

ALTER TABLE Usuario
ADD 
    telegram_id BIGINT NULL,
    phone_verified BIT DEFAULT 0,
    verified_phone NVARCHAR(20) NULL;

-- Índices para optimizar búsquedas
CREATE INDEX idx_usuario_telegram_id ON Usuario(telegram_id);
CREATE INDEX idx_usuario_phone_verified ON Usuario(phone_verified);
CREATE INDEX idx_usuario_verified_phone ON Usuario(verified_phone);

PRINT 'Migración 20260611_AddTelegramToUsuario completada exitosamente.'
