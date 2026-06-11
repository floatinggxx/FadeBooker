const express = require('express')
const router = express.Router()
const SubscriptionController = require('../controllers/subscription.controller')

router.post('/', SubscriptionController.createSubscription)
router.post('/:id/cancel', SubscriptionController.cancelSubscription)
router.get('/provider/:provider_id', SubscriptionController.listByProvider)

module.exports = router
