-- fix-duplicate-citas.sql
-- Script seguro para detectar y limpiar citas duplicadas para un barbero
-- RECOMENDACIONES:
-- 1) Hacer backup de la base de datos antes de ejecutar.
-- 2) Ejecutar las secciones SELECT (3a y 3b) primero para revisar qué se modificaría.
-- 3) Luego ejecutar 3c (UPDATE pagos) y 3d (DELETE duplicados) si todo está correcto.
-- Ajusta los filtros de fecha/id_barbero según necesites.

-- Parámetros (ajusta según sea necesario)
DECLARE @barbero INT = 9;
DECLARE @fecha_inicio DATETIME = '2026-06-16';
DECLARE @fecha_fin DATETIME = DATEADD(day, 3, @fecha_inicio);

-- 1) Mostrar grupos duplicados (misma hora inicio y misma duración)
SELECT id_barbero, fecha_hora_inicio, duracion_minutos,
       COUNT(*) AS cnt,
       STRING_AGG(CAST(id_cita AS varchar(20)), ',') WITHIN GROUP (ORDER BY id_cita) AS ids
FROM dbo.Cita
WHERE id_barbero = @barbero
  AND fecha_hora_inicio >= @fecha_inicio
  AND fecha_hora_inicio < @fecha_fin
GROUP BY id_barbero, fecha_hora_inicio, duracion_minutos
HAVING COUNT(*) > 1
ORDER BY fecha_hora_inicio;

-- 2) (Opcional) Ver pagos asociados a los ids conflictivos
-- Reemplaza la lista de ids por la salida de la consulta anterior si difiere
-- SELECT p.id_pago, p.id_cita, p.monto_pagado, p.estado_pago, p.createdAt
-- FROM dbo.Pago p
-- WHERE p.id_cita IN (79,81,94,95,96)
-- ORDER BY p.id_cita, p.createdAt;

-- 3a) Tabla temporal con duplicados y el id que se conservará (rn = 1)
;WITH dup AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY id_barbero, fecha_hora_inicio, duracion_minutos ORDER BY id_cita) AS rn,
         MIN(id_cita) OVER (PARTITION BY id_barbero, fecha_hora_inicio, duracion_minutos) AS id_conservar
  FROM dbo.Cita
  WHERE id_barbero = @barbero
    AND fecha_hora_inicio >= @fecha_inicio
    AND fecha_hora_inicio < @fecha_fin
)
SELECT id_cita, id_conservar, rn, fecha_hora_inicio, duracion_minutos, estado
FROM dup
ORDER BY fecha_hora_inicio, id_cita;

-- 3b) DRY-RUN: ver qué cambios se harían en Pago (no modifica datos)
;WITH dup AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY id_barbero, fecha_hora_inicio, duracion_minutos ORDER BY id_cita) AS rn,
         MIN(id_cita) OVER (PARTITION BY id_barbero, fecha_hora_inicio, duracion_minutos) AS id_conservar
  FROM dbo.Cita
  WHERE id_barbero = @barbero
    AND fecha_hora_inicio >= @fecha_inicio
    AND fecha_hora_inicio < @fecha_fin
)
SELECT p.id_pago, p.id_cita AS id_cita_actual, d.id_conservar AS id_cita_destino, p.monto_pagado, p.estado_pago, p.createdAt
FROM dbo.Pago p
JOIN dup d ON p.id_cita = d.id_cita
WHERE d.rn > 1
ORDER BY p.id_cita, p.id_pago;

-- 3c) REASIGNAR pagos de duplicados al id_conservar
-- Ejecutar SOLO si verificaste 3a/3b y estás de acuerdo con los cambios
;WITH dup AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY id_barbero, fecha_hora_inicio, duracion_minutos ORDER BY id_cita) AS rn,
         MIN(id_cita) OVER (PARTITION BY id_barbero, fecha_hora_inicio, duracion_minutos) AS id_conservar
  FROM dbo.Cita
  WHERE id_barbero = @barbero
    AND fecha_hora_inicio >= @fecha_inicio
    AND fecha_hora_inicio < @fecha_fin
)
UPDATE p
SET id_cita = d.id_conservar
FROM dbo.Pago p
JOIN dup d ON p.id_cita = d.id_cita
WHERE d.rn > 1;

-- 3d) ELIMINAR citas duplicadas (mantener rn = 1)
-- Ejecutar SOLO después de 3c
;WITH dup AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY id_barbero, fecha_hora_inicio, duracion_minutos ORDER BY id_cita) AS rn
  FROM dbo.Cita
  WHERE id_barbero = @barbero
    AND fecha_hora_inicio >= @fecha_inicio
    AND fecha_hora_inicio < @fecha_fin
)
DELETE FROM dbo.Cita
WHERE id_cita IN (SELECT id_cita FROM dup WHERE rn > 1);

-- 4) Comprobar resultado
SELECT id_cita, id_cliente, fecha_hora_inicio, DATEADD(minute, duracion_minutos, fecha_hora_inicio) AS fecha_hora_fin, duracion_minutos, estado, monto_total
FROM dbo.Cita
WHERE id_barbero = @barbero
  AND fecha_hora_inicio >= @fecha_inicio
  AND fecha_hora_inicio < @fecha_fin
ORDER BY fecha_hora_inicio, id_cita;
