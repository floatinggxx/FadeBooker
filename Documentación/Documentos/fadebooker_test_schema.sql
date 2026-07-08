-- Minimal FadeBooker_Test schema for tests
-- Includes essential tables: usuarios, roles, barberos, servicios, servicio_precios, citas, pagos

SET NOCOUNT ON;
GO

IF DB_ID('FadeBooker_Test') IS NULL
BEGIN
    CREATE DATABASE FadeBooker_Test;
END
GO

USE FadeBooker_Test;
GO

-- Roles
IF OBJECT_ID('dbo.Rol','U') IS NULL
BEGIN
CREATE TABLE dbo.Rol (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255) NULL
);
END
GO

-- Usuarios
IF OBJECT_ID('dbo.Usuario','U') IS NULL
BEGIN
CREATE TABLE dbo.Usuario (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    ContrasenaHash NVARCHAR(255) NOT NULL,
    ConfirmadoEmail BIT DEFAULT 0,
    RolId INT NULL,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
END
GO

-- Barberos (owners/providers)
IF OBJECT_ID('dbo.Barbero','U') IS NULL
BEGIN
CREATE TABLE dbo.Barbero (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Activo BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
END
GO

-- Servicios
IF OBJECT_ID('dbo.Servicio','U') IS NULL
BEGIN
CREATE TABLE dbo.Servicio (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    DuracionMin INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
END
GO

-- Precios por servicio y barber
IF OBJECT_ID('dbo.ServicioPrecio','U') IS NULL
BEGIN
CREATE TABLE dbo.ServicioPrecio (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ServicioId INT NOT NULL,
    BarberoId INT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
END
GO

-- Citas
IF OBJECT_ID('dbo.Cita','U') IS NULL
BEGIN
CREATE TABLE dbo.Cita (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    BarberoId INT NULL,
    ServicioId INT NOT NULL,
    FechaInicio DATETIME2 NOT NULL,
    FechaFin DATETIME2 NOT NULL,
    Estado NVARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
END
GO

-- Pagos
IF OBJECT_ID('dbo.Pago','U') IS NULL
BEGIN
CREATE TABLE dbo.Pago (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CitaId INT NULL,
    UsuarioId INT NULL,
    Monto DECIMAL(10,2) NOT NULL,
    Metodo NVARCHAR(50) NULL,
    Estado NVARCHAR(50) NULL,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
END
GO

-- Foreign keys (best-effort, nullable to avoid import ordering issues)
BEGIN TRY
    ALTER TABLE dbo.Usuario ADD CONSTRAINT FK_Usuario_Rol FOREIGN KEY (RolId) REFERENCES dbo.Rol(Id);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Barbero ADD CONSTRAINT FK_Barbero_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuario(Id);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.ServicioPrecio ADD CONSTRAINT FK_ServicioPrecio_Servicio FOREIGN KEY (ServicioId) REFERENCES dbo.Servicio(Id);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.ServicioPrecio ADD CONSTRAINT FK_ServicioPrecio_Barbero FOREIGN KEY (BarberoId) REFERENCES dbo.Barbero(Id);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Cita ADD CONSTRAINT FK_Cita_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuario(Id);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Cita ADD CONSTRAINT FK_Cita_Barbero FOREIGN KEY (BarberoId) REFERENCES dbo.Barbero(Id);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Cita ADD CONSTRAINT FK_Cita_Servicio FOREIGN KEY (ServicioId) REFERENCES dbo.Servicio(Id);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Pago ADD CONSTRAINT FK_Pago_Cita FOREIGN KEY (CitaId) REFERENCES dbo.Cita(Id);
END TRY BEGIN CATCH END CATCH

BEGIN TRY
    ALTER TABLE dbo.Pago ADD CONSTRAINT FK_Pago_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuario(Id);
END TRY BEGIN CATCH END CATCH

GO

PRINT 'Schema file created: minimal FadeBooker_Test schema.'
