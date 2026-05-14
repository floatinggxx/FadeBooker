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
      const user = await usuarioService.registrar(req.body)
      res.json(user)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async login(req, res) {
    try {
      const { email, contrasena } = req.body
      const user = await usuarioService.login(email, contrasena)
      res.json(user)
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  },

  async obtenerPerfil(req, res) {
    try {
      const user = await usuarioService.obtenerPerfil(req.user.id)
      res.json(user)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizarPerfil(req, res) {
    try {
      const user = await usuarioService.actualizarPerfil(req.user.id, req.body)
      res.json(user)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = UsuarioController