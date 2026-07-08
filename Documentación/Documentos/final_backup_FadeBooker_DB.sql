-- sql
/* Created by GitHub Copilot in VSCode MSSQL - review carefully before executing
   FINAL BACKUP UNIFICADO - FADEBOOKER (DDL generator)
   Uso:
   1) Ejecute primero la sección A para crear FadeBooker_Test.
   2) Ejecute la sección B para generar DDL CREATE TABLE/PK/FK/INDEXS completos basados en FadeBooker_DB.
   3) Copie y ejecute el resultado generado (imprime los CREATE TABLE completos) en el contexto del servidor destino.
   NOTA: Este script construye DDL dinámicamente desde metadatos; revise antes de ejecutar en producción.
*/

--------------------------------------------------------------------------------
-- A) Crear base de datos de pruebas (si no existe)
--------------------------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = 'FadeBooker_Test')
BEGIN
    CREATE DATABASE FadeBooker_Test;
END;

--------------------------------------------------------------------------------
-- B) Generador de DDL: construye CREATE TABLE + PK + FKs + INDEXes para cada tabla
--      basado en metadatos de la BD actual (FadeBooker_DB).
--      Resultado: imprime en la salida T-SQL todos los scripts DDL listos.
--------------------------------------------------------------------------------

SET NOCOUNT ON;

DECLARE @srcDb SYSNAME = QUOTENAME(DB_NAME()); -- origen: FadeBooker_DB (conectarse a esa DB antes)
DECLARE @destDb SYSNAME = 'FadeBooker_Test';
DECLARE @sql NVARCHAR(MAX);

-- 1) Generar CREATE TABLE (columnas, types, NULL/NOT NULL, IDENTITY, DEFAULTs)
;WITH tbl AS (
    SELECT t.object_id, s.name AS schema_name, t.name AS table_name
    FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE t.is_ms_shipped = 0
)
SELECT @sql = STRING_AGG(ddl, CHAR(13)+CHAR(10)+CHAR(13)+CHAR(10))
FROM (
    SELECT
        '/* Table: ' + QUOTENAME(schema_name) + '.' + QUOTENAME(table_name) + ' */' + CHAR(13)+CHAR(10) +
        'IF NOT EXISTS (SELECT 1 FROM ' + QUOTENAME(@destDb) + '.sys.tables t WHERE t.name = ''' + table_name + ''' AND SCHEMA_NAME(t.schema_id) = ''' + schema_name + ''')' + CHAR(13)+CHAR(10) +
        'BEGIN' + CHAR(13)+CHAR(10) +
        '    PRINT(''Creating table ' + QUOTENAME(@destDb) + '.' + QUOTENAME(schema_name) + '.' + QUOTENAME(table_name) + ''');' + CHAR(13)+CHAR(10) +
        '    EXEC(''' +
            'CREATE TABLE ' + QUOTENAME(@destDb) + '.' + QUOTENAME(schema_name) + '.' + QUOTENAME(table_name) + ' (' + 
            STUFF((
                SELECT ', ' + CHAR(13)+CHAR(10) + '        ' +
                    QUOTENAME(c.name) + ' ' +
                    CASE 
                        WHEN ty.name IN ('varchar','char','varbinary','binary','nvarchar','nchar') 
                            THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'MAX' ELSE CAST(
                                  CASE WHEN ty.name IN ('nchar','nvarchar') THEN c.max_length/2 ELSE c.max_length END
                                AS VARCHAR(10)) + ')' 
                        WHEN ty.name IN ('decimal','numeric') 
                            THEN ty.name + '(' + CAST(c.precision AS VARCHAR(3)) + ',' + CAST(c.scale AS VARCHAR(3)) + ')'
                        ELSE ty.name
                    END +
                    CASE WHEN c.is_identity = 1 THEN ' IDENTITY(' + CAST(ic.seed_value AS VARCHAR(20)) + ',' + CAST(ic.increment_value AS VARCHAR(20)) + ')' ELSE '' END +
                    CASE WHEN c.is_nullable = 0 THEN ' NOT NULL' ELSE ' NULL' END +
                    ISNULL(' DEFAULT ' + dc.definition, '')
                FROM sys.columns c
                LEFT JOIN sys.types ty ON c.user_type_id = ty.user_type_id
                LEFT JOIN sys.identity_columns ic ON c.object_id = ic.object_id AND c.column_id = ic.column_id
                LEFT JOIN sys.default_constraints dc ON c.default_object_id = dc.object_id
                WHERE c.object_id = t.object_id
                ORDER BY c.column_id
                FOR XML PATH(''), TYPE).value('.','NVARCHAR(MAX)'),1,2,'') 
            + CHAR(13)+CHAR(10) + '    );' + '''' + CHAR(13)+CHAR(10) +
        ');' + CHAR(13)+CHAR(10) +
        'END'
    FROM tbl t
) x;

PRINT '--- DDL CREATE TABLEs GENERATED BELOW ---';
PRINT @sql;

--------------------------------------------------------------------------------
-- C) Generar PRIMARY KEYS
--    Se imprime ALTER TABLE ... ADD CONSTRAINT PK_... para cada key
--------------------------------------------------------------------------------
DECLARE @pkSql NVARCHAR(MAX);
SELECT @pkSql = STRING_AGG(pkddl, CHAR(13)+CHAR(10)+CHAR(13)+CHAR(10))
FROM (
    SELECT
        '/* PK: ' + QUOTENAME(SCHEMA_NAME(t.schema_id)) + '.' + QUOTENAME(t.name) + ' */' + CHAR(13)+CHAR(10) +
        'IF NOT EXISTS (SELECT 1 FROM ' + QUOTENAME(@destDb) + '.sys.key_constraints kc WHERE kc.parent_object_id = OBJECT_ID(''' + QUOTENAME(@destDb) + '.' + QUOTENAME(SCHEMA_NAME(t.schema_id)) + '.' + QUOTENAME(t.name) + ''') AND kc.type = ''PK'')' + CHAR(13)+CHAR(10) +
        'BEGIN' + CHAR(13)+CHAR(10) +
        '    ALTER TABLE ' + QUOTENAME(@destDb) + '.' + QUOTENAME(SCHEMA_NAME(t.schema_id)) + '.' + QUOTENAME(t.name) + ' ADD CONSTRAINT ' + QUOTENAME(k.name) + ' PRIMARY KEY ' +
        '(' + STUFF((
            SELECT ', ' + QUOTENAME(c.name)
            FROM sys.index_columns ic
            JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
            WHERE ic.object_id = t.object_id AND ic.index_id = k.unique_index_id
            ORDER BY ic.key_ordinal
            FOR XML PATH(''), TYPE).value('.','NVARCHAR(MAX)'),1,2,'') + ');' + CHAR(13)+CHAR(10) +
        'END'
    FROM sys.tables t
    JOIN sys.key_constraints k ON k.parent_object_id = t.object_id AND k.type = 'PK'
) y;

IF @pkSql IS NOT NULL
BEGIN
    PRINT '--- PK DDL GENERATED BELOW ---';
    PRINT @pkSql;
END

--------------------------------------------------------------------------------
-- D) Generar FOREIGN KEYS
--------------------------------------------------------------------------------
DECLARE @fkSql NVARCHAR(MAX);
SELECT @fkSql = STRING_AGG(fkddl, CHAR(13)+CHAR(10)+CHAR(13)+CHAR(10))
FROM (
    SELECT
        '/* FK: ' + QUOTENAME(OBJECT_SCHEMA_NAME(f.parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(f.parent_object_id)) + ' -> ' + 
            QUOTENAME(OBJECT_SCHEMA_NAME(f.referenced_object_id)) + '.' + QUOTENAME(OBJECT_NAME(f.referenced_object_id)) + ' */' + CHAR(13)+CHAR(10) +
        'IF NOT EXISTS (SELECT 1 FROM ' + QUOTENAME(@destDb) + '.sys.foreign_keys fk WHERE fk.parent_object_id = OBJECT_ID(''' + QUOTENAME(@destDb) + '.' + QUOTENAME(OBJECT_SCHEMA_NAME(f.parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(f.parent_object_id)) + ''') AND fk.name = ''' + f.name + ''')' + CHAR(13)+CHAR(10) +
        'BEGIN' + CHAR(13)+CHAR(10) +
        '    ALTER TABLE ' + QUOTENAME(@destDb) + '.' + QUOTENAME(OBJECT_SCHEMA_NAME(f.parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(f.parent_object_id)) + ' WITH NOCHECK ADD CONSTRAINT ' + QUOTENAME(f.name) + ' FOREIGN KEY (' +
            STUFF((SELECT ', ' + QUOTENAME(pc.name)
                   FROM sys.foreign_key_columns fkc
                   JOIN sys.columns pc ON pc.object_id = fkc.parent_object_id AND pc.column_id = fkc.parent_column_id
                   WHERE fkc.constraint_object_id = f.object_id
                   ORDER BY fkc.constraint_column_id
                   FOR XML PATH(''), TYPE).value('.','NVARCHAR(MAX)'),1,2,'') + ') REFERENCES ' +
            QUOTENAME(@destDb) + '.' + QUOTENAME(OBJECT_SCHEMA_NAME(f.referenced_object_id)) + '.' + QUOTENAME(OBJECT_NAME(f.referenced_object_id)) + ' (' +
            STUFF((SELECT ', ' + QUOTENAME(rc.name)
                   FROM sys.foreign_key_columns fkc
                   JOIN sys.columns rc ON rc.object_id = fkc.referenced_object_id AND rc.column_id = fkc.referenced_column_id
                   WHERE fkc.constraint_object_id = f.object_id
                   ORDER BY fkc.constraint_column_id
                   FOR XML PATH(''), TYPE).value('.','NVARCHAR(MAX)'),1,2,'') + ')' + CHAR(13)+CHAR(10) +
        '    ALTER TABLE ' + QUOTENAME(@destDb) + '.' + QUOTENAME(OBJECT_SCHEMA_NAME(f.parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(f.parent_object_id)) + ' CHECK CONSTRAINT ' + QUOTENAME(f.name) + ';' + CHAR(13)+CHAR(10) +
        'END'
    FROM sys.foreign_keys f
) z;

IF @fkSql IS NOT NULL
BEGIN
    PRINT '--- FK DDL GENERATED BELOW ---';
    PRINT @fkSql;
END

--------------------------------------------------------------------------------
-- E) Generar CREATE INDEX para índices no-clustered (excluye PK/unique constraints)
--------------------------------------------------------------------------------
DECLARE @ixSql NVARCHAR(MAX);
SELECT @ixSql = STRING_AGG(ixddl, CHAR(13)+CHAR(10)+CHAR(13)+CHAR(10))
FROM (
    SELECT
        '/* Index: ' + QUOTENAME(OBJECT_SCHEMA_NAME(i.object_id)) + '.' + QUOTENAME(OBJECT_NAME(i.object_id)) + ' - ' + QUOTENAME(i.name) + ' */' + CHAR(13)+CHAR(10) +
        'IF NOT EXISTS (SELECT 1 FROM ' + QUOTENAME(@destDb) + '.sys.indexes ix WHERE ix.object_id = OBJECT_ID(''' + QUOTENAME(@destDb) + '.' + QUOTENAME(OBJECT_SCHEMA_NAME(i.object_id)) + '.' + QUOTENAME(OBJECT_NAME(i.object_id)) + ''') AND ix.name = ''' + i.name + ''')' + CHAR(13)+CHAR(10) +
        'BEGIN' + CHAR(13)+CHAR(10) +
        '    CREATE ' + CASE WHEN i.is_unique = 1 THEN 'UNIQUE ' ELSE '' END +
        (CASE WHEN i.type_desc = ''CLUSTERED'' THEN 'CLUSTERED INDEX ' ELSE 'NONCLUSTERED INDEX ' END) + QUOTENAME(i.name) + ' ON ' +
        QUOTENAME(@destDb) + '.' + QUOTENAME(OBJECT_SCHEMA_NAME(i.object_id)) + '.' + QUOTENAME(OBJECT_NAME(i.object_id)) + ' (' +
            STUFF((SELECT ', ' + QUOTENAME(c.name) + CASE WHEN ic.is_descending_key = 1 THEN ' DESC' ELSE ' ASC' END
                   FROM sys.index_columns ic
                   JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
                   WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id AND ic.is_included_column = 0
                   ORDER BY ic.key_ordinal
                   FOR XML PATH(''), TYPE).value('.','NVARCHAR(MAX)'),1,2,'') + ')' +
            ISNULL(' INCLUDE (' + STUFF((SELECT ', ' + QUOTENAME(c.name)
                   FROM sys.index_columns ic
                   JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
                   WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id AND ic.is_included_column = 1
                   FOR XML PATH(''), TYPE).value('.','NVARCHAR(MAX)'),1,2,'') + ')','') + ';' + CHAR(13)+CHAR(10) +
        'END'
    FROM sys.indexes i
    WHERE i.is_hypothetical = 0 AND i.name IS NOT NULL AND i.is_primary_key = 0
) w;

IF @ixSql IS NOT NULL
BEGIN
    PRINT '--- INDEX DDL GENERATED BELOW ---';
    PRINT @ixSql;
END

PRINT '--- FIN DDL GENERATOR ---';
SET NOCOUNT OFF;