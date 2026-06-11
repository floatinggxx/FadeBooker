-- Migración: Crear tabla NotificationLog
-- Fecha: 2026-06-11
-- Descripción: Auditoría completa de intentos de envío de notificaciones

CREATE TABLE NotificationLog (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    appointment_id INT NULL,
    notification_type NVARCHAR(50) NOT NULL,  -- 'confirmed' | 'cancelled' | 'rescheduled'
    channel NVARCHAR(20) NOT NULL,  -- 'telegram' | 'sms'
    status NVARCHAR(20) NOT NULL,  -- 'sent' | 'failed' | 'skipped'
    message_text NVARCHAR(500),
    error_reason NVARCHAR(500) NULL,
    telegram_id BIGINT NULL,
    phone NVARCHAR(20) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES Cita(id_cita) ON DELETE SET NULL,
    CONSTRAINT chk_notification_log_type CHECK (notification_type IN ('confirmed', 'cancelled', 'rescheduled')),
    CONSTRAINT chk_notification_log_channel CHECK (channel IN ('telegram', 'sms')),
    CONSTRAINT chk_notification_log_status CHECK (status IN ('sent', 'failed', 'skipped'))
);

-- Índices para auditoría y análisis
CREATE INDEX idx_notification_log_user_id ON NotificationLog(user_id);
CREATE INDEX idx_notification_log_appointment_id ON NotificationLog(appointment_id);
CREATE INDEX idx_notification_log_status ON NotificationLog(status);
CREATE INDEX idx_notification_log_created_at ON NotificationLog(created_at);
CREATE INDEX idx_notification_log_channel ON NotificationLog(channel);

PRINT 'Migración 20260611_CreateNotificationLog completada exitosamente.'
