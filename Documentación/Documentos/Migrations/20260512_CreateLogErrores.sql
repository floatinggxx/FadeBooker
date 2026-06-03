/*
================================================
SCRIPT: CreateLogErrores
VERSION: V002_20260512_CreateLogErrores
FECHA: 2026-05-12
DESCRIPCIÓN: 
  - Crea la tabla LogErrores para el seguimiento de excepciones en el sistema.
  - Implementa relación con la tabla Usuario.
  - Incluye índice optimizado para filtrado por fecha.
AUTOR: Database Agent (GitHub Copilot)
================================================
*/

-- Crear tabla LogErrores
CREATE TABLE LogErrores (
    -- Identificador
    id_log INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Información del error
    fecha_error DATETIME2 DEFAULT(GETUTCDATE()),
    nivel NVARCHAR(20) DEFAULT('ERROR'),
    mensaje NVARCHAR(MAX) NOT NULL,
    stack_trace NVARCHAR(MAX),
    
    -- Contexto técnico
    usuario_id INT NULL,
    endpoint NVARCHAR(255),
    metodo_http NVARCHAR(10),
    
    -- Gestión
    resuelto BIT DEFAULT(0),

    -- Relación con Usuario (Integridad Referencial)
    CONSTRAINT FK_LogErrores_Usuario FOREIGN KEY (usuario_id) 
        REFERENCES Usuario(id_usuario) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

-- Agregar comentarios descriptivos a la tabla y columnas
EXEC sp_addextendedproperty 'MS_Description', 'Bitácora centralizada de errores del sistema', 'SCHEMA', 'dbo', 'TABLE', 'LogErrores';
EXEC sp_addextendedproperty 'MS_Description', 'ID del usuario que experimentó el error (si estaba autenticado)', 'SCHEMA', 'dbo', 'TABLE', 'LogErrores', 'COLUMN', 'usuario_id';

-- Crear índice para optimizar consultas por fecha (monitoreo y reportes)
CREATE INDEX IX_LogErrores_FechaError ON LogErrores(fecha_error);

-- Crear índice para filtrado rápido de errores no resueltos
CREATE INDEX IX_LogErrores_Resuelto ON LogErrores(resuelto) WHERE resuelto = 0;

-- Validación de estructura
PRINT 'Tabla LogErrores creada exitosamente.';
GO
