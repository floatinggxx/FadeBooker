const express = require('express')
const router = express.Router()
const CitaController = require('../controllers/cita.controller')

router.post('/', CitaController.crear)
router.get('/:id', CitaController.obtenerPorId)
router.put('/:id/estado', CitaController.cambiarEstado)
router.delete('/:id', CitaController.eliminar)

module.exports = router