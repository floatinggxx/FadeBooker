-- Migración: normalizar columna rol en dbo.Usuario y añadir trigger para futuros inserts/updates

BEGIN TRANSACTION;

-- 1) Actualizar los valores existentes: primera letra mayúscula, resto minúscula
UPDATE dbo.Usuario
SET rol = UPPER(LEFT(rol,1)) + LOWER(SUBSTRING(rol,2, LEN(rol)))
WHERE rol IS NOT NULL AND LTRIM(RTRIM(rol)) <> '';

-- 2) Crear trigger que normalice rol después de INSERT o UPDATE
IF OBJECT_ID('dbo.trg_Usuario_NormalizeRol', 'TR') IS NOT NULL
    DROP TRIGGER dbo.trg_Usuario_NormalizeRol;
GO

CREATE TRIGGER dbo.trg_Usuario_NormalizeRol
ON dbo.Usuario
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE u
  SET u.rol = UPPER(LEFT(i.rol,1)) + LOWER(SUBSTRING(i.rol,2, LEN(i.rol)))
  FROM dbo.Usuario u
  INNER JOIN inserted i ON u.id_usuario = i.id_usuario
  WHERE i.rol IS NOT NULL AND LTRIM(RTRIM(i.rol)) <> '';
END
GO

COMMIT TRANSACTION;
