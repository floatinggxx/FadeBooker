const UsuarioService = require('../../../application/usecases/usuario.service')

const UsuarioController = {
  async register(req, res) {
    try {
      const user = await UsuarioService.registrar(req.body)
      res.json(user)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async login(req, res) {
    try {
      const { email, contrasena } = req.body
      const user = await UsuarioService.login(email, contrasena)
      res.json(user)
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  },

  async obtenerPerfil(req, res) {
    try {
      const user = await UsuarioService.obtenerPerfil(req.user.id)
      res.json(user)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizarPerfil(req, res) {
    try {
      const user = await UsuarioService.actualizarPerfil(req.user.id, req.body)
      res.json(user)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = UsuarioController