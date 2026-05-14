/*
  MIGRACIÓN: 20260514_AddContrasenaToUsuario
  DESCRIPCIÓN: Añade el campo 'contrasena' a la tabla 'Usuario' para soportar autenticación.
  FECHA: 14 de mayo de 2026
*/

IF NOT EXISTS (
    SELECT * 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'dbo.Usuario') 
    AND name = 'contrasena'
)
BEGIN
    ALTER TABLE dbo.Usuario 
    ADD contrasena NVARCHAR(255) NULL; -- Temporalmente NULL para permitir usuarios existentes
END
GO

-- NOTA: Se recomienda actualizar los registros existentes con un hash por defecto 
-- y luego cambiar la columna a NOT NULL si se desea obligatoriedad estricta.
-- ALTER TABLE dbo.Usuario ALTER COLUMN contrasena NVARCHAR(255) NOT NULL;
