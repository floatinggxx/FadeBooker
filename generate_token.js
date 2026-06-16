const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_should_be_changed';
const token = jwt.sign(
    { id_usuario: 1, email: 'admin@fadebooker.com', rol: 'Administrador' },
    jwtSecret,
    { expiresIn: '365d' }
);
console.log('Bearer ' + token);
