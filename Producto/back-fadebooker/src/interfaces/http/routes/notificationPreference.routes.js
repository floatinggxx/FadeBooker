const express = require('express');
const router = express.Router();
const NotificationPreferenceController = require('../controllers/notificationPreference.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest');
const { notificationPreferencesSchema } = require('../../../infraestructure/schemas/notificationPreference.schema');

router.get('/', authMiddleware, NotificationPreferenceController.getPreferences);
router.put('/', authMiddleware, validateRequest({ body: notificationPreferencesSchema }), NotificationPreferenceController.updatePreferences);

module.exports = router;
