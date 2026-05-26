/*
  MIGRACIÓN: 20260525_AddPaymentConfig.sql
  DESCRIPCIÓN: Agrega campos para configurar abonos y estados de pago en Citas.
*/

-- 1. Agregar campos a la tabla Cita
ALTER TABLE dbo.Cita ADD tipo_pago_reserva NVARCHAR(20) DEFAULT 'abono'; -- 'abono' o 'total'
ALTER TABLE dbo.Cita ADD pago_completo BIT DEFAULT 0;

-- 2. Asegurar que el constraint de estado incluya 'pendiente_pago' si es necesario
-- (Ya se agregó 'pendiente' en la migración anterior, usaremos ese para flujo de caja)

-- 3. Actualizar registros existentes si es necesario
UPDATE dbo.Cita SET tipo_pago_reserva = 'total', pago_completo = 1 WHERE estado = 'completada';
UPDATE dbo.Cita SET tipo_pago_reserva = 'abono', pago_completo = 0 WHERE estado = 'confirmada' AND pago_abono < monto_total;
UPDATE dbo.Cita SET tipo_pago_reserva = 'total', pago_completo = 1 WHERE estado = 'confirmada' AND pago_abono = monto_total;
