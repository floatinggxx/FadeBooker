const express = require('express')
const router = express.Router()
const UsuarioController = require('../controllers/usuario.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/register', UsuarioController.register)
router.post('/login', UsuarioController.login)
router.get('/perfil', authMiddleware, UsuarioController.obtenerPerfil)
router.put('/perfil', authMiddleware, UsuarioController.actualizarPerfil)

module.exports = router