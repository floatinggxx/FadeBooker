const express = require('express')
const router = express.Router()
const CitaControllerClass = require('../controllers/cita.controller')
const validateRequest = require('../middlewares/validateRequest')
const optionalAuthMiddleware = require('../middlewares/optionalAuth.middleware')
const { citaSchema, actualizarEstadoSchema } = require('../../../infraestructure/schemas/cita.schema')

const citaController = new CitaControllerClass();

router.post('/', validateRequest({ body: citaSchema }), citaController.crear)
router.get('/', optionalAuthMiddleware, citaController.listar)
router.get('/disponibilidad', citaController.checkDisponibilidad)
router.get('/:id', citaController.obtenerPorId)
router.post('/:id/pago-efectivo', citaController.registrarPagoEfectivo)
router.post('/:id/resena', citaController.crearResena)
router.post('/:id/cancelar', citaController.cancelar)
// Ruta de administración/QA: forzar estado confirmada
router.post('/:id/forzar-confirmada', citaController.forzarConfirmada)
router.put('/:id/estado', validateRequest({ body: actualizarEstadoSchema }), citaController.cambiarEstado)
router.delete('/:id', citaController.eliminar)

module.exports = router
