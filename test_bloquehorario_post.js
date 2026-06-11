#!/usr/bin/env node
const http = require('http');
const jwt = require('jsonwebtoken');

// Generar token válido en tiempo de ejecución
const token = jwt.sign(
  { id_usuario: 5, email: 'barbero@test.local', rol: 'Barbero', id_barbero: 5 },
  'secret_key_temporal',
  { expiresIn: '1h' }
);

console.log('✅ Token JWT generado:', token);
console.log('\n🔄 Enviando POST a http://localhost:3000/api/bloques/5...\n');

const payload = JSON.stringify({
  id_barbero: 5,
  fecha_hora_inicio: '2026-06-11T10:00:00',
  fecha_hora_fin: '2026-06-11T10:30:00',
  motivo: 'Almuerzo'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/bloques/5',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
    console.log(`Body:\n${data}\n`);

    if (res.statusCode === 201) {
      console.log('✅ Bloque creado exitosamente!');
    } else {
      console.log('❌ Error al crear bloque. Revisa el mensaje arriba.');
    }

    process.exit(res.statusCode === 201 ? 0 : 1);
  });
});

req.on('error', (error) => {
  console.error('Error al hacer la solicitud:', error.message);
  process.exit(1);
});

req.write(payload);
req.end();
