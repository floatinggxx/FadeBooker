/*
  Consulta: listar todos los barberos de tiendas específicas
  Tiendas objetivo: 'Barbería El Corte Perfecto', 'Studio Danger', 'Barbería Premium Cuts'
  Resultado: para cada barbero muestra datos de Usuario, Barbero, servicios (disponibles), cantidad de citas y reseñas.
  No modifica datos — solo SELECT.
*/

SET NOCOUNT ON;

DECLARE @Tiendas TABLE (nombre NVARCHAR(200));
INSERT INTO @Tiendas (nombre) VALUES
  ('Barbería El Corte Perfecto'),
  ('Studio Danger'),
  ('Barbería Premium Cuts');

SELECT
  t.id_tienda,
  t.nombre_tienda,
  b.id_barbero,
  b.id_usuario,
  u.email,
  u.nombre AS usuario_nombre,
  u.apellido AS usuario_apellido,
  u.telefono,
  b.activo AS barbero_activo,
  b.especialidad,
  b.anos_experiencia,
  b.tarifa_base,
  -- Servicios disponibles (lista separada por ',')
  ISNULL(sv.servicios, '') AS servicios_disponibles,
  ISNULL(sv.cnt_servicios, 0) AS cantidad_servicios_disponibles,
  -- Conteos de dependencias
  ISNULL(c.cnt_citas, 0) AS cantidad_citas,
  ISNULL(r.cnt_resenas, 0) AS cantidad_resenas,
  b.createdAt,
  b.updatedAt
FROM dbo.Tienda t
JOIN @Tiendas tt ON tt.nombre = t.nombre_tienda
JOIN dbo.Barbero b ON b.id_tienda = t.id_tienda
LEFT JOIN dbo.Usuario u ON u.id_usuario = b.id_usuario
LEFT JOIN (
  SELECT sb.id_barbero,
    STRING_AGG(CONCAT(s.id_servicio,':',s.nombre_servicio), '; ') WITHIN GROUP (ORDER BY s.nombre_servicio) AS servicios,
    COUNT(*) AS cnt_servicios
  FROM dbo.ServicioBarbero sb
  JOIN dbo.Servicio s ON s.id_servicio = sb.id_servicio
  WHERE sb.disponible = 1
  GROUP BY sb.id_barbero
) sv ON sv.id_barbero = b.id_barbero
LEFT JOIN (
  SELECT id_barbero, COUNT(*) AS cnt_citas
  FROM dbo.Cita
  GROUP BY id_barbero
) c ON c.id_barbero = b.id_barbero
LEFT JOIN (
  SELECT id_barbero, COUNT(*) AS cnt_resenas
  FROM dbo.Reseña
  GROUP BY id_barbero
) r ON r.id_barbero = b.id_barbero
ORDER BY t.nombre_tienda, u.nombre, u.apellido;

-- Resumen por tienda
SELECT
  t.id_tienda,
  t.nombre_tienda,
  COUNT(b.id_barbero) AS total_barberos,
  SUM(CASE WHEN b.activo = 1 THEN 1 ELSE 0 END) AS activos,
  SUM(CASE WHEN b.activo = 0 THEN 1 ELSE 0 END) AS inactivos,
  SUM(CASE WHEN sv.cnt_servicios > 0 THEN 1 ELSE 0 END) AS con_servicios_disponibles
FROM dbo.Tienda t
JOIN @Tiendas tt ON tt.nombre = t.nombre_tienda
JOIN dbo.Barbero b ON b.id_tienda = t.id_tienda
LEFT JOIN (
  SELECT id_barbero, COUNT(*) AS cnt_servicios
  FROM dbo.ServicioBarbero
  WHERE disponible = 1
  GROUP BY id_barbero
) sv ON sv.id_barbero = b.id_barbero
GROUP BY t.id_tienda, t.nombre_tienda
ORDER BY t.nombre_tienda;

SET NOCOUNT OFF;
