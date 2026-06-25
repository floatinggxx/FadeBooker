const JwtTokenManager = require('../../../infraestructure/security/JwtTokenManager');
const tokenManager = new JwtTokenManager();

/**
 * Middleware para autenticar usuarios mediante JWT (opcional).
 * Si el token es válido, se agrega a req.user.
 * Si no hay token o es inválido, continúa sin error.
 */
const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Sin token, continuar sin error
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = tokenManager.verify(token);
        if (decoded) {
            req.user = decoded;
        }
    } catch (error) {
        // Token inválido, pero continuamos sin error (middleware opcional)
    }

    next();
};

module.exports = optionalAuthMiddleware;
