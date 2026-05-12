const LogRecord = require('../../../domain/entities/LogRecord')
const LogRepositoryImpl = require('../../../infraestructure/database/LogRepositoryImpl')

const logRepository = new LogRepositoryImpl()

/**
 * 🛡️ FadeBooker - Middleware de Manejo de Errores Global
 * Garantiza que cualquier error en la aplicación sea capturado y devuelto
 * en un formato JSON consistente para Power Apps y React.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.message)

  // Inyectar el log de error en la BD de forma asíncrona
  const logRecord = new LogRecord({
    mensaje: err.message,
    stack_trace: err.stack,
    usuario_id: req.user ? req.user.id : null,
    endpoint: req.originalUrl || req.url,
    metodo_http: req.method,
    nivel: 'Error'
  })

  // Se dispara sin esperar el await para no bloquear la respuesta al usuario
  logRepository.save(logRecord).catch(e => {
    console.error('Fallo al registrar log de error:', e.message)
  })

  // Mapeo selectivo de errores comunes
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message || 'Error interno del servidor'

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
