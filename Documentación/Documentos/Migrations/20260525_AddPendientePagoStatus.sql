/*
  MIGRACIÓN: 20260525_AddPendientePagoStatus.sql
  DESCRIPCIÓN: Actualiza el CHECK constraint de la tabla Cita para soportar 'pendiente'
*/

-- 1. Eliminar el constraint antiguo
ALTER TABLE dbo.Cita DROP CONSTRAINT CHK_Estado;

-- 2. Agregar el nuevo constraint con 'pendiente'
ALTER TABLE dbo.Cita ADD CONSTRAINT CHK_Estado 
CHECK (estado IN ('confirmada', 'cancelada', 'completada', 'no_presentado', 'pendiente'));
