const express = require('express')
const router = express.Router()
const TiendaController = require('../controllers/tienda.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// Endpoints para Tiendas
router.get('/', TiendaController.obtenerTodas)
router.get('/:id', TiendaController.obtenerPorId)
router.get('/:id/barberos', TiendaController.obtenerBarberos)
router.get('/:id/resenas', TiendaController.obtenerResenas)
router.get('/comuna/:comuna', TiendaController.buscarPorComuna)
router.get('/region/:region', TiendaController.buscarPorRegion)
router.post('/', TiendaController.crear)
router.put('/:id', TiendaController.actualizar)
router.delete('/:id', TiendaController.eliminar)

// Nuevos endpoints de carga de imágenes
router.post('/:id/foto', authMiddleware, TiendaController.actualizarFoto)
router.post('/:id/galeria', authMiddleware, TiendaController.actualizarGaleria)

module.exports = router
