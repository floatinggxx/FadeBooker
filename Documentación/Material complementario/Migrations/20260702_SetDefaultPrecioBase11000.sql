-- Migration: Set default precio_base = 11000 where missing and add DEFAULT constraint
BEGIN TRANSACTION;

-- 1) Update existing NULL or zero prices to 11000
UPDATE dbo.Servicio
SET precio_base = 11000
WHERE precio_base IS NULL OR precio_base = 0;

-- 2) Ensure ServicioBarbero price fallback also uses 11000 when NULL (optional)
UPDATE dbo.ServicioBarbero
SET precio_barbero = 11000
WHERE precio_barbero IS NULL OR precio_barbero = 0;

-- 3) Add DEFAULT constraint for precio_base on Servicio (drop if exists)
IF EXISTS (
    SELECT 1 FROM sys.default_constraints dc
    JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
    JOIN sys.tables t ON t.object_id = c.object_id
    WHERE t.name = 'Servicio' AND c.name = 'precio_base'
)
BEGIN
    DECLARE @dc_name SYSNAME = (
        SELECT dc.name FROM sys.default_constraints dc
        JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
        JOIN sys.tables t ON t.object_id = c.object_id
        WHERE t.name = 'Servicio' AND c.name = 'precio_base'
    );
    IF @dc_name IS NOT NULL
    BEGIN
        DECLARE @dropSql NVARCHAR(400) = N'ALTER TABLE dbo.Servicio DROP CONSTRAINT ' + QUOTENAME(@dc_name);
        EXEC sp_executesql @dropSql;
    END
END

ALTER TABLE dbo.Servicio ADD CONSTRAINT DF_Servicio_precio_base DEFAULT 11000 FOR precio_base;

COMMIT TRANSACTION;

PRINT 'Migration 20260702_SetDefaultPrecioBase11000 applied: set missing prices to 11000 and added default constraint.';

select * from dbo.Servicio;
select * from dbo.ServicioBarbero;