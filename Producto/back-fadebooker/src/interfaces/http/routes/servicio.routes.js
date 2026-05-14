const express = require('express')
const router = express.Router()
const ServicioController = require('../controllers/servicio.controller')
const validateRequest = require('../middlewares/validateRequest')
const { ServicioSchema } = require('../validations/servicioBarbero.validation')

router.post('/', validateRequest({ body: ServicioSchema }), ServicioController.crear)
router.get('/', ServicioController.obtenerTodos)
router.get('/buscar', ServicioController.buscarPorNombre)
router.get('/barbero/:id_barbero', ServicioController.obtenerPorBarbero)
router.get('/:id', ServicioController.obtenerPorId)
router.put('/:id', validateRequest({ body: ServicioSchema.partial() }), ServicioController.actualizar)
router.delete('/:id', ServicioController.eliminar)

module.exports = router