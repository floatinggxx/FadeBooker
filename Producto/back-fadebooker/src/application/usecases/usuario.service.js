const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UsuarioRepository = require('../../infraestructure/database/UsuarioRepositoryImpl')
const usuarioRepository = new UsuarioRepository()

const UsuarioService = {
  async registrar(data) {
    // lógica de negocio (validaciones)
    const salt = await bcrypt.genSalt(10)
    data.contrasena = await bcrypt.hash(data.contrasena, salt)
    return usuarioRepository.create(data)
  },

  async login(email, contrasena) {
    const usuario = await usuarioRepository.findByEmail(email)

    if (!usuario) {
      throw new Error('Credenciales inválidas')
    }

    const match = await bcrypt.compare(contrasena, usuario.contrasena)
    if (!match) {
      throw new Error('Credenciales inválidas')
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email },
      process.env.JWT_SECRET || 'secret_key_temporal',
      { expiresIn: '8h' }
    )

    return { usuario, token }
  }
}

module.exports = UsuarioService