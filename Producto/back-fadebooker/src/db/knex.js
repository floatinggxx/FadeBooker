const knex = require('knex')
const config = require('../config/knexfile')

const environment = process.env.NODE_ENV || 'development'
console.log(`🔧 Inicializando Knex para el entorno: ${environment}`);

const db = knex(config[environment] || config.development)

// Verificar conectividad básica en la siguiente vuelta del event loop.
// Esto evita que la prueba de conexión bloquee el require() y permite que la app arranque rápidamente.
process.nextTick(() => {
  db.raw('SELECT 1')
    .then(() => console.log('✅ Conexión a la base de datos verificada (Azure SQL)'))
    .catch(err => {
      console.error('❌ Error de conexión a la base de datos en el arranque:');
      console.error(err.message || err);
      // No salimos con proceso 1 para permitir que la app inicie y muestre errores en los endpoints
    })
})

module.exports = db