const express = require('express')
const router = express.Router()
const UsuarioController = require('../controllers/usuario.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const validateRequest = require('../middlewares/validateRequest')
const { usuarioSchema, loginSchema, updateUsuarioSchema } = require('../../../infraestructure/schemas/usuario.schema')

router.post('/register', validateRequest({ body: usuarioSchema }), UsuarioController.register)
router.post('/login', validateRequest({ body: loginSchema }), UsuarioController.login)
router.get('/perfil', authMiddleware, UsuarioController.obtenerPerfil)
router.put('/perfil', authMiddleware, validateRequest({ body: updateUsuarioSchema }), UsuarioController.actualizarPerfil)
router.post('/perfil/foto', authMiddleware, UsuarioController.actualizarFoto)

module.exports = router