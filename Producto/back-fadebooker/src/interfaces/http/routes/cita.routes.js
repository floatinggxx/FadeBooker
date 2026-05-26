const express = require('express')
const router = express.Router()
const CitaControllerClass = require('../controllers/cita.controller')
const validateRequest = require('../middlewares/validateRequest')
const { citaSchema, actualizarEstadoSchema } = require('../../../infraestructure/schemas/cita.schema')

const citaController = new CitaControllerClass();

router.post('/', validateRequest({ body: citaSchema }), citaController.crear)
router.get('/', citaController.listar)
router.get('/disponibilidad', citaController.checkDisponibilidad)
router.get('/:id', citaController.obtenerPorId)
router.post('/:id/pago-efectivo', citaController.registrarPagoEfectivo)
router.post('/:id/resena', citaController.crearResena)
router.put('/:id/estado', validateRequest({ body: actualizarEstadoSchema }), citaController.cambiarEstado)
router.delete('/:id', citaController.eliminar)

module.exports = router
