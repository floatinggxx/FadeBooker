/**
 * Punto de entrada de la aplicación FadeBooker
 * Inicia el servidor Express
 */

const app = require('./app')

const port = process.env.PORT || 3000

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en el puerto ${port}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📌 SIGTERM señal recibida, cerrando servidor gracefully')
  server.close(() => {
    console.log('✅ Servidor HTTP cerrado')
    process.exit(0)
  })
})

module.exports = server
