const express = require('express')
const router = express.Router()
const ClienteController = require('../controllers/cliente.controller')

router.post('/', ClienteController.crear)
router.get('/', ClienteController.obtenerTodos)
router.get('/buscar', ClienteController.buscarPorNombre)
router.get('/telefono/:telefono', ClienteController.buscarPorTelefono)
router.get('/email/:email', ClienteController.obtenerPorEmail)
router.get('/:id', ClienteController.obtenerPorId)
router.put('/:id', ClienteController.actualizar)
router.put('/:id/puntos', ClienteController.actualizarPuntos)
router.delete('/:id', ClienteController.eliminar)

module.exports = router