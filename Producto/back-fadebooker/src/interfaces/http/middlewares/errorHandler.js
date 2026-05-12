/**
 * 🛡️ FadeBooker - Middleware de Manejo de Errores Global
 * Garantiza que cualquier error en la aplicación sea capturado y devuelto
 * en un formato JSON consistente para Power Apps y React.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.message);

  // Mapeo selectivo de errores comunes
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Error interno del servidor';

  // Si es un error de Knex/BD (Adaptador de infraestructura)
  if (err.code && (err.code.startsWith('EREQUEST') || err.code.startsWith('ETIMEOUT'))) {
    statusCode = 503;
    message = 'El servicio de base de datos no está disponible temporalmente.';
  }

  // Respuesta estandarizada
  res.status(statusCode).json({
    error: true,
    statusCode,
    message,
    path: req.url,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
