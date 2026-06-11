-- Migración: Crear tabla NotificationPreferences
-- Fecha: 2026-06-11
-- Descripción: Almacena preferencias de notificación de cada usuario

CREATE TABLE NotificationPreferences (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    channel NVARCHAR(20) NOT NULL DEFAULT 'telegram',  -- 'telegram' | 'sms' | 'none'
    enabled BIT DEFAULT 1,
    notify_on_confirmed BIT DEFAULT 1,
    notify_on_cancelled BIT DEFAULT 1,
    notify_on_rescheduled BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    UNIQUE (user_id),
    FOREIGN KEY (user_id) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT chk_notification_preferences_channel CHECK (channel IN ('telegram', 'sms', 'none'))
);

-- Índices
CREATE INDEX idx_notification_preferences_user_id ON NotificationPreferences(user_id);
CREATE INDEX idx_notification_preferences_enabled ON NotificationPreferences(enabled);

PRINT 'Migración 20260611_CreateNotificationPreferences completada exitosamente.'
