/*
================================================================================
MIGRACIÓN: 2026-06-03 - Arreglar dueños y barberos por tienda + precios en CLP
================================================================================
Objetivo:
- Garantizar que cada tienda tenga un dueño válido.
- Garantizar que cada tienda tenga al menos un barbero activo.
- Normalizar los precios de servicios base en pesos chilenos.
- Asegurar que los barberos activos tengan relación con ServicioBarbero.

Notas:
- Si una tienda ya tiene más de un barbero activo, se desactivan los barberos adicionales.
- Si una tienda no tiene barbero activo, se crea un barbero placeholder.
- Si una tienda tiene dueño inexistente o dueño con rol incorrecto, se corrige.
================================================================================
*/

BEGIN TRY
    BEGIN TRANSACTION;

    -- 1) Corregir dueños de tienda: roles y dueños faltantes
    UPDATE dbo.Usuario
    SET rol = 'Dueño'
    WHERE id_usuario IN (SELECT id_dueño FROM dbo.Tienda WHERE id_dueño IS NOT NULL)
      AND rol <> 'Dueño';

    INSERT INTO dbo.Usuario (email, contrasena, nombre, apellido, telefono, rol, estado)
    SELECT
        CONCAT('dueno_tienda_', t.id_tienda, '@fadebooker.com'),
        '$2b$10$1QJ5ETKven4e5WSEHhthK.bTRpcwLlfjYCLGRL0cRK/.og0RpZAlC',
        'Dueño',
        CONCAT('Dueño ', t.id_tienda),
        '000000000',
        'Dueño',
        1
    FROM dbo.Tienda t
    LEFT JOIN dbo.Usuario u ON u.id_usuario = t.id_dueño
    WHERE t.id_dueño IS NULL OR u.id_usuario IS NULL;

    UPDATE t
    SET id_dueño = u.id_usuario
    FROM dbo.Tienda t
    JOIN dbo.Usuario u ON u.email = CONCAT('dueno_tienda_', t.id_tienda, '@fadebooker.com')
    WHERE t.id_dueño IS NULL OR NOT EXISTS (SELECT 1 FROM dbo.Usuario uu WHERE uu.id_usuario = t.id_dueño);

    -- 2) Garantizar un solo barbero activo por tienda
    WITH BarberoActivo AS (
        SELECT id_barbero,
               id_tienda,
               ROW_NUMBER() OVER (PARTITION BY id_tienda ORDER BY id_barbero ASC) AS rn
        FROM dbo.Barbero
        WHERE activo = 1
    )
    UPDATE b
    SET activo = 0
    FROM dbo.Barbero b
    JOIN BarberoActivo ba ON ba.id_barbero = b.id_barbero
    WHERE ba.rn > 1;

    -- 3) Crear barbero para tiendas sin barbero activo
    INSERT INTO dbo.Usuario (email, contrasena, nombre, apellido, telefono, rol, estado)
    SELECT
        CONCAT('barbero_tienda_', t.id_tienda, '@fadebooker.com'),
        '$2b$10$1QJ5ETKven4e5WSEHhthK.bTRpcwLlfjYCLGRL0cRK/.og0RpZAlC',
        'Barbero',
        CONCAT('Barbero ', t.id_tienda),
        '000000000',
        'Barbero',
        1
    FROM dbo.Tienda t
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.Barbero b WHERE b.id_tienda = t.id_tienda AND b.activo = 1
    )
      AND NOT EXISTS (
        SELECT 1 FROM dbo.Usuario u WHERE u.email = CONCAT('barbero_tienda_', t.id_tienda, '@fadebooker.com')
    );

    INSERT INTO dbo.Barbero (id_usuario, id_tienda, especialidad, anos_experiencia, tarifa_base, calificacion_promedio, activo)
    SELECT
        u.id_usuario,
        t.id_tienda,
        'Servicio general',
        3,
        25000,
        0,
        1
    FROM dbo.Tienda t
    JOIN dbo.Usuario u ON u.email = CONCAT('barbero_tienda_', t.id_tienda, '@fadebooker.com')
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.Barbero b WHERE b.id_tienda = t.id_tienda AND b.activo = 1
    );

    -- 4) Normalizar precios base de servicios en pesos chilenos
    UPDATE dbo.Servicio
    SET precio_base = CASE nombre_servicio
        WHEN 'Corte de cabello' THEN 32000
        WHEN 'Barba completa' THEN 25000
        WHEN 'Corte + Barba' THEN 55000
        WHEN 'Diseño de barba' THEN 45000
        WHEN 'Tratamiento capilar' THEN 30000
        WHEN 'Cejas y patillasdelineadas' THEN 22000
        WHEN 'Cejas y patillas delineadas' THEN 22000
        WHEN 'Paquete VIP' THEN 95000
        ELSE precio_base
    END
    WHERE nombre_servicio IN (
        'Corte de cabello',
        'Barba completa',
        'Corte + Barba',
        'Diseño de barba',
        'Tratamiento capilar',
        'Cejas y patillasdelineadas',
        'Cejas y patillas delineadas',
        'Paquete VIP'
    );

    -- 5) Asegurar relación ServicioBarbero para todos los barberos activos
    INSERT INTO dbo.ServicioBarbero (id_servicio, id_barbero, precio_barbero, tiempo_servicio_minutos, disponible)
    SELECT
        s.id_servicio,
        b.id_barbero,
        s.precio_base,
        NULL,
        1
    FROM dbo.Servicio s
    CROSS JOIN dbo.Barbero b
    WHERE b.activo = 1
      AND NOT EXISTS (
          SELECT 1 FROM dbo.ServicioBarbero sb
          WHERE sb.id_servicio = s.id_servicio
            AND sb.id_barbero = b.id_barbero
      );

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    THROW;
END CATCH;
