const express = require('express')
const router = express.Router()
const BarberoController = require('../controllers/barbero.controller')

router.post('/', BarberoController.crear)
router.get('/', BarberoController.obtenerTodos)
router.get('/especialidad/:especialidad', BarberoController.buscarPorEspecialidad)
router.get('/email/:email', BarberoController.obtenerPorEmail)
router.get('/:id', BarberoController.obtenerPorId)
router.get('/:id/servicios', BarberoController.obtenerServicios)
router.get('/:id/disponibilidad/:fecha', BarberoController.obtenerDisponibilidad)
router.put('/:id', BarberoController.actualizar)
router.put('/:id/horario', BarberoController.actualizarHorario)
router.delete('/:id', BarberoController.eliminar)

module.exports = router