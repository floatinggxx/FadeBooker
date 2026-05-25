const BcryptHasher = require('../../../infraestructure/security/BcryptHasher')
const JwtTokenManager = require('../../../infraestructure/security/JwtTokenManager')
const UsuarioRepository = require('../../../infraestructure/database/UsuarioRepositoryImpl')
const UsuarioService = require('../../../application/usecases/usuario.service')

const hasher = new BcryptHasher()
const tokenManager = new JwtTokenManager()
const usuarioRepository = new UsuarioRepository()
const usuarioService = new UsuarioService(usuarioRepository, hasher, tokenManager)

const UsuarioController = {
  async register(req, res) {
    try {
      console.log('📡 Registrando usuario en controlador:', req.body.email)
      const data = {
        ...req.body,
        rol: req.body.rol || 'Cliente'
      }
      const usuario = await usuarioService.registrar(data)
      console.log('✅ Usuario registrado con éxito:', usuario.id_usuario)
      res.status(201).json({
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: usuario
      })
    } catch (error) {
      console.error('❌ Error en registro (Controller):', error.message)
      res.status(400).json({ error: error.message })
    }
  },

  async login(req, res) {
    try {
      const { email, contrasena } = req.body
      const result = await usuarioService.login(email, contrasena)
      res.json(result)
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  },

  async obtenerPerfil(req, res) {
    try {
      // req.user viene del middleware de auth
      const usuario = await usuarioService.obtenerPerfil(req.user.id)
      res.json(usuario)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizarPerfil(req, res) {
    try {
      const result = await usuarioService.actualizarPerfil(req.user.id, req.body)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizarFoto(req, res) {
    try {
      const image = req.body.image || (req.file ? req.file.path : null)
      if (!image) {
        return res.status(400).json({ error: 'No se proporcionó ninguna imagen' })
      }
      const result = await usuarioService.actualizarFoto(req.user.id, image)
      res.json(result)
    } catch (error) {
      console.error('Error al actualizar foto:', error)
      res.status(400).json({ error: error.message || 'Fallo al procesar la imagen' })
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body
      if (!email) {
        return res.status(400).json({ error: 'El correo es requerido' })
      }
      const result = await usuarioService.solicitarRecuperacionContrasena(email)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, nuevaContrasena } = req.body
      if (!token || !nuevaContrasena) {
        return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' })
      }
      const result = await usuarioService.restablecerContrasena(token, nuevaContrasena)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = UsuarioController
