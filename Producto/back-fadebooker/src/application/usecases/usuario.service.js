class UsuarioService {
  constructor(usuarioRepository, hasher, tokenManager) {
    this.usuarioRepository = usuarioRepository;
    this.hasher = hasher;
    this.tokenManager = tokenManager;
  }

  async registrar(data) {
    const { id_tienda, especialidad, anos_experiencia, servicios, tienda_nueva, ...userData } = data;
    
    userData.contrasena = await this.hasher.hash(userData.contrasena);
    
    // Si hay una tienda nueva, el usuario se registra como Dueño
    if (tienda_nueva) {
      userData.rol = 'Dueño';
    }

    const id_usuario = await this.usuarioRepository.create(userData);
    let final_id_tienda = id_tienda;

    // Si hay tienda nueva, crearla primero
    if (tienda_nueva) {
      const TiendaRepository = require('../../infraestructure/database/TiendaRepositoryImpl');
      const tiendaRepo = new TiendaRepository();
      
      final_id_tienda = await tiendaRepo.create({
        nombre_tienda: tienda_nueva.nombre_tienda,
        direccion: tienda_nueva.direccion,
        ciudad: tienda_nueva.ciudad,
        id_dueño: id_usuario,
        este_activa: 1
      });
    }

    // Si el rol es Barbero o Dueño, crear la entidad Barbero y sus servicios
    if (userData.rol === 'Barbero' || userData.rol === 'Dueño') {
      const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl');
      const barberoRepo = new BarberoRepository();
      
      const id_barbero = await barberoRepo.create({
        id_usuario,
        id_tienda: final_id_tienda || 1,
        especialidad: especialidad || 'Barbero General',
        anos_experiencia: anos_experiencia || 0,
        activo: 1
      });

      // Si vienen servicios, asociarlos
      if (servicios && Array.isArray(servicios)) {
        const ServicioBarberoRepository = require('../../infraestructure/database/ServicioBarberoRepositoryImpl');
        const servicioBarberoRepo = new ServicioBarberoRepository();
        
        for (const id_servicio of servicios) {
          await servicioBarberoRepo.create(id_servicio, id_barbero);
        }
      }
    }

    return { id_usuario, ...userData, id_tienda: final_id_tienda, contrasena: undefined }
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

    // Si es barbero o dueño, incluir id_tienda
    if (usuario.rol === 'Barbero' || usuario.rol === 'Dueño') {
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
      
      // Si es barbero o dueño, incluir id_tienda e id_barbero
      if (usuario.rol === 'Barbero' || usuario.rol === 'Dueño') {
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