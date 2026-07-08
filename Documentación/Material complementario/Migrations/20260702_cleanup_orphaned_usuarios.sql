-- Script: limpiar usuarios huérfanos (barberos sin tienda / dueños sin tienda)
-- Recomendación: ejecutar en entorno de staging primero y revisar el contenido de la tabla de backup.

SET XACT_ABORT ON;
BEGIN TRANSACTION;

PRINT 'Creando backup de usuarios a eliminar en dbo.Usuario_CleanupBackup';
IF OBJECT_ID('dbo.Usuario_CleanupBackup','U') IS NULL
BEGIN
  SELECT TOP 0 * INTO dbo.Usuario_CleanupBackup FROM dbo.Usuario;
  -- añadir metadatos
  ALTER TABLE dbo.Usuario_CleanupBackup ADD deleted_at DATETIME2 NULL, reason NVARCHAR(200) NULL;
END

-- 1) Usuarios con rol 'Barbero' que NO tienen un registro en dbo.Barbero
--    o cuyo registro en dbo.Barbero no está asociado a una tienda válida
IF OBJECT_ID('tempdb..#OrphanedBarbero') IS NOT NULL DROP TABLE #OrphanedBarbero;
CREATE TABLE #OrphanedBarbero (id_usuario INT PRIMARY KEY);

INSERT INTO #OrphanedBarbero (id_usuario)
SELECT u.id_usuario
FROM dbo.Usuario u
WHERE LOWER(ISNULL(u.rol,'')) = 'barbero'
  AND NOT EXISTS (SELECT 1 FROM dbo.Barbero b WHERE b.id_usuario = u.id_usuario)

UNION

SELECT b.id_usuario
FROM dbo.Barbero b
LEFT JOIN dbo.Tienda t ON b.id_tienda = t.id_tienda
WHERE b.id_tienda IS NULL OR t.id_tienda IS NULL;

-- 2) Usuarios con rol 'Dueño' (o variantes) que no tienen ninguna tienda en dbo.Tienda
IF OBJECT_ID('tempdb..#OrphanedDueno') IS NOT NULL DROP TABLE #OrphanedDueno;
CREATE TABLE #OrphanedDueno (id_usuario INT PRIMARY KEY);

INSERT INTO #OrphanedDueno (id_usuario)
SELECT u.id_usuario
FROM dbo.Usuario u
WHERE LOWER(ISNULL(u.rol,'')) LIKE 'due%'
  AND NOT EXISTS (SELECT 1 FROM dbo.Tienda t WHERE t.id_dueño = u.id_usuario);

-- Mostrar conteos
PRINT 'Orphaned barberos to remove:';
SELECT COUNT(*) AS count_barberos FROM #OrphanedBarbero;
PRINT 'Orphaned duenos to remove:';
SELECT COUNT(*) AS count_duenos FROM #OrphanedDueno;

-- Insertar backup y eliminar (orden: primero barberos, luego dueños, evitando duplicados)
DECLARE @cols NVARCHAR(MAX) = '';
SELECT @cols = STRING_AGG(QUOTENAME(name),',') WITHIN GROUP (ORDER BY column_id)
FROM sys.columns
WHERE object_id = OBJECT_ID('dbo.Usuario')
  AND name NOT IN ('deleted_at','reason');

DECLARE @insertCols NVARCHAR(MAX) = @cols + ', deleted_at, reason';

DECLARE @selectExpr NVARCHAR(MAX) = '';
SELECT @selectExpr = STRING_AGG('u.' + QUOTENAME(name), ',') WITHIN GROUP (ORDER BY column_id)
FROM sys.columns
WHERE object_id = OBJECT_ID('dbo.Usuario')
  AND name NOT IN ('deleted_at','reason');

SET @selectExpr = @selectExpr + ', SYSUTCDATETIME() AS deleted_at, ''orphaned_barbero'' AS reason';

-- Detect identity column in source table and exclude it from insert to avoid needing IDENTITY_INSERT
DECLARE @identityCol SYSNAME = NULL;
SELECT TOP 1 @identityCol = c.name
FROM sys.columns c
JOIN sys.identity_columns ic ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE c.object_id = OBJECT_ID('dbo.Usuario');

IF @identityCol IS NOT NULL
BEGIN
  SELECT @cols = STRING_AGG(QUOTENAME(name),',') WITHIN GROUP (ORDER BY column_id)
  FROM sys.columns
  WHERE object_id = OBJECT_ID('dbo.Usuario')
    AND name NOT IN ('deleted_at','reason', @identityCol);

  SELECT @selectExpr = STRING_AGG('u.' + QUOTENAME(name), ',') WITHIN GROUP (ORDER BY column_id)
  FROM sys.columns
  WHERE object_id = OBJECT_ID('dbo.Usuario')
    AND name NOT IN ('deleted_at','reason', @identityCol);

  SET @selectExpr = @selectExpr + ', SYSUTCDATETIME() AS deleted_at, ''orphaned_barbero'' AS reason';
END
ELSE
BEGIN
  SELECT @cols = STRING_AGG(QUOTENAME(name),',') WITHIN GROUP (ORDER BY column_id)
  FROM sys.columns
  WHERE object_id = OBJECT_ID('dbo.Usuario')
    AND name NOT IN ('deleted_at','reason');

  SELECT @selectExpr = STRING_AGG('u.' + QUOTENAME(name), ',') WITHIN GROUP (ORDER BY column_id)
  FROM sys.columns
  WHERE object_id = OBJECT_ID('dbo.Usuario')
    AND name NOT IN ('deleted_at','reason');

  SET @selectExpr = @selectExpr + ', SYSUTCDATETIME() AS deleted_at, ''orphaned_barbero'' AS reason';
END

SET @insertCols = @cols + ', deleted_at, reason';

DECLARE @sql NVARCHAR(MAX) = N'INSERT INTO dbo.Usuario_CleanupBackup (' + @insertCols + ')
SELECT ' + @selectExpr + '
FROM dbo.Usuario u
INNER JOIN #OrphanedBarbero ob ON u.id_usuario = ob.id_usuario
WHERE NOT EXISTS (SELECT 1 FROM dbo.Usuario_CleanupBackup b WHERE b.id_usuario = u.id_usuario);';

EXEC sp_executesql @sql;

-- Back up dueños
SET @selectExpr = REPLACE(@selectExpr, '''orphaned_barbero'' AS reason', '''orphaned_dueno'' AS reason');
SET @sql = N'INSERT INTO dbo.Usuario_CleanupBackup (' + @insertCols + ')
SELECT ' + @selectExpr + '
FROM dbo.Usuario u
INNER JOIN #OrphanedDueno od ON u.id_usuario = od.id_usuario
WHERE NOT EXISTS (SELECT 1 FROM dbo.Usuario_CleanupBackup b WHERE b.id_usuario = u.id_usuario);';

EXEC sp_executesql @sql;

-- Opcional: mostrar los usuarios que se eliminarán (limitar columnas para revisión)
SELECT id_usuario, nombre, email, telefono, rol
FROM dbo.Usuario
WHERE id_usuario IN (SELECT id_usuario FROM #OrphanedBarbero UNION SELECT id_usuario FROM #OrphanedDueno);

-- DELETE activo: eliminar los usuarios huérfanos (destructivo)
DELETE FROM dbo.Usuario
WHERE id_usuario IN (SELECT id_usuario FROM #OrphanedBarbero UNION SELECT id_usuario FROM #OrphanedDueno);

-- Commit final
COMMIT TRANSACTION;

PRINT 'Eliminación completada. Revisa dbo.Usuario_CleanupBackup para el backup de los registros eliminados.';