const express = require('express')
const router = express.Router()
const BloqueHorarioController = require('../controllers/bloqueHorario.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// POST /bloques/:id_barbero - Crear bloque horario (requiere autenticación)
router.post('/:id_barbero', authMiddleware, BloqueHorarioController.crear)

// GET /bloques/:id_barbero/:fecha - Obtener bloques de un barbero en una fecha específica
router.get('/:id_barbero/:fecha', BloqueHorarioController.obtenerPorFecha)

// GET /bloques/:id_barbero - Obtener todos los bloques de un barbero
router.get('/:id_barbero', BloqueHorarioController.obtenerPorBarbero)

// DELETE /bloques/:id - Eliminar un bloque horario (requiere autenticación)
router.delete('/:id', authMiddleware, BloqueHorarioController.eliminar)

module.exports = router
