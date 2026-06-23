const axios = require('axios');

async function run() {
  try {
    const base = 'http://localhost:3000/api/usuarios';
    const registerData = {
      nombre: 'ProveedorAuto',
      apellido: 'Demo',
      email: `proveedor.auto.${Date.now()}@example.local`,
      telefono: '+56 9 4444 3333',
      rol: 'Proveedor',
      contrasena: 'password123'
    };

    console.log('Registering user:', registerData.email);
    const reg = await axios.post(`${base}/register`, registerData, { timeout: 10000 });
    console.log('Register response:', JSON.stringify(reg.data, null, 2));

    // Try login
    const login = await axios.post(`${base}/login`, { email: registerData.email, contrasena: registerData.contrasena }, { timeout: 10000 });
    console.log('Login response:', JSON.stringify(login.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('API error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
    process.exitCode = 1;
  }
}

run();
