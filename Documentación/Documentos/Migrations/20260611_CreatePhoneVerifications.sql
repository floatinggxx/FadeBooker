-- Migración: Crear tabla PhoneVerifications
-- Fecha: 2026-06-11
-- Descripción: Almacena intentos de verificación de teléfono con PIN temporal

CREATE TABLE PhoneVerifications (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    pin_hash NVARCHAR(255) NOT NULL,  -- Hash bcrypt del PIN
    via_channel NVARCHAR(20) NOT NULL DEFAULT 'telegram',  -- 'telegram' | 'sms'
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    verified_at DATETIME NULL,
    expires_at DATETIME NOT NULL,
    telegram_id BIGINT NULL,  -- Capturado desde webhook
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT chk_phone_verifications_channel CHECK (via_channel IN ('telegram', 'sms')),
    CONSTRAINT chk_phone_verifications_attempts CHECK (attempts >= 0 AND attempts <= max_attempts)
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_phone_verifications_user_id ON PhoneVerifications(user_id);
CREATE INDEX idx_phone_verifications_phone ON PhoneVerifications(phone);
CREATE INDEX idx_phone_verifications_telegram_id ON PhoneVerifications(telegram_id);
CREATE INDEX idx_phone_verifications_expires_at ON PhoneVerifications(expires_at);
CREATE INDEX idx_phone_verifications_verified_at ON PhoneVerifications(verified_at);

PRINT 'Migración 20260611_CreatePhoneVerifications completada exitosamente.'
