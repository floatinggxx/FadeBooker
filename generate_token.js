const jwt = require('jsonwebtoken');
const token = jwt.sign(
    { id_usuario: 1, email: 'admin@fadebooker.com', rol: 'Administrador' },
    'your_jwt_secret_here', // Nota: Debería leerse del .env de producción si fuera real
    { expiresIn: '365d' }
);
console.log('Bearer ' + token);
