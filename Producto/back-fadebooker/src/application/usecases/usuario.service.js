const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { usuarioSchema, loginSchema, updateUsuarioSchema } = require('../../infraestructure/schemas/usuario.schema')
const UsuarioRepository = require('../../infraestructure/database/UsuarioRepositoryImpl')
const usuarioRepository = new UsuarioRepository()

const UsuarioService = {
  async registrar(data) {
    // Validar esquema
    const validatedData = usuarioSchema.parse(data)

    const salt = await bcrypt.genSalt(10)
    validatedData.contrasena = await bcrypt.hash(validatedData.contrasena, salt)
    
    const id = await usuarioRepository.create(validatedData)
    return { id_usuario: id, ...validatedData, contrasena: undefined }
  },

  async login(email, contrasena) {
    // Validar esquema
    loginSchema.parse({ email, contrasena })

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

    // Quitar contraseña de la respuesta
    const { contrasena: _, ...usuarioSinPassword } = usuario

    return { usuario: usuarioSinPassword, token }
  },

  async obtenerPerfil(id) {
    const usuario = await usuarioRepository.findById(id)
    if (usuario) {
      const { contrasena, ...usuarioSinPassword } = usuario
      return usuarioSinPassword
    }
    return null
  },

  async actualizarPerfil(id, data) {
    // Validar esquema (partial)
    const validatedData = updateUsuarioSchema.parse(data)

    if (validatedData.contrasena) {
      const salt = await bcrypt.genSalt(10)
      validatedData.contrasena = await bcrypt.hash(validatedData.contrasena, salt)
    }
    await usuarioRepository.update(id, validatedData)
    
    const actualizado = await usuarioRepository.findById(id)
    const { contrasena, ...usuarioSinPassword } = actualizado
    return usuarioSinPassword
  }
}

module.exports = UsuarioService