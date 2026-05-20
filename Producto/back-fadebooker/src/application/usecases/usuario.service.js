class UsuarioService {
  constructor(usuarioRepository, hasher, tokenManager) {
    this.usuarioRepository = usuarioRepository;
    this.hasher = hasher;
    this.tokenManager = tokenManager;
  }

  async registrar(data) {
    data.contrasena = await this.hasher.hash(data.contrasena);
    
    const id = await this.usuarioRepository.create(data)
    return { id_usuario: id, ...data, contrasena: undefined }
  }

  async login(email, contrasena) {
    const usuario = await this.usuarioRepository.findByEmail(email)

    if (!usuario) {
      throw new Error('Credenciales inválidas')
    }

    const match = await this.hasher.compare(contrasena, usuario.contrasena);
    if (!match) {
      throw new Error('Credenciales inválidas')
    }

    const token = this.tokenManager.sign({ id: usuario.id_usuario, email: usuario.email });

    // Quitar contraseña de la respuesta
    const { contrasena: _, ...usuarioSinPassword } = usuario

    // Si es barbero, incluir id_tienda
    if (usuario.rol === 'Barbero') {
      const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl');
      const barberoRepo = new BarberoRepository();
      const barbero = await barberoRepo.findByUsuarioId(usuario.id_usuario);
      if (barbero) {
        usuarioSinPassword.id_tienda = barbero.id_tienda;
        usuarioSinPassword.id_barbero = barbero.id_barbero;
      }
    }

    return { usuario: usuarioSinPassword, token }
  }

  async obtenerPerfil(id) {
    const usuario = await this.usuarioRepository.findById(id)
    if (usuario) {
      const { contrasena, ...usuarioSinPassword } = usuario
      
      // Si es barbero, incluir id_tienda e id_barbero
      if (usuario.rol === 'Barbero') {
        const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl');
        const barberoRepo = new BarberoRepository();
        const barbero = await barberoRepo.findByUsuarioId(usuario.id_usuario);
        if (barbero) {
          usuarioSinPassword.id_tienda = barbero.id_tienda;
          usuarioSinPassword.id_barbero = barbero.id_barbero;
        }
      }
      
      return usuarioSinPassword
    }
    return null;
  }

  async actualizarPerfil(id, data) {
    if (data.contrasena) {
      data.contrasena = await this.hasher.hash(data.contrasena);
    }
    await this.usuarioRepository.update(id, data);
    
    const actualizado = await this.usuarioRepository.findById(id);
    if (!actualizado) return null;
    const { contrasena, ...usuarioSinPassword } = actualizado;
    return usuarioSinPassword;
  }
}

module.exports = UsuarioService