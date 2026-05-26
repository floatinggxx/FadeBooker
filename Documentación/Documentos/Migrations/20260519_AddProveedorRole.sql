-- Migración para permitir el rol 'Proveedor' en la tabla Usuario
-- Fecha: 2026-05-19

ALTER TABLE Usuario DROP CONSTRAINT CHK_Rol;
ALTER TABLE Usuario ADD CONSTRAINT CHK_Rol CHECK (rol IN ('Cliente', 'Barbero', 'Dueño', 'Proveedor', 'Administrador'));
GO

-- Asegurar que los puntos de lealtad existen si no se agregaron antes
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuario') AND name = 'puntosLealtad')
BEGIN
    ALTER TABLE Usuario ADD puntosLealtad INT DEFAULT 0;
END
GO
