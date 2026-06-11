const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/webhook.controller');

// Telegram webhook receives updates
router.post('/telegram', WebhookController.telegram);

module.exports = router;
