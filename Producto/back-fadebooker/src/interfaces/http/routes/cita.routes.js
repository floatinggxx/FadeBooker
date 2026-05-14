const express = require('express')
const router = express.Router()
const CitaController = require('../controllers/cita.controller')
const validateRequest = require('../middlewares/validateRequest')
const { citaSchema, actualizarEstadoSchema } = require('../../../infraestructure/schemas/cita.schema')

router.post('/', validateRequest({ body: citaSchema }), CitaController.crear)
router.get('/disponibilidad', CitaController.checkDisponibilidad)
router.get('/:id', CitaController.obtenerPorId)
router.put('/:id/estado', validateRequest({ body: actualizarEstadoSchema }), CitaController.cambiarEstado)
router.delete('/:id', CitaController.eliminar)

module.exports = router