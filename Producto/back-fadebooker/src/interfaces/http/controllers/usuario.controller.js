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
      console.log(`[DEBUG] Intentando registrar usuario: ${req.body.email}`)
      const user = await usuarioService.registrar(req.body)
      console.log(`[DEBUG] Usuario registrado exitosamente: ${req.body.email}`)
      const token = tokenManager.sign({ id: user.id_usuario, email: user.email, rol: user.rol })

      return res.status(201).json({
        status: 'success',
        message: 'Usuario registrado correctamente',
        data: user,
        token
      })
    } catch (error) {
      if (error && error.name === 'ZodError') {
        const safeErrors = Array.isArray(error.errors) ? error.errors : []
        const errorDetails = safeErrors
          .map(err => {
            const path = Array.isArray(err.path) ? err.path.join('.') : ''
            const msg = err && err.message ? err.message : 'Error de validación'
            return path ? `${path}: ${msg}` : msg
          })
          .join(', ')

        return res.status(400).json({
          status: 'error',
          message: `Validation failed: ${errorDetails}`,
          errors: safeErrors.map(err => ({ campo: Array.isArray(err.path) ? err.path.join('.') : '', mensaje: err.message }))
        })
      }

      console.error(`[ERROR] Fallo crítico al registrar: ${error && error.message ? error.message : error}`)
      return res.status(400).json({ status: 'error', message: error && error.message ? error.message : 'Error' })
    }
  },

  async login(req, res) {
    try {
      const { email, contrasena } = req.body
      const result = await usuarioService.login(email, contrasena)
      return res.json(result)
    } catch (error) {
      return res.status(401).json({ status: 'error', message: error && error.message ? error.message : 'Unauthorized' })
    }
  },

  async obtenerPerfil(req, res) {
    try {
      const usuario = await usuarioService.obtenerPerfil(req.user.id)
      return res.json(usuario)
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error && error.message ? error.message : 'Error' })
    }
  },

  async actualizarPerfil(req, res) {
    try {
      const result = await usuarioService.actualizarPerfil(req.user.id, req.body)
      return res.json(result)
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error && error.message ? error.message : 'Error' })
    }
  },

  async actualizarFoto(req, res) {
    try {
      const image = req.body.image || (req.file ? req.file.path : null)
      if (!image) {
        return res.status(400).json({ status: 'error', message: 'No se proporcionó ninguna imagen' })
      }

      const result = await usuarioService.actualizarFoto(req.user.id, image)
      return res.json(result)
    } catch (error) {
      console.error('Error al actualizar foto:', error)
      return res.status(400).json({ status: 'error', message: error && error.message ? error.message : 'Fallo al procesar la imagen' })
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body
      if (!email) {
        return res.status(400).json({ status: 'error', message: 'El correo es requerido' })
      }

      const result = await usuarioService.solicitarRecuperacionContrasena(email)
      return res.json(result)
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error && error.message ? error.message : 'Error' })
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, nuevaContrasena } = req.body
      if (!token || !nuevaContrasena) {
        return res.status(400).json({ status: 'error', message: 'Token y nueva contraseña son requeridos' })
      }

      const result = await usuarioService.restablecerContrasena(token, nuevaContrasena)
      return res.json(result)
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error && error.message ? error.message : 'Error' })
    }
  }
}

module.exports = UsuarioController
