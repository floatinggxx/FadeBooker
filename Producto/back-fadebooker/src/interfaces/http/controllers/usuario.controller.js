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
<<<<<<< Updated upstream
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
=======
      console.log(`[DEBUG] Intentando registrar usuario: ${req.body.email}`);
      const user = await usuarioService.registrar(req.body);
      console.log(`[DEBUG] Usuario registrado exitosamente: ${req.body.email}`);

      return res.status(201).json({
        status: 'success',
        message: 'Usuario registrado correctamente',
        data: user
      });
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
        });
      }

      console.error(`[ERROR] Fallo crítico al registrar: ${error.message}`);
      return res.status(400).json({
        status: 'error',
        message: error.message || '',
        errors: []
      });
>>>>>>> Stashed changes
    }
  },

  async login(req, res) {
    try {
<<<<<<< Updated upstream
      const { email, contrasena } = req.body
      const result = await usuarioService.login(email, contrasena)
      res.json(result)
    } catch (error) {
      res.status(401).json({ error: error.message })
=======
      const { email, contrasena } = req.body;
      const user = await usuarioService.login(email, contrasena);
      return res.json(user);
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: error.message || '',
        errors: []
      });
>>>>>>> Stashed changes
    }
  },

  async obtenerPerfil(req, res) {
    try {
<<<<<<< Updated upstream
      // req.user viene del middleware de auth
      const usuario = await usuarioService.obtenerPerfil(req.user.id)
      res.json(usuario)
    } catch (error) {
      res.status(400).json({ error: error.message })
=======
      const user = await usuarioService.obtenerPerfil(req.user.id);
      return res.json(user);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message || '',
        errors: []
      });
>>>>>>> Stashed changes
    }
  },

  async actualizarPerfil(req, res) {
    try {
<<<<<<< Updated upstream
      const result = await usuarioService.actualizarPerfil(req.user.id, req.body)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
=======
      const user = await usuarioService.actualizarPerfil(req.user.id, req.body);
      return res.json(user);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message || '',
        errors: []
      });
>>>>>>> Stashed changes
    }
  },

  async actualizarFoto(req, res) {
    try {
<<<<<<< Updated upstream
      const image = req.body.image || (req.file ? req.file.path : null)
=======
      const { image } = req.body;
>>>>>>> Stashed changes
      if (!image) {
        return res.status(400).json({ error: 'No se proporcionó ninguna imagen' })
      }
<<<<<<< Updated upstream
      const result = await usuarioService.actualizarFoto(req.user.id, image)
      res.json(result)
    } catch (error) {
      console.error('Error al actualizar foto:', error)
      res.status(400).json({ error: error.message || 'Fallo al procesar la imagen' })
=======

      const result = await usuarioService.actualizarFoto(req.user.id, image);
      return res.json(result);
    } catch (error) {
      console.error('Error al actualizar foto:', error);
      return res.status(400).json({ error: error.message || 'Fallo al procesar la imagen' });
>>>>>>> Stashed changes
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body
      if (!email) {
        return res.status(400).json({ error: 'El correo es requerido' })
      }
<<<<<<< Updated upstream
      const result = await usuarioService.solicitarRecuperacionContrasena(email)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
=======

      const result = await usuarioService.solicitarRecuperacionContrasena(email);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
>>>>>>> Stashed changes
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, nuevaContrasena } = req.body
      if (!token || !nuevaContrasena) {
        return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' })
      }
<<<<<<< Updated upstream
      const result = await usuarioService.restablecerContrasena(token, nuevaContrasena)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
=======

      const result = await usuarioService.restablecerContrasena(token, nuevaContrasena);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
>>>>>>> Stashed changes
    }
  }
};

module.exports = UsuarioController
