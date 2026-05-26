-- ============================================================================
-- MIGRACIÓN: Soporte para Media Estrellas en Reseñas
-- FECHA: 26 de mayo de 2026
-- DESCRIPCIÓN: Cambia el tipo de dato de puntuacion de INT a DECIMAL(3,1)
--              para permitir calificaciones como 4.5.
-- ============================================================================

-- Si hay registros, el cambio de tipo de INT a DECIMAL es seguro.
ALTER TABLE dbo.Reseña
ALTER COLUMN puntuacion DECIMAL(3,1) NOT NULL;

-- Actualizar el constraint de validación
IF EXISTS (SELECT 1 FROM sys.objects WHERE name = 'CHK_Resena_Puntuacion' AND parent_object_id = OBJECT_ID('dbo.Reseña'))
    ALTER TABLE dbo.Reseña DROP CONSTRAINT CHK_Resena_Puntuacion;
IF EXISTS (SELECT 1 FROM sys.objects WHERE name = 'CHK_Puntuacion' AND parent_object_id = OBJECT_ID('dbo.Reseña'))
    ALTER TABLE dbo.Reseña DROP CONSTRAINT CHK_Puntuacion;

ALTER TABLE dbo.Reseña
ADD CONSTRAINT CHK_Resena_Puntuacion CHECK (puntuacion >= 1.0 AND puntuacion <= 5.0);

PRINT '✅ Tabla dbo.Reseña actualizada para soportar media estrellas (DECIMAL 3,1)';
GO

-- ============================================================================
-- BACKFILL: (DESACTIVADO) Se eliminó para evitar duplicados automáticos
-- ============================================================================
/*
INSERT INTO dbo.Reseña (id_cita, id_cliente, id_barbero, id_tienda, puntuacion, comentario, fecha_resena)
...
*/
