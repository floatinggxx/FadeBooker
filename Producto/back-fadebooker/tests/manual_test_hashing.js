/**
 * 🧪 Script de Prueba Manual: Encriptación de Contraseñas (Hashing)
 * 
 * Este script demuestra cómo FadeBooker procesa las contraseñas antes de guardarlas
 * en la base de datos usando la librería 'bcryptjs'.
 * 
 * Basado en la lógica de: Producto/back-fadebooker/src/application/usecases/usuario.service.js
 */

const bcrypt = require('bcryptjs');

async function testHashing() {
    const passwordPlana = 'FadeBooker2026!'; // Ejemplo de contraseña del usuario
    
    console.log('--- 🛡️ INICIO DE PRUEBA DE HASHING ---');
    console.log(`1. Contraseña original (Plana): "${passwordPlana}"`);

    // El proceso de hashing tiene 2 pasos principales:
    
    // PASO A: Generar un "Salt" (Sal)
    // El salt es una cadena aleatoria que se añade para evitar ataques de tablas arcoíris.
    const salt = await bcrypt.genSalt(10);
    console.log(`2. Salt generado (Factor de costo 10): ${salt}`);

    // PASO B: Generar el Hash
    // Se combina la contraseña con el salt para crear la cadena encriptada final.
    const hashGenerado = await bcrypt.hash(passwordPlana, salt);
    
    console.log('--------------------------------------');
    console.log('✅ RESULTADO FINAL (Lo que se guarda en la BD):');
    console.log(hashGenerado);
    console.log('--------------------------------------');

    // TEST DE VERIFICACIÓN
    // bcrypt permite verificar si una contraseña plana coincide con un hash sin necesidad de "desencriptarlo"
    const esValida = await bcrypt.compare(passwordPlana, hashGenerado);
    const esInvalida = await bcrypt.compare('otra_password', hashGenerado);

    console.log(`3. Verificación de contraseña correcta: ${esValida ? '✅ ÉXITO' : '❌ FALLO'}`);
    console.log(`4. Verificación de contraseña incorrecta: ${esInvalida ? '❌ NO COINCIDE' : '✅ ÉXITO (Rechazada correctamente)'}`);
    
    console.log('\n💡 NOTA PEDAGÓGICA:');
    console.log('Nunca guardes la contraseña plana. El hash es una función de un solo sentido.');
    console.log('Si un atacante roba la base de datos, solo verá el hash y no sabrá tu contraseña real.');
    console.log('--- 🏁 FIN DE LA PRUEBA ---');
}

// Ejecutar la prueba
testHashing().catch(err => {
    console.error('❌ Error durante la prueba:', err);
});
