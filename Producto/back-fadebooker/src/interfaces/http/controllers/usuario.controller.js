const UsuarioRepository = require('../../../infraestructure/database/UsuarioRepositoryImpl');
const UsuarioService = require('../../../application/usecases/usuario.service');
const BcryptHasher = require('../../../infraestructure/security/BcryptHasher');
const JwtTokenManager = require('../../../infraestructure/security/JwtTokenManager');

const usuarioRepository = new UsuarioRepository();
const hasher = new BcryptHasher();
const tokenManager = new JwtTokenManager();
const usuarioService = new UsuarioService(usuarioRepository, hasher, tokenManager);

const UsuarioController = {
  async register(req, res) {
    try {
      console.log(`[DEBUG] Intentando registrar usuario: ${req.body.email}`);
      const user = await usuarioService.registrar(req.body)
      console.log(`[DEBUG] Usuario registrado exitosamente: ${req.body.email}`);
      res.status(201).json({
        status: 'success',
        message: 'Usuario registrado correctamente',
        data: user
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        console.warn(`[WARN] Error de validación al registrar: ${error.message}`);
        const safeErrors = Array.isArray(error.errors) ? error.errors : [];
        const errorDetails = safeErrors.map(err => {
          const path = (err && Array.isArray(err.path)) ? err.path.join('.') : '';
          const msg = (err && err.message) ? err.message : 'Error desconocido';
          return path ? `${path}: ${msg}` : msg;
        }).join(', ');

        return res.status(400).json({
          status: 'error',
          message: `Validation failed: ${errorDetails}`,
          errors: safeErrors.map(err => ({
            campo: (err && Array.isArray(err.path)) ? err.path.join('.') : '',
            mensaje: (err && err.message) ? err.message : 'Error desconocido'
          }))
        })
      }
      console.error(`[ERROR] Fallo crítico al registrar: ${error.message}`);
      res.status(400).json({ 
        status: 'error',
        message: error.message || '',
        errors: []
      })
    }
  },

  async login(req, res) {
    try {
      const { email, contrasena } = req.body
      const user = await usuarioService.login(email, contrasena)
      res.json(user)
    } catch (error) {
      res.status(401).json({ 
        status: 'error',
        message: error.message || '',
        errors: []
      })
    }
  },

  async obtenerPerfil(req, res) {
    try {
      const user = await usuarioService.obtenerPerfil(req.user.id)
      res.json(user)
    } catch (error) {
      res.status(400).json({ 
        status: 'error',
        message: error.message || '',
        errors: []
      })
    }
  },

  async actualizarPerfil(req, res) {
    try {
      const user = await usuarioService.actualizarPerfil(req.user.id, req.body)
      res.json(user)
    } catch (error) {
      res.status(400).json({ 
        status: 'error',
        message: error.message || '',
        errors: []
      })
    }
  }
}

module.exports = UsuarioController