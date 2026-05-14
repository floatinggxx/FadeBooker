const JwtTokenManager = require('../../../infraestructure/security/JwtTokenManager');
const tokenManager = new JwtTokenManager();

/**
 * Middleware para autenticar usuarios mediante JWT.
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = tokenManager.verify(token);
        if (!decoded) {
            throw new Error('Token inválido');
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;
