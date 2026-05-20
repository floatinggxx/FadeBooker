const express = require('express')
const router = express.Router()
const TiendaController = require('../controllers/tienda.controller')

// Endpoints para Tiendas
router.get('/', TiendaController.obtenerTodas)
router.get('/:id', TiendaController.obtenerPorId)
router.get('/:id/barberos', TiendaController.obtenerBarberos)
router.get('/ciudad/:ciudad', TiendaController.buscarPorCiudad)
router.post('/', TiendaController.crear)
router.put('/:id', TiendaController.actualizar)
router.delete('/:id', TiendaController.eliminar)

module.exports = router
