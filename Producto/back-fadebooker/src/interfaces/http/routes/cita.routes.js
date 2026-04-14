const express = require('express')
const router = express.Router()
const CitaController = require('../controllers/cita.controller')

router.post('/', CitaController.crear)
router.put('/:id/estado', CitaController.cambiarEstado)

module.exports = router