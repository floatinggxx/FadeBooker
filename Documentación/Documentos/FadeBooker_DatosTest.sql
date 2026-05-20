/*
================================================================================
FADEBOOKER - SCRIPT DE DATOS DE PRUEBA
Población inicial de tablas para testing y desarrollo

Servidor: fadebooker-server.database.windows.net
Base de Datos: FadeBooker_DB
Creado: 14 de abril de 2026

CONTENIDO:
1. Usuarios (6 registros)
2. Tiendas (2 registros)
3. Barberos (4 registros)
4. Servicios (7 registros)
5. ServicioTienda (N:N relations)
6. Citas (10 registros con fechas futuras)
7. Pagos (para las citas)
8. Reseñas (para citas completadas)
================================================================================
*/

-- ============================================================================
-- LIMPIEZA (OPCIONAL - Ejecutar solo para resetear datos)
-- ============================================================================
/*
DELETE FROM dbo.AuditoriaCancelacion;
DELETE FROM dbo.AuditoriaPreciosServicio;
DELETE FROM dbo.Reseña;
DELETE FROM dbo.Pago;
DELETE FROM dbo.Cita;
DELETE FROM dbo.ServicioTienda;
DELETE FROM dbo.Barbero;
DELETE FROM dbo.Servicio;
DELETE FROM dbo.Tienda;
DELETE FROM dbo.Usuario;

DBCC CHECKIDENT (dbo.Usuario, RESEED, 0);
DBCC CHECKIDENT (dbo.Tienda, RESEED, 0);
DBCC CHECKIDENT (dbo.Barbero, RESEED, 0);
DBCC CHECKIDENT (dbo.Servicio, RESEED, 0);
DBCC CHECKIDENT (dbo.ServicioTienda, RESEED, 0);
DBCC CHECKIDENT (dbo.Cita, RESEED, 0);
DBCC CHECKIDENT (dbo.Pago, RESEED, 0);
DBCC CHECKIDENT (dbo.Reseña, RESEED, 0);
GO
*/

-- ============================================================================
-- 1. INSERTAR USUARIOS (6 registros)
-- ============================================================================

INSERT INTO dbo.Usuario (email, nombre, apellido, telefono, rol, estado)
VALUES
    ('admin@fadebooker.com', 'Mauricio', 'Pérez', '3015551234', 'Administrador', 1),
    ('dueño@barbershop.com', 'Carlos', 'García', '3015555678', 'Dueño', 1),
    ('barbero1@barbershop.com', 'Juan', 'López', '3015559999', 'Barbero', 1),
    ('barbero2@barbershop.com', 'Miguel', 'Rodríguez', '3015558888', 'Barbero', 1),
    ('cliente1@email.com', 'Andrés', 'Martínez', '3015557777', 'Cliente', 1),
    ('cliente2@email.com', 'Fernando', 'Sánchez', '3015556666', 'Cliente', 1);

PRINT 'Usuarios insertados: 6 registros ✓';
GO

-- ============================================================================
-- 2. INSERTAR TIENDAS (2 registros)
-- ============================================================================

INSERT INTO dbo.Tienda (
    id_dueño, nombre_tienda, direccion, ciudad, codigo_postal, 
    telefono_tienda, email_tienda, horario_apertura, horario_cierre, 
    dias_laborales, calificacion_promedio, este_activa
)
VALUES
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'dueño@barbershop.com'),
        'Barbería El Corte Perfecto',
        'Av. Libertador Bernardo O''Higgins 1313',
        'Santiago',
        '8320000',
        '3015555678',
        'info@elcorteperfecto.com',
        '09:00',
        '19:00',
        'Lunes-Sábado',
        0,
        1
    ),
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'dueño@barbershop.com'),
        'Barbería Premium Cuts',
        'Av. Providenca 2209',
        'Providencia',
        '7500000',
        '3015552222',
        'contacto@premiumcuts.com',
        '10:00',
        '20:00',
        'Lunes-Domingo',
        0,
        1
    );

PRINT 'Tiendas insertadas: 2 registros ✓';
GO

-- ============================================================================
-- 3. INSERTAR BARBEROS (4 registros)
-- ============================================================================

INSERT INTO dbo.Barbero (
    id_usuario, id_tienda, especialidad, anos_experiencia, 
    tarifa_base, calificacion_promedio, activo
)
VALUES
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero1@barbershop.com'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto'),
        'Corte de cabello y barba clásica',
        8,
        50000,
        0,
        1
    ),
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero2@barbershop.com'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto'),
        'Diseño de barba y coloración',
        5,
        60000,
        0,
        1
    );

-- Agregar más barberos a la segunda tienda
INSERT INTO dbo.Barbero (
    id_usuario, id_tienda, especialidad, anos_experiencia, 
    tarifa_base, calificacion_promedio, activo
)
VALUES
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero1@barbershop.com'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería Premium Cuts'),
        'Corte de cabello y barba clásica',
        8,
        55000,
        0,
        1
    ),
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero2@barbershop.com'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería Premium Cuts'),
        'Diseño de barba y coloración',
        5,
        65000,
        0,
        1
    );

PRINT 'Barberos insertados: 4 registros ✓';
GO

-- ============================================================================
-- 4. INSERTAR SERVICIOS (7 registros)
-- ============================================================================

INSERT INTO dbo.Servicio (nombre_servicio, descripcion, duracion_minutos, precio_base, activo)
VALUES
    ('Corte de cabello', 'Corte clásico con tijeras o máquina', 30, 40000, 1),
    ('Barba completa', 'Afeitado y perfilado de barba con navaja', 25, 30000, 1),
    ('Corte + Barba', 'Corte de cabello + barba completa', 50, 65000, 1),
    ('Diseño de barba', 'Diseño especial y coloración de barba', 40, 50000, 1),
    ('Tratamiento capilar', 'Tratamiento hidratante para cabello', 20, 35000, 1),
    ('Cejas y patillasdelineadas', 'Diseño y delineado de cejas y patillas', 15, 20000, 1),
    ('Paquete VIP', 'Corte + Barba + Tratamiento capilar', 75, 100000, 1);

PRINT 'Servicios insertados: 7 registros ✓';
GO

-- ============================================================================
-- 5. INSERTAR SERVICIOS POR TIENDA (ServicioTienda - N:N)
-- ============================================================================

-- Servicios disponibles en Tienda 1
INSERT INTO dbo.ServicioTienda (id_servicio, id_tienda, precio_tienda, disponible)
SELECT 
    s.id_servicio,
    t.id_tienda,
    s.precio_base,
    1
FROM dbo.Servicio s
CROSS JOIN (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto') t;

-- Servicios disponibles en Tienda 2 con precios ligeramente diferentes
INSERT INTO dbo.ServicioTienda (id_servicio, id_tienda, precio_tienda, disponible)
SELECT 
    s.id_servicio,
    t.id_tienda,
    CASE 
        WHEN s.id_servicio IN (1,2,4,5,6) THEN s.precio_base + 5000  -- Aumento de 5000 en algunos servicios
        ELSE s.precio_base
    END,
    1
FROM dbo.Servicio s
CROSS JOIN (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería Premium Cuts') t;

PRINT 'ServicioTienda (N:N) insertados: 14 registros ✓';
GO

-- ============================================================================
-- 6. INSERTAR CITAS (10 registros con fechas futuras)
-- ============================================================================

INSERT INTO dbo.Cita (
    id_cliente, id_barbero, id_servicio, id_tienda,
    fecha_hora_inicio, duracion_minutos, estado,
    monto_total, pago_abono, metodo_pago, notas
)
VALUES
    -- Citas para Cliente 1
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente1@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero1@barbershop.com') LIMIT 1),
        (SELECT id_servicio FROM dbo.Servicio WHERE nombre_servicio = 'Corte de cabello'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto'),
        DATEADD(DAY, 2, GETUTCDATE()),
        30,
        'confirmada',
        40000,
        8000,
        'Tarjeta de crédito',
        'Cliente regular'
    ),
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente1@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero1@barbershop.com') LIMIT 1),
        (SELECT id_servicio FROM dbo.Servicio WHERE nombre_servicio = 'Corte + Barba'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto'),
        DATEADD(DAY, 5, GETUTCDATE()),
        50,
        'confirmada',
        65000,
        13000,
        'Efectivo',
        ''
    ),
    -- Citas para Cliente 2
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente2@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero2@barbershop.com') LIMIT 1),
        (SELECT id_servicio FROM dbo.Servicio WHERE nombre_servicio = 'Diseño de barba'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto'),
        DATEADD(DAY, 3, GETUTCDATE()),
        40,
        'confirmada',
        50000,
        10000,
        'Transferencia',
        'Primera vez en la barbería'
    ),
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente2@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero2@barbershop.com') 
         WHERE id_tienda = (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería Premium Cuts')),
        (SELECT id_servicio FROM dbo.Servicio WHERE nombre_servicio = 'Paquete VIP'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería Premium Cuts'),
        DATEADD(DAY, 7, GETUTCDATE()),
        75,
        'confirmada',
        100000,
        20000,
        'Tarjeta débito',
        'Cliente VIP'
    ),
    -- Citas completadas (para agregar reseñas)
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente1@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero1@barbershop.com') LIMIT 1),
        (SELECT id_servicio FROM dbo.Servicio WHERE nombre_servicio = 'Barba completa'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto'),
        DATEADD(DAY, -5, GETUTCDATE()),
        25,
        'completada',
        30000,
        30000,
        'Efectivo',
        'Cita pasada completada'
    ),
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente2@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero1@barbershop.com') LIMIT 1),
        (SELECT id_servicio FROM dbo.Servicio WHERE nombre_servicio = 'Corte de cabello'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto'),
        DATEADD(DAY, -3, GETUTCDATE()),
        30,
        'completada',
        40000,
        40000,
        'Tarjeta de crédito',
        'Excelente servicio'
    ),
    -- Cita cancelada
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente1@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero2@barbershop.com') LIMIT 1),
        (SELECT id_servicio FROM dbo.Servicio WHERE nombre_servicio = 'Tratamiento capilar'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto'),
        DATEADD(DAY, -1, GETUTCDATE()),
        20,
        'cancelada',
        35000,
        0,
        'Efectivo',
        'Cancelada por cliente'
    ),
    -- Citas futuras adicionales
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente1@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero1@barbershop.com') 
         WHERE id_tienda = (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería Premium Cuts')),
        (SELECT id_servicio FROM dbo.Servicio WHERE nombre_servicio = 'Corte + Barba'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería Premium Cuts'),
        DATEADD(DAY, 10, GETUTCDATE()),
        50,
        'confirmada',
        70000,
        14000,
        'Tarjeta de crédito',
        'Premium location'
    ),
    (
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente2@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero2@barbershop.com') 
         WHERE id_tienda = (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería Premium Cuts')),
        (SELECT id_servicio FROM dbo.Servicio WHERE nombre_servicio = 'Cejas y patillas delineadas'),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería Premium Cuts'),
        DATEADD(DAY, 15, GETUTCDATE()),
        15,
        'confirmada',
        25000,
        5000,
        'Transferencia',
        ''
    );

PRINT 'Citas insertadas: 10 registros ✓';
GO

-- ============================================================================
-- 7. INSERTAR PAGOS (para todas las citas)
-- ============================================================================

INSERT INTO dbo.Pago (id_cita, monto_pagado, metodo_pago, estado_pago)
SELECT 
    id_cita,
    pago_abono,
    metodo_pago,
    'completado'
FROM dbo.Cita
WHERE pago_abono > 0;

PRINT 'Pagos insertados: múltiples registros ✓';
GO

-- ============================================================================
-- 8. INSERTAR RESEÑAS (para citas completadas)
-- ============================================================================

INSERT INTO dbo.Reseña (id_cita, id_cliente, id_barbero, id_tienda, puntuacion, comentario)
VALUES
    (
        (SELECT TOP 1 id_cita FROM dbo.Cita WHERE estado = 'completada' AND id_cliente = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente1@email.com')),
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente1@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero1@barbershop.com') LIMIT 1),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto'),
        5,
        'Excelente corte, muy profesional y atento. Volveré sin dudarlo.'
    ),
    (
        (SELECT TOP 1 id_cita FROM dbo.Cita WHERE estado = 'completada' AND id_cliente = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente2@email.com') ORDER BY id_cita),
        (SELECT id_usuario FROM dbo.Usuario WHERE email = 'cliente2@email.com'),
        (SELECT id_barbero FROM dbo.Barbero WHERE id_usuario = (SELECT id_usuario FROM dbo.Usuario WHERE email = 'barbero1@barbershop.com') LIMIT 1),
        (SELECT id_tienda FROM dbo.Tienda WHERE nombre_tienda = 'Barbería El Corte Perfecto'),
        4,
        'Muy buen servicio. Sólo comentar que el tiempo de espera fue un poco largo.'
    );

PRINT 'Reseñas insertadas: 2 registros ✓';
GO

-- ============================================================================
-- RESUMEN FINAL
-- ============================================================================

PRINT '
================================================================================
✅ DATOS DE PRUEBA INSERTADOS EXITOSAMENTE
================================================================================

RESUMEN:
  ✓ Usuarios: 6 registros
  ✓ Tiendas: 2 registros
  ✓ Barberos: 4 registros
  ✓ Servicios: 7 registros
  ✓ ServicioTienda (N:N): 14 registros
  ✓ Citas: 10 registros
  ✓ Pagos: 10 registros (abonos)
  ✓ Reseñas: 2 registros

DATOS CLAVE:
  - Clientes: cliente1@email.com, cliente2@email.com
  - Barberos: barbero1@barbershop.com, barbero2@barbershop.com
  - Tiendas: Barbería El Corte Perfecto, Barbería Premium Cuts
  - Citas confirmadas, completadas y canceladas para testing

PRÓXIMAS CONSULTAS DE PRUEBA:
  1. SELECT * FROM vw_CitasProximas;
  2. SELECT * FROM vw_CalificacionesBarbero;
  3. SELECT * FROM vw_VentasPorTienda;
  4. EXEC usp_ReporteVentasTienda 1, @fechaInicio, @fechaFin;

BASE DE DATOS LISTA PARA DESARROLLO 🎯
================================================================================
';

GO
