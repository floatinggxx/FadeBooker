const knex = require('knex')
const config = require('../config/knexfile')

const environment = process.env.NODE_ENV || 'development'
console.log(`🔧 Inicializando Knex para el entorno: ${environment}`);

let db

// En entorno de test usaremos sqlite en memoria (si está configurado en knexfile)
if (environment === 'test') {
  db = knex(config.test || config.development)
  console.log('🔧 Knex configurado en modo TEST: usando DB de pruebas (sqlite in-memory o configuración test)');
} else {
  db = knex(config[environment] || config.development)

  // Verificar conectividad básica en la siguiente vuelta del event loop.
  // Evitar que la prueba de conexión bloquee el require() y permitir que la app arranque rápidamente.
  process.nextTick(() => {
    db.raw('SELECT 1')
      .then(() => console.log('✅ Conexión a la base de datos verificada'))
      .catch(err => {
        console.error('❌ Error de conexión a la base de datos en el arranque:');
        console.error(err.message || err);
        // No salimos con proceso 1 para permitir que la app arranque y los tests puedan mockear la BD
      })
  })
}

module.exports = db