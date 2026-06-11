-- Scrip Fernanda Modificacion
-- Objetivo: Crear la tabla BloqueHorario y el índice necesario
-- Instrucciones: Ejecutar en la base de datos FadeBooker_DB (SSMS o Azure Data Studio)

IF OBJECT_ID('dbo.BloqueHorario', 'U') IS NULL
BEGIN
  PRINT 'Creando tabla BloqueHorario...';

  CREATE TABLE dbo.BloqueHorario (
    id_bloque INT IDENTITY(1,1) PRIMARY KEY,
    id_barbero INT NOT NULL,
    fecha_hora_inicio DATETIME2 NOT NULL,
    fecha_hora_fin DATETIME2 NOT NULL,
    motivo NVARCHAR(255) NULL,
    estado BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT CK_BloqueHorario_Rango CHECK (fecha_hora_inicio < fecha_hora_fin)
  );

  PRINT 'Tabla BloqueHorario creada.';
END
ELSE
BEGIN
  PRINT 'La tabla BloqueHorario ya existe. No se realizan cambios en la tabla.';
END

-- Crear índice filtrado para desempeño (solo filas activas)
IF NOT EXISTS (
  SELECT name FROM sys.indexes WHERE name = 'IX_BloqueHorario_Barbero' AND object_id = OBJECT_ID('dbo.BloqueHorario')
)
BEGIN
  PRINT 'Creando índice IX_BloqueHorario_Barbero...';
  CREATE INDEX IX_BloqueHorario_Barbero ON dbo.BloqueHorario (id_barbero, fecha_hora_inicio) WHERE estado = 1;
  PRINT 'Índice creado.';
END
ELSE
BEGIN
  PRINT 'Índice IX_BloqueHorario_Barbero ya existe.';
END

-- Opcional: agregar FK con Barbero si aplica (descomentar y ajustar nombre de tabla/columna si fuera necesario)
/*
IF NOT EXISTS (
  SELECT 1 FROM sys.foreign_keys fk WHERE fk.name = 'FK_BloqueHorario_Barbero'
)
BEGIN
  ALTER TABLE dbo.BloqueHorario
  ADD CONSTRAINT FK_BloqueHorario_Barbero FOREIGN KEY (id_barbero)
  REFERENCES dbo.Barbero(id_barbero) ON DELETE CASCADE;
  PRINT 'FK_BloqueHorario_Barbero creada.';
END
ELSE
BEGIN
  PRINT 'FK_BloqueHorario_Barbero ya existe.';
END
*/
