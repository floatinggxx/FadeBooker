-- Minimal FadeBooker_Test schema for tests
-- Includes essential tables: usuarios, roles, barberos, servicios, servicio_precios, citas, pagos

SET NOCOUNT ON;
GO

IF DB_ID('FadeBooker_Test') IS NULL
SET NOCOUNT ON;
GO

IF DB_ID('FadeBooker_Test') IS NULL
BEGIN
    CREATE DATABASE FadeBooker_Test;
END
GO

USE FadeBooker_Test;
GO

-- Core reference tables
IF OBJECT_ID('dbo.Rol','U') IS NULL
BEGIN
CREATE TABLE dbo.Rol (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255) NULL
);
END
GO

-- Usuario (principal)
IF OBJECT_ID('dbo.Usuario','U') IS NULL
BEGIN
CREATE TABLE dbo.Usuario (
    id_usuario int NOT NULL IDENTITY(1,1),
    email nvarchar(255) NOT NULL,
    contrasena nvarchar(255) NOT NULL,
    nombre nvarchar(100) NOT NULL,
    apellido nvarchar(100) NOT NULL,
    telefono nvarchar(20) NULL,
    rol nvarchar(50) DEFAULT ('Cliente') NOT NULL,
    estado bit DEFAULT ((1)) NOT NULL,
    foto_perfil_url nvarchar(max) NULL,
    fecha_registro datetime2(7) DEFAULT (getutcdate()),
    ultimo_login datetime2(7) NULL,
    createdAt datetime2(7) DEFAULT (getutcdate()),
    updatedAt datetime2(7) DEFAULT (getutcdate()),
    telegram_id bigint NULL,
    phone_verified bit DEFAULT ((0)),
    verified_phone nvarchar(20) NULL,
    PRIMARY KEY (id_usuario)
);
END
GO

-- Tienda
IF OBJECT_ID('dbo.Tienda','U') IS NULL
BEGIN
CREATE TABLE dbo.Tienda (
    id_tienda int NOT NULL IDENTITY(1,1),
    id_dueño int NOT NULL,
    nombre_tienda nvarchar(150) NOT NULL,
    direccion nvarchar(max) NOT NULL,
    comuna nvarchar(100) NOT NULL,
    codigo_postal nvarchar(20) NULL,
    telefono_tienda nvarchar(20) NULL,
    email_tienda nvarchar(255) NULL,
    horario_apertura time(7) DEFAULT ('09:00') NOT NULL,
    horario_cierre time(7) DEFAULT ('18:00') NOT NULL,
    dias_laborales nvarchar(50) NULL,
    foto_portada_url nvarchar(max) NULL,
    calificacion_promedio decimal(3,2) DEFAULT ((0)) NULL,
    este_activa bit DEFAULT ((1)) NOT NULL,
    createdAt datetime2(7) DEFAULT (getutcdate()),
    updatedAt datetime2(7) DEFAULT (getutcdate()),
    region varchar(255) DEFAULT ('No especificada') NOT NULL,
    PRIMARY KEY (id_tienda)
);
END
GO

-- Barbero
IF OBJECT_ID('dbo.Barbero','U') IS NULL
BEGIN
CREATE TABLE dbo.Barbero (
    id_barbero int NOT NULL IDENTITY(1,1),
    id_usuario int NOT NULL,
    id_tienda int NOT NULL,
    especialidad nvarchar(150) NULL,
    anos_experiencia int NULL,
    tarifa_base decimal(10,2) NULL,
    foto_perfil_url nvarchar(max) NULL,
    calificacion_promedio decimal(3,2) DEFAULT ((0)),
    total_resenas int DEFAULT ((0)),
    activo bit DEFAULT ((1)) NOT NULL,
    createdAt datetime2(7) DEFAULT (getutcdate()),
    updatedAt datetime2(7) DEFAULT (getutcdate()),
    PRIMARY KEY (id_barbero)
);
END
GO

-- Servicio
IF OBJECT_ID('dbo.Servicio','U') IS NULL
BEGIN
CREATE TABLE dbo.Servicio (
    id_servicio int NOT NULL IDENTITY(1,1),
    nombre_servicio nvarchar(150) NOT NULL,
    descripcion nvarchar(max) NULL,
    duracion_minutos int NOT NULL,
    precio_base decimal(10,2) NOT NULL,
    activo bit DEFAULT ((1)) NOT NULL,
    createdAt datetime2(7) DEFAULT (getutcdate()),
    updatedAt datetime2(7) DEFAULT (getutcdate()),
    PRIMARY KEY (id_servicio)
);
END
GO

-- ServicioBarbero (precio y disponibilidad por barbero)
IF OBJECT_ID('dbo.ServicioBarbero','U') IS NULL
BEGIN
CREATE TABLE dbo.ServicioBarbero (
    id_servicio_barbero int NOT NULL IDENTITY(1,1),
    id_servicio int NOT NULL,
    id_barbero int NOT NULL,
    precio_barbero decimal(10,2) NULL,
    tiempo_servicio_minutos int NULL,
    disponible bit DEFAULT ((1)) NOT NULL,
    createdAt datetime2(7) DEFAULT (getutcdate()),
    updatedAt datetime2(7) DEFAULT (getutcdate()),
    PRIMARY KEY (id_servicio_barbero)
);
END
GO

-- Cita
IF OBJECT_ID('dbo.Cita','U') IS NULL
BEGIN
CREATE TABLE dbo.Cita (
    id_cita int NOT NULL IDENTITY(1,1),
    id_cliente int NOT NULL,
    id_barbero int NOT NULL,
    id_servicio int NOT NULL,
    id_tienda int NOT NULL,
    fecha_hora_inicio datetime2(7) NOT NULL,
    duracion_minutos int NOT NULL,
    estado nvarchar(50) DEFAULT ('confirmada') NOT NULL,
    monto_total decimal(10,2) NOT NULL,
    pago_abono decimal(10,2) DEFAULT ((0)),
    metodo_pago nvarchar(50) NULL,
    notas nvarchar(max) NULL,
    createdAt datetime2(7) DEFAULT (getutcdate()),
    updatedAt datetime2(7) DEFAULT (getutcdate()),
    PRIMARY KEY (id_cita)
);
END
GO

-- Pago
IF OBJECT_ID('dbo.Pago','U') IS NULL
BEGIN
CREATE TABLE dbo.Pago (
    id_pago int NOT NULL IDENTITY(1,1),
    id_cita int NOT NULL,
    monto_pagado decimal(10,2) NOT NULL,
    metodo_pago nvarchar(50) NOT NULL,
    estado_pago nvarchar(50) DEFAULT ('completado') NOT NULL,
    referencia_transaccion nvarchar(100) NULL,
    fecha_pago datetime2(7) DEFAULT (getutcdate()),
    createdAt datetime2(7) DEFAULT (getutcdate()),
    comision decimal(18,2) NULL,
    PRIMARY KEY (id_pago)
);
END
GO

-- Pago backups, auditorias, logs and misc
IF OBJECT_ID('dbo.LogErrores','U') IS NULL
BEGIN
CREATE TABLE dbo.LogErrores (
    id_log int NOT NULL IDENTITY(1,1),
    fecha_error datetime2(7) DEFAULT (getutcdate()),
    nivel nvarchar(20) DEFAULT ('ERROR'),
    mensaje nvarchar(max) NOT NULL,
    stack_trace nvarchar(max) NULL,
    usuario_id int NULL,
    endpoint nvarchar(255) NULL,
    metodo_http nvarchar(10) NULL,
    resuelto bit DEFAULT ((0)),
    PRIMARY KEY (id_log)
);
END
GO

-- Phone verifications
IF OBJECT_ID('dbo.PhoneVerifications','U') IS NULL
BEGIN
CREATE TABLE dbo.PhoneVerifications (
    id int NOT NULL IDENTITY(1,1),
    user_id int NOT NULL,
    phone nvarchar(20) NOT NULL,
    pin_hash nvarchar(255) NOT NULL,
    via_channel nvarchar(20) DEFAULT ('telegram') NOT NULL,
    attempts int DEFAULT ((0)),
    max_attempts int DEFAULT ((3)),
    verified_at datetime NULL,
    expires_at datetime NOT NULL,
    telegram_id bigint NULL,
    created_at datetime DEFAULT (getdate()),
    updated_at datetime DEFAULT (getdate()),
    PRIMARY KEY (id)
);
END
GO

-- Notification preferences and log
IF OBJECT_ID('dbo.NotificationPreferences','U') IS NULL
BEGIN
CREATE TABLE dbo.NotificationPreferences (
    id int NOT NULL IDENTITY(1,1),
    user_id int NOT NULL,
    channel nvarchar(20) DEFAULT ('telegram') NOT NULL,
    enabled bit DEFAULT ((1)),
    notify_on_confirmed bit DEFAULT ((1)),
    notify_on_cancelled bit DEFAULT ((1)),
    notify_on_rescheduled bit DEFAULT ((1)),
    created_at datetime DEFAULT (getdate()),
    updated_at datetime DEFAULT (getdate()),
    PRIMARY KEY (id)
);
END
GO

IF OBJECT_ID('dbo.NotificationLog','U') IS NULL
BEGIN
CREATE TABLE dbo.NotificationLog (
    id int NOT NULL IDENTITY(1,1),
    user_id int NOT NULL,
    appointment_id int NULL,
    notification_type nvarchar(50) NOT NULL,
    channel nvarchar(20) NOT NULL,
    status nvarchar(20) NOT NULL,
    message_text nvarchar(500) NULL,
    error_reason nvarchar(500) NULL,
    telegram_id bigint NULL,
    phone nvarchar(20) NULL,
    created_at datetime DEFAULT (getdate()),
    PRIMARY KEY (id)
);
END
GO

-- Audit tables
IF OBJECT_ID('dbo.AuditoriaPreciosServicio','U') IS NULL
BEGIN
CREATE TABLE dbo.AuditoriaPreciosServicio (
    id_auditoria int NOT NULL IDENTITY(1,1),
    id_servicio int NOT NULL,
    id_barbero int NULL,
    precio_anterior decimal(10,2) NULL,
    precio_nuevo decimal(10,2) NULL,
    cambio_por_usuario int NULL,
    fecha_cambio datetime2(7) DEFAULT (getutcdate()),
    razon_cambio nvarchar(max) NULL,
    PRIMARY KEY (id_auditoria)
);
END
GO

IF OBJECT_ID('dbo.AuditoriaCancelacion','U') IS NULL
BEGIN
CREATE TABLE dbo.AuditoriaCancelacion (
    id_auditoria int NOT NULL IDENTITY(1,1),
    id_cita int NOT NULL,
    cancelada_por int NOT NULL,
    motivo_cancelacion nvarchar(max) NULL,
    ofrecer_reembolso bit DEFAULT ((0)),
    porcentaje_reembolso int DEFAULT ((0)),
    fecha_cancelacion datetime2(7) DEFAULT (getutcdate()),
    PRIMARY KEY (id_auditoria)
);
END
GO

-- Reseñas
IF OBJECT_ID('dbo.Reseña','U') IS NULL
BEGIN
CREATE TABLE dbo.Reseña (
    id_resena int NOT NULL IDENTITY(1,1),
    id_cita int NOT NULL,
    id_cliente int NOT NULL,
    id_barbero int NOT NULL,
    id_tienda int NOT NULL,
    puntuacion int NOT NULL,
    comentario nvarchar(max) NULL,
    fecha_resena datetime2(7) DEFAULT (getutcdate()),
    createdAt datetime2(7) DEFAULT (getutcdate()),
    PRIMARY KEY (id_resena)
);
END
GO

-- Commission
IF OBJECT_ID('dbo.Commission','U') IS NULL
BEGIN
CREATE TABLE dbo.Commission (
    id_commission int NOT NULL IDENTITY(1,1),
    id_tienda int NULL,
    porcentaje decimal(5,2) DEFAULT ((5.00)) NOT NULL,
    fijo decimal(18,2) DEFAULT ((0.00)) NOT NULL,
    activo bit DEFAULT ((1)) NOT NULL,
    creado_at datetime2(7) DEFAULT (sysutcdatetime()),
    actualizado_at datetime2(7) DEFAULT (sysutcdatetime()),
    PRIMARY KEY (id_commission)
);
END
GO

-- BloqueHorario
IF OBJECT_ID('dbo.BloqueHorario','U') IS NULL
BEGIN
CREATE TABLE dbo.BloqueHorario (
    id_bloque int NOT NULL IDENTITY(1,1),
    id_barbero int NOT NULL,
    fecha_hora_inicio datetime2(7) NOT NULL,
    fecha_hora_fin datetime2(7) NOT NULL,
    motivo nvarchar(255) NULL,
    estado bit DEFAULT ((1)) NOT NULL,
    createdAt datetime2(7) DEFAULT (getdate()) NOT NULL,
    updatedAt datetime2(7) DEFAULT (getdate()) NOT NULL,
    PRIMARY KEY (id_bloque)
);
END
GO

-- PendingEmailConfirmation
IF OBJECT_ID('dbo.PendingEmailConfirmation','U') IS NULL
BEGIN
CREATE TABLE dbo.PendingEmailConfirmation (
    id int NOT NULL IDENTITY(1,1),
    token nvarchar(255) NOT NULL,
    payload nvarchar(max) NOT NULL,
    created_at datetime2(7) DEFAULT (sysutcdatetime()) NOT NULL,
    expires_at datetime2(7) NOT NULL,
    PRIMARY KEY (id)
);
END
GO

-- Foreign keys (best-effort)
BEGIN TRY
    ALTER TABLE dbo.Barbero ADD CONSTRAINT FK_Barbero_Tienda FOREIGN KEY (id_tienda) REFERENCES dbo.Tienda(id_tienda);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Barbero ADD CONSTRAINT FK_Barbero_Usuario FOREIGN KEY (id_usuario) REFERENCES dbo.Usuario(id_usuario);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.ServicioBarbero ADD CONSTRAINT FK_ServicioBarbero_Servicio FOREIGN KEY (id_servicio) REFERENCES dbo.Servicio(id_servicio) ON DELETE CASCADE;
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.ServicioBarbero ADD CONSTRAINT FK_ServicioBarbero_Barbero FOREIGN KEY (id_barbero) REFERENCES dbo.Barbero(id_barbero) ON DELETE CASCADE;
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Cita ADD CONSTRAINT FK_Cita_Cliente FOREIGN KEY (id_cliente) REFERENCES dbo.Usuario(id_usuario);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Cita ADD CONSTRAINT FK_Cita_Servicio FOREIGN KEY (id_servicio) REFERENCES dbo.Servicio(id_servicio);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Cita ADD CONSTRAINT FK_Cita_Barbero FOREIGN KEY (id_barbero) REFERENCES dbo.Barbero(id_barbero);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Cita ADD CONSTRAINT FK_Cita_Tienda FOREIGN KEY (id_tienda) REFERENCES dbo.Tienda(id_tienda);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Pago ADD CONSTRAINT FK_Pago_Cita FOREIGN KEY (id_cita) REFERENCES dbo.Cita(id_cita);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.AuditoriaPreciosServicio ADD CONSTRAINT FK_AuditPrecio_Servicio FOREIGN KEY (id_servicio) REFERENCES dbo.Servicio(id_servicio);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.AuditoriaPreciosServicio ADD CONSTRAINT FK_AuditPrecio_Barbero FOREIGN KEY (id_barbero) REFERENCES dbo.Barbero(id_barbero);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.AuditoriaPreciosServicio ADD CONSTRAINT FK_AuditPrecio_Usuario FOREIGN KEY (cambio_por_usuario) REFERENCES dbo.Usuario(id_usuario);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Tienda ADD CONSTRAINT FK_Tienda_Dueño FOREIGN KEY (id_dueño) REFERENCES dbo.Usuario(id_usuario);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.NotificationLog ADD CONSTRAINT FK_NotificationLog_Usuario FOREIGN KEY (user_id) REFERENCES dbo.Usuario(id_usuario) ON DELETE CASCADE;
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.NotificationLog ADD CONSTRAINT FK_NotificationLog_Cita FOREIGN KEY (appointment_id) REFERENCES dbo.Cita(id_cita) ON DELETE SET NULL;
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.AuditoriaCancelacion ADD CONSTRAINT FK_AuditCancel_Cita FOREIGN KEY (id_cita) REFERENCES dbo.Cita(id_cita);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.AuditoriaCancelacion ADD CONSTRAINT FK_AuditCancel_Usuario FOREIGN KEY (cancelada_por) REFERENCES dbo.Usuario(id_usuario);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Reseña ADD CONSTRAINT FK_Resena_Cita FOREIGN KEY (id_cita) REFERENCES dbo.Cita(id_cita);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Reseña ADD CONSTRAINT FK_Resena_Cliente FOREIGN KEY (id_cliente) REFERENCES dbo.Usuario(id_usuario);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Reseña ADD CONSTRAINT FK_Resena_Barbero FOREIGN KEY (id_barbero) REFERENCES dbo.Barbero(id_barbero);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Reseña ADD CONSTRAINT FK_Resena_Tienda FOREIGN KEY (id_tienda) REFERENCES dbo.Tienda(id_tienda);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.LogErrores ADD CONSTRAINT FK_LogErrores_Usuario FOREIGN KEY (usuario_id) REFERENCES dbo.Usuario(id_usuario) ON DELETE SET NULL;
END TRY BEGIN CATCH END CATCH

GO

PRINT 'Schema file created/updated: extended FadeBooker_Test schema.'
