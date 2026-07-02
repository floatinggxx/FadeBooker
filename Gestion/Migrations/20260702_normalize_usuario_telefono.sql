-- Migración: normalizar columna telefono en dbo.Usuario a formato +56912345678 y crear trigger

BEGIN TRANSACTION;

-- Helper: remover caracteres comunes no numéricos (espacios, paréntesis, guiones, puntos, plus)
-- Usamos una cadena de REPLACE encadenada para portabilidad
UPDATE dbo.Usuario
SET telefono = LTRIM(RTRIM(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(telefono,' ',''),'-',''),'.',''),')',''),'(',''),'+','')
  ))
WHERE telefono IS NOT NULL;

-- Ahora transformar los valores a formato +56... especialmente para móviles iniciando en 9
-- 1) Si empieza con '9' y tiene 9 dígitos (9xxxxxxx -> 9 + 8 dígitos), asumimos móvil y agregamos +56
UPDATE dbo.Usuario
SET telefono = '+56' + telefono
WHERE telefono IS NOT NULL AND telefono LIKE '9________'; -- 9 + 8 caracteres

-- 2) Si empieza con '0' seguido de 9..., quitar cero y agregar +56
UPDATE dbo.Usuario
SET telefono = '+56' + SUBSTRING(telefono,2,100)
WHERE telefono IS NOT NULL AND telefono LIKE '09________';

-- 3) Si empieza con '56' pero sin +, agregar +
UPDATE dbo.Usuario
SET telefono = '+' + telefono
WHERE telefono IS NOT NULL AND telefono LIKE '56%';

-- 4) Para cualquier otro caso numérico, asegurar que tenga prefijo +
UPDATE dbo.Usuario
SET telefono = '+' + telefono
WHERE telefono IS NOT NULL AND telefono NOT LIKE '+%';

-- Crear trigger para normalizar futuros inserts/updates
IF OBJECT_ID('dbo.trg_Usuario_NormalizeTelefono', 'TR') IS NOT NULL
    DROP TRIGGER dbo.trg_Usuario_NormalizeTelefono;
GO

CREATE TRIGGER dbo.trg_Usuario_NormalizeTelefono
ON dbo.Usuario
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE u
  SET u.telefono = CASE
      WHEN i.telefono IS NULL OR LTRIM(RTRIM(i.telefono)) = '' THEN u.telefono
      ELSE
        -- eliminar caracteres comunes
        (CASE
          WHEN patindex('%[^0-9]%', i.telefono) > 0
            THEN '+' + (SELECT REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(i.telefono,' ',''),'-',''),'.',''),')',''),'(',''),'+',''))
          ELSE
            (CASE
              WHEN i.telefono LIKE '9%' THEN '+56' + i.telefono
              WHEN i.telefono LIKE '09%' THEN '+56' + SUBSTRING(i.telefono,2,100)
              WHEN i.telefono LIKE '56%' THEN '+' + i.telefono
              WHEN i.telefono LIKE '+56%' THEN i.telefono
              ELSE '+' + i.telefono
            END)
        END)
    END
  FROM dbo.Usuario u
  INNER JOIN inserted i ON u.id_usuario = i.id_usuario;
END
GO

COMMIT TRANSACTION;
