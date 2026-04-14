const UsuarioRepository = require('../../infraestructure/database/UsuarioRepositoryImpl')
const usuarioRepository = new UsuarioRepository()

const UsuarioService = {
  async registrar(data) {
    // lógica de negocio (validaciones)
    return usuarioRepository.create(data)
  },

  async login(email, contrasena) {
    const usuario = await usuarioRepository.findByEmail(email)

    if (!usuario || usuario.contrasena !== contrasena) {
      throw new Error('Credenciales inválidas')
    }

    return usuario
  }
}

module.exports = UsuarioService