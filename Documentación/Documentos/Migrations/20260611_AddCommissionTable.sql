/*
  MIGRACIÓN: 20260611_AddCommissionTable.sql
  DESCRIPCIÓN: Crea tabla Commission para almacenar comisiones por corte y reglas.
*/

CREATE TABLE dbo.Commission (
  id_commission INT IDENTITY(1,1) PRIMARY KEY,
  id_tienda INT NULL,
  porcentaje DECIMAL(5,2) NOT NULL DEFAULT 5.00, -- porcentaje por defecto (ej: 5%)
  fijo DECIMAL(18,2) NOT NULL DEFAULT 0.00, -- cantidad fija en CLP
  activo BIT NOT NULL DEFAULT 1,
  creado_at DATETIME2 DEFAULT SYSUTCDATETIME(),
  actualizado_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Índice por tienda
CREATE INDEX IX_Commission_Tienda ON dbo.Commission(id_tienda);
