const express = require('express');
const router = express.Router();
const PhoneVerificationController = require('../controllers/phoneVerification.controller');
const validateRequest = require('../middlewares/validateRequest');
const authMiddleware = require('../middlewares/auth.middleware');
const rateLimiter = require('../middlewares/rateLimiter.middleware');

// Iniciar flujo (app envía phone)
// Aplicar rate limiter por IP y por phone para evitar abusos
router.post('/telelink',
	rateLimiter({ windowMs: 5 * 60 * 1000, max: 5, keyPrefix: 'ip' }),
	rateLimiter({ windowMs: 5 * 60 * 1000, max: 3, keyPrefix: 'phone' }),
	validateRequest({ body: require('../../../infraestructure/schemas/phoneVerification.schema').telelinkSchema }),
	PhoneVerificationController.telelink
);
// Verificar PIN
router.post('/televerify', validateRequest({ body: require('../../../infraestructure/schemas/phoneVerification.schema').televerifySchema }), PhoneVerificationController.televerify);

module.exports = router;
