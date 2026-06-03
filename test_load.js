try {
  console.log('--- Iniciando prueba de carga de módulos ---');
  console.log('Entorno:', process.env.NODE_ENV);
  console.log('Cargando ./src/app.js...');
  const app = require('./src/app.js');
  console.log('✅ Cobertura de ./src/app.js exitosa');
  
  console.log('Cargando ./src/index.js...');
  // No llamamos a listen aquí para no bloquear
  const index = require('./src/index.js');
  console.log('✅ Cobertura de ./src/index.js exitosa');
  
  process.exit(0);
} catch (error) {
  console.error('❌ ERROR FATAL DURANTE LA CARGA:');
  console.error(error);
  process.exit(1);
}
