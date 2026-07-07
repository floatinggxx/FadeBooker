/*
  Migración segura para eliminar usuarios y sus dependencias
  - Usuarios objetivo (ejemplo): 50,52,40,97
  - Crea respaldos SELECT INTO en esquema temporal (dbo.Backup_*)
  - Valida dependencias y borra en orden que evita violaciones de FK
  - Ejecutar en staging primero. Mantener copia de seguridad externa antes de aplicar en producción.

  USO: editar la tabla @UserIds para incluir los ids reales antes de ejecutar.
*/

SET NOCOUNT ON;

-- Lista de usuarios a borrar (editar según necesites)
DECLARE @UserIds TABLE (id_usuario INT);
INSERT INTO @UserIds (id_usuario) VALUES (50),(52),(40),(97);

-- 1) Crear respaldos de todas las tablas que referencian a Usuario (ajusta nombres si difieren)
IF OBJECT_ID('tempdb..#UserList') IS NOT NULL DROP TABLE #UserList;
SELECT id_usuario INTO #UserList FROM @UserIds;

-- Derivar ids de barbero asociados a los usuarios objetivo
IF OBJECT_ID('tempdb..#BarberoIds') IS NOT NULL DROP TABLE #BarberoIds;
SELECT b.id_barbero INTO #BarberoIds FROM dbo.Barbero b JOIN #UserList t ON b.id_usuario = t.id_usuario;

-- Backup: Usuario
IF OBJECT_ID('dbo.Backup_Usuario_ToDelete','U') IS NOT NULL DROP TABLE dbo.Backup_Usuario_ToDelete;
SELECT * INTO dbo.Backup_Usuario_ToDelete FROM dbo.Usuario u WHERE EXISTS (SELECT 1 FROM #UserList t WHERE t.id_usuario = u.id_usuario);

-- Backup: Barbero
IF OBJECT_ID('dbo.Backup_Barbero_ToDelete','U') IS NOT NULL DROP TABLE dbo.Backup_Barbero_ToDelete;
SELECT * INTO dbo.Backup_Barbero_ToDelete FROM dbo.Barbero b WHERE EXISTS (SELECT 1 FROM #UserList t WHERE t.id_usuario = b.id_usuario);

-- Backup: Cita (citas donde el usuario es cliente o barbero)
IF OBJECT_ID('dbo.Backup_Cita_ToDelete','U') IS NOT NULL DROP TABLE dbo.Backup_Cita_ToDelete;
SELECT c.* INTO dbo.Backup_Cita_ToDelete FROM dbo.Cita c
WHERE EXISTS (SELECT 1 FROM #UserList t WHERE t.id_usuario = c.id_cliente) OR EXISTS (SELECT 1 FROM #BarberoIds b2 WHERE b2.id_barbero = c.id_barbero);

-- Derivar ids de cita que serán eliminadas (para respaldos en tablas que referencian cita)
IF OBJECT_ID('tempdb..#CitaIds') IS NOT NULL DROP TABLE #CitaIds;
SELECT id_cita INTO #CitaIds FROM dbo.Backup_Cita_ToDelete;

-- Backup: AuditoriaCancelacion (registros que referencian citas)
IF OBJECT_ID('dbo.Backup_AuditoriaCancelacion_ToDelete','U') IS NOT NULL DROP TABLE dbo.Backup_AuditoriaCancelacion_ToDelete;
IF OBJECT_ID('dbo.AuditoriaCancelacion','U') IS NOT NULL
BEGIN
  SELECT ac.* INTO dbo.Backup_AuditoriaCancelacion_ToDelete FROM dbo.AuditoriaCancelacion ac
  WHERE EXISTS (SELECT 1 FROM #CitaIds ci WHERE ci.id_cita = ac.id_cita);
END


-- Backup: Pago
IF OBJECT_ID('dbo.Backup_Pago_ToDelete','U') IS NOT NULL DROP TABLE dbo.Backup_Pago_ToDelete;
SELECT p.* INTO dbo.Backup_Pago_ToDelete FROM dbo.Pago p
JOIN dbo.Cita c ON c.id_cita = p.id_cita
WHERE EXISTS (SELECT 1 FROM #UserList t WHERE t.id_usuario = c.id_cliente) OR EXISTS (SELECT 1 FROM #BarberoIds b2 WHERE b2.id_barbero = c.id_barbero);

-- Backup: Reseña
IF OBJECT_ID('dbo.Backup_Resena_ToDelete','U') IS NOT NULL DROP TABLE dbo.Backup_Resena_ToDelete;
SELECT r.* INTO dbo.Backup_Resena_ToDelete FROM dbo.Reseña r WHERE EXISTS (SELECT 1 FROM #UserList t WHERE t.id_usuario = r.id_cliente) OR EXISTS (SELECT 1 FROM #BarberoIds b2 WHERE b2.id_barbero = r.id_barbero);

-- Backup: ServicioBarbero (si el usuario es barbero)
IF OBJECT_ID('dbo.Backup_ServicioBarbero_ToDelete','U') IS NOT NULL DROP TABLE dbo.Backup_ServicioBarbero_ToDelete;
SELECT sb.* INTO dbo.Backup_ServicioBarbero_ToDelete FROM dbo.ServicioBarbero sb WHERE EXISTS (SELECT 1 FROM #BarberoIds b2 WHERE b2.id_barbero = sb.id_barbero);

-- Backup: Tienda (si el usuario es dueño/owner)
IF OBJECT_ID('dbo.Backup_Tienda_Owner_ToDelete','U') IS NOT NULL DROP TABLE dbo.Backup_Tienda_Owner_ToDelete;
SELECT t.* INTO dbo.Backup_Tienda_Owner_ToDelete FROM dbo.Tienda t WHERE EXISTS (SELECT 1 FROM #UserList u WHERE u.id_usuario = t.id_dueño);

-- Agrega aquí otros backups según tu esquema (Notificaciones, PhoneVerifications, etc.)

-- 2) Mostrar conteo de filas afectadas (para revisión)
SELECT 'Usuario' AS tabla, COUNT(*) AS filas FROM dbo.Backup_Usuario_ToDelete
UNION ALL SELECT 'Barbero', COUNT(*) FROM dbo.Backup_Barbero_ToDelete
UNION ALL SELECT 'Cita', COUNT(*) FROM dbo.Backup_Cita_ToDelete
UNION ALL SELECT 'Pago', COUNT(*) FROM dbo.Backup_Pago_ToDelete
UNION ALL SELECT 'Reseña', COUNT(*) FROM dbo.Backup_Resena_ToDelete
UNION ALL SELECT 'ServicioBarbero', COUNT(*) FROM dbo.Backup_ServicioBarbero_ToDelete;

-- 3) Borrar en orden seguro dentro de transacción
BEGIN TRANSACTION;
BEGIN TRY

  -- 3.a Eliminar dependencias que referencian barbero id (ServicioBarbero primero)
  DELETE sb
  FROM dbo.ServicioBarbero sb
  JOIN #BarberoIds bi ON sb.id_barbero = bi.id_barbero;

  -- 3.b Eliminar reseñas que referencien barbero o cliente
  DELETE r
  FROM dbo.Reseña r
  WHERE EXISTS (SELECT 1 FROM #UserList t WHERE t.id_usuario = r.id_cliente) OR EXISTS (SELECT 1 FROM #BarberoIds b2 WHERE b2.id_barbero = r.id_barbero);

  -- 3.c Eliminar pagos relacionados (a través de Cita)
  DELETE p
  FROM dbo.Pago p
  JOIN dbo.Cita c ON c.id_cita = p.id_cita
  WHERE EXISTS (SELECT 1 FROM #UserList t WHERE t.id_usuario = c.id_cliente) OR EXISTS (SELECT 1 FROM #BarberoIds b2 WHERE b2.id_barbero = c.id_barbero);

  -- 3.c.1 Eliminar auditoría de cancelaciones ligada a las citas
  IF OBJECT_ID('dbo.AuditoriaCancelacion','U') IS NOT NULL
  BEGIN
    DELETE ac
    FROM dbo.AuditoriaCancelacion ac
    JOIN #CitaIds ci ON ci.id_cita = ac.id_cita;
  END

  -- 3.d Eliminar citas donde sea cliente o barbero
  DELETE c
  FROM dbo.Cita c
  WHERE EXISTS (SELECT 1 FROM #UserList t WHERE t.id_usuario = c.id_cliente) OR EXISTS (SELECT 1 FROM #BarberoIds b2 WHERE b2.id_barbero = c.id_barbero);

  -- 3.d.1 Desvincular tiendas cuyo dueño será eliminado: setear id_dueño = NULL (respaldadas arriba)
  UPDATE dbo.Tienda
  SET id_dueño = NULL, updatedAt = GETDATE()
  WHERE EXISTS (SELECT 1 FROM #UserList t WHERE t.id_usuario = dbo.Tienda.id_dueño);

  -- 3.e Eliminar filas en Barbero para usuarios objetivo
  DELETE b
  FROM dbo.Barbero b
  JOIN #UserList t ON b.id_usuario = t.id_usuario;

  -- 3.f Finalmente eliminar usuarios
  DELETE u
  FROM dbo.Usuario u
  JOIN #UserList t ON u.id_usuario = t.id_usuario;

  COMMIT TRANSACTION;
  PRINT 'Eliminación completada. Revisa las tablas de backup dbo.Backup_* para los registros eliminados.';

END TRY
BEGIN CATCH
  ROLLBACK TRANSACTION;
  DECLARE @err_msg NVARCHAR(4000) = ERROR_MESSAGE();
  PRINT 'ERROR: Transacción abortada. ' + @err_msg;
  -- Opcional: re-lanzar el error
  THROW;
END CATCH;

SET NOCOUNT OFF;
