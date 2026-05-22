require('dotenv').config();
const CitaRepository = require('./src/infraestructure/database/CitaRepositoryImpl');
const ServicioRepository = require('./src/infraestructure/database/ServicioRepositoryImpl');
const UsuarioRepository = require('./src/infraestructure/database/UsuarioRepositoryImpl');
const CitaService = require('./src/application/usecases/cita.service');

const citaRepository = new CitaRepository();
const servicioRepository = new ServicioRepository();
const usuarioRepository = new UsuarioRepository();
const citaService = new CitaService(citaRepository, servicioRepository, usuarioRepository);

async function runTest() {
  try {
    const testData = {
      id_cliente: 43, // ma.tapia.ay@gmail.com
      id_barbero: 17, // Roberto
      id_servicio: 1, // Corte Clásico
      id_tienda: 8,
      fecha_hora_inicio: '2026-05-30 10:00:00', // Una fecha futura
      duracion_minutos: 40,
      monto_total: 12000,
      pago_abono: 0,
      metodo_pago: 'Test Automate',
      notas: 'Re-Prueba de flujo Power Automate - ' + new Date().toLocaleString()
    };

    console.log('--- Iniciando Prueba de Power Automate ---');
    console.log('Email objetivo: ma.tapia.ay@gmail.com');
    
    // El servicio llamará automáticamente a enviarReservaPowerAutomate
    const result = await citaService.crearCita(testData);
    
    console.log('✅ Cita creada con ID:', result.id_cita);
    console.log('Detalle de respuesta:', JSON.stringify(result, null, 2));
    console.log('--- El flujo de Power Automate debería haberse disparado ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

runTest();
