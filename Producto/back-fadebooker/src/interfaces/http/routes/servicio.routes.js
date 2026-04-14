const express = require('express')
const router = express.Router()
const ServicioController = require('../controllers/servicio.controller')

router.post('/', ServicioController.crear)
router.get('/', ServicioController.obtenerTodos)
router.get('/buscar', ServicioController.buscarPorNombre)
router.get('/tienda/:id_tienda', ServicioController.obtenerPorTienda)
router.get('/:id', ServicioController.obtenerPorId)
router.put('/:id', ServicioController.actualizar)
router.delete('/:id', ServicioController.eliminar)

module.exports = router