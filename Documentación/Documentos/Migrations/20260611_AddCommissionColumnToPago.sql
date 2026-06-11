-- Agrega la columna 'comision' a la tabla Pago para almacenar el monto calculado de comisión
IF COL_LENGTH('dbo.Pago', 'comision') IS NULL
BEGIN
  ALTER TABLE dbo.Pago
  ADD comision DECIMAL(18,2) NULL;
END

-- Añadir índice opcional para búsquedas por referencia o estado si se requiere
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Pago_Referencia')
BEGIN
  CREATE NONCLUSTERED INDEX IX_Pago_Referencia ON dbo.Pago(referencia_transaccion);
END
