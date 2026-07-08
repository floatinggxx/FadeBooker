-- Migration: Set all services to 60 minutes and upsert canonical 16 services
BEGIN TRANSACTION;

-- 1) Ensure Servicio base duration column exists and set to 60 minutes for all
UPDATE dbo.Servicio
SET duracion_minutos = 60
WHERE duracion_minutos IS NULL OR duracion_minutos <> 60;

-- 2) Ensure ServicioBarbero entries use 60 minutes as tiempo_servicio_minutos
UPDATE dbo.ServicioBarbero
SET tiempo_servicio_minutos = 60
WHERE tiempo_servicio_minutos IS NULL OR tiempo_servicio_minutos <> 60;

-- 3) Upsert canonical list of 16 services (identify by nombre)
-- For each service: if exists, update precio_base and descripcion; else insert

IF OBJECT_ID('tempdb..#services') IS NOT NULL DROP TABLE #services;
CREATE TABLE #services (nombre_servicio NVARCHAR(200), descripcion NVARCHAR(MAX), precio_base INT);

INSERT INTO #services (nombre_servicio, descripcion, precio_base) VALUES
('Corte de Cabello Clásico', 'Corte tradicional con tijera y/o máquina. Incluye ajuste de contornos.', 12000),
('Corte con Degradado (Fade)', 'Corte con degradado/efecto fade, trabajado en máquina y tijera.', 14000),
('Corte de Cabello + Barba', 'Combo: corte de cabello más arreglo de barba básico.', 22000),
('Corte + Barba + Cejas', 'Servicio completo: corte, arreglo de barba y perfilado de cejas.', 28000),
('Perfilado y Arreglo de Barba', 'Perfilado fino y arreglo de barba con herramientas y toallas.', 10000),
('Afeitado Clásico con Navaja', 'Afeitado tradicional con navaja y productos de cuidado.', 14000),
('Afeitado + Toallas Calientes + Masaje', 'Afeitado clásico complementado con toallas calientes y masaje relajante.', 18000),
('Diseño y Perfilado de Cejas', 'Perfilado y diseño de cejas masculino.', 5000),
('Coloración de Barba', 'Aplicación de color para barba según preferencia.', 12000),
('Coloración o Decoloración Capilar', 'Coloración o decoloración profesional del cabello.', 30000),
('Limpieza Facial Profunda', 'Limpieza facial profesional adaptada para piel masculina.', 12000),
('Masaje Capilar', 'Masaje en cuero cabelludo para relajación y estimulación.', 8000),
('Tratamiento Hidratante Capilar', 'Tratamiento para hidratar y reparar el cabello.', 15000),
('Peeling Capilar', 'Exfoliación suave de cuero cabelludo para remover impurezas.', 12000),
('Experiencia Premium', 'Corte + barba + cejas + masaje + limpieza facial. Experiencia completa.', 50000),
('Otro', 'Describe aquí en detalle en qué consiste el servicio "Otro".', 0);

-- Upsert logic: update existing by nombre, insert missing
DECLARE @nombre NVARCHAR(200), @descripcion NVARCHAR(MAX), @precio INT;
DECLARE svc_cursor CURSOR FOR SELECT nombre_servicio, descripcion, precio_base FROM #services;
OPEN svc_cursor;
FETCH NEXT FROM svc_cursor INTO @nombre, @descripcion, @precio;
WHILE @@FETCH_STATUS = 0
BEGIN
    IF EXISTS (SELECT 1 FROM dbo.Servicio WHERE nombre_servicio = @nombre)
    BEGIN
        UPDATE dbo.Servicio SET descripcion = @descripcion, precio_base = @precio, duracion_minutos = 60
        WHERE nombre_servicio = @nombre;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.Servicio (nombre_servicio, descripcion, precio_base, duracion_minutos)
        VALUES (@nombre, @descripcion, @precio, 60);
    END

    FETCH NEXT FROM svc_cursor INTO @nombre, @descripcion, @precio;
END
CLOSE svc_cursor;
DEALLOCATE svc_cursor;

DROP TABLE #services;

COMMIT TRANSACTION;

PRINT 'Migration 20260701_SetServiciosOneHourAndSeed16 applied: set durations to 60 and upserted canonical 16 services.';
