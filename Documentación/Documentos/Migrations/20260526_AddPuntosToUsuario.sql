-- ============================================================================
-- MIGRACIÓN: Agregar Puntos de Lealtad a Usuario
-- FECHA: 26 de mayo de 2026
-- DESCRIPCIÓN: Agrega la columna puntos_acumulados a la tabla Usuario para
--              el sistema de fidelización de clientes.
-- ============================================================================

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Usuario]') 
    AND name = 'puntos_acumulados'
)
BEGIN
    ALTER TABLE dbo.Usuario
    ADD puntos_acumulados INT NOT NULL DEFAULT 0;
    
    PRINT '✅ Columna puntos_acumulados agregada exitosamente a dbo.Usuario';
END
ELSE
BEGIN
    PRINT 'ℹ️ La columna puntos_acumulados ya existe en dbo.Usuario';
END
GO
