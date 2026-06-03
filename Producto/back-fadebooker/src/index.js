/**
 * Punto de entrada de la aplicación FadeBooker
 * Inicia el servidor Express
 */

console.log('🚀 [STARTUP] Iniciando FadeBooker Backend...');
console.log(`🕒 [STARTUP] Timestamp: ${new Date().toISOString()}`);

// Capturar errores no manejados de forma agresiva
process.on('uncaughtException', (err) => {
  console.error('💥 FATAL: Uncaught Exception:', err.message);
  console.error(err.stack);
  setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 FATAL: Unhandled Rejection at:', promise, 'reason:', reason);
  setTimeout(() => process.exit(1), 1000);
});

try {
  console.log('🛠️ [STARTUP] Cargando aplicación (app.js)...');
  const app = require('./app')
  const port = process.env.PORT || process.env.WEBSITES_PORT || 3000

  console.log(`🛠️ [STARTUP] Intentando escuchar en puerto: ${port}`);
  console.log(`🛠️ [STARTUP] DB_SERVER configurado: ${process.env.DB_SERVER ? 'SÍ' : 'NO'}`);

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`✅✅✅ [SUCCESS] SERVIDOR CORRIENDO EN PUERTO ${port} ✅✅✅`);
  })

  server.on('error', (e) => {
    console.error('💥 [ERROR] Error en el servidor HTTP:', e);
    setTimeout(() => process.exit(1), 1000);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📌 SIGTERM señal recibida, cerrando servidor gracefully')
    server.close(() => {
      console.log('✅ Servidor HTTP cerrado')
      process.exit(0)
    })
  })

  module.exports = server
} catch (error) {
  console.error('❌❌❌ [ERROR FATAL] Error durante el arranque:');
  console.error(error);
  setTimeout(() => process.exit(1), 1000);
}

