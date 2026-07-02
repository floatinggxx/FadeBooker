const express = require('express')
const router = express.Router()
const LocationController = require('../controllers/location.controller')

router.get('/regions', LocationController.listRegions)
router.get('/comunas', LocationController.listComunas)

module.exports = router
