-- Migration: crear tabla para registros pendientes de confirmación de email
IF OBJECT_ID('dbo.PendingEmailConfirmation', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.PendingEmailConfirmation (
    id INT IDENTITY(1,1) PRIMARY KEY,
    token NVARCHAR(255) NOT NULL UNIQUE,
    payload NVARCHAR(MAX) NOT NULL, -- JSON con datos del registro (incluye password ya hasheada)
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    expires_at DATETIME2 NOT NULL
  );
END

-- índice para tokens expirados
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_PendingEmailConfirmation_expires_at' AND object_id = OBJECT_ID('dbo.PendingEmailConfirmation'))
  CREATE INDEX IX_PendingEmailConfirmation_expires_at ON dbo.PendingEmailConfirmation(expires_at);
