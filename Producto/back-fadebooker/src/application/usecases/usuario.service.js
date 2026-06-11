class UsuarioService {
  constructor(usuarioRepository, hasher, tokenManager) {
    this.usuarioRepository = usuarioRepository;
    this.hasher = hasher;
    this.tokenManager = tokenManager;
  }

  async registrar(data) {
    const { id_tienda, especialidad, anos_experiencia, servicios, tienda_nueva, ...userData } = data;
    
    userData.contrasena = await this.hasher.hash(userData.contrasena);
    
    // Si hay una tienda nueva o viene como Proveedor, el usuario se registra como Dueño/Proveedor
    if (tienda_nueva || userData.rol === 'Proveedor') {
      if (!userData.rol || userData.rol === 'Cliente') {
        userData.rol = 'Dueño';
      }
    }

    let id_usuario;
    try {
      id_usuario = await this.usuarioRepository.create(userData);
    } catch (err) {
      const msg = err && err.message ? String(err.message).toLowerCase() : '';
      if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('duplicate key') || msg.includes('violatio') || msg.includes('correo') || msg.includes('email')) {
        throw new Error('El correo electrónico ya está registrado');
      }
      throw err;
    }
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

    // Si el rol es Barbero, Dueño o Proveedor, crear la entidad Barbero y sus servicios
    if (userData.rol === 'Barbero' || userData.rol === 'Dueño' || userData.rol === 'Proveedor') {
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

    // Actualizar último login
    await this.usuarioRepository.update(usuario.id_usuario, { ultimo_login: new Date() });

    // Quitar contraseña de la respuesta
    const { contrasena: _, ...usuarioSinPassword } = usuario

    // Si es barbero, dueño o proveedor, incluir id_tienda
    if (usuario.rol === 'Barbero' || usuario.rol === 'Dueño' || usuario.rol === 'Proveedor') {
      const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl');
      const barberoRepo = new BarberoRepository();
      const barbero = await barberoRepo.findByUsuarioId(usuario.id_usuario);
      if (barbero) {
        usuarioSinPassword.id_tienda = barbero.id_tienda;
        usuarioSinPassword.id_barbero = barbero.id_barbero;
      } else if (usuario.rol === 'Dueño' || usuario.rol === 'Proveedor') {
        const TiendaRepository = require('../../infraestructure/database/TiendaRepositoryImpl');
        const tiendaRepo = new TiendaRepository();
        const tiendas = await tiendaRepo.findAll({ id_dueño: usuario.id_usuario });
        // Por ahora, asumimos que el dueño gestiona su primera tienda si tiene varias
        const misTiendas = await require('../../db/knex')('Tienda').where({ id_dueño: usuario.id_usuario, este_activa: true }).first();
        if (misTiendas) {
          usuarioSinPassword.id_tienda = misTiendas.id_tienda;
        }
      }
    }

    return { usuario: usuarioSinPassword, token }
  }

  async obtenerPerfil(id) {
    const usuario = await this.usuarioRepository.findById(id)
    if (usuario) {
      const { contrasena, ...usuarioSinPassword } = usuario
      
      // Si es barbero, dueño o proveedor, incluir id_tienda e id_barbero
      if (usuario.rol === 'Barbero' || usuario.rol === 'Dueño' || usuario.rol === 'Proveedor') {
        const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl');
        const barberoRepo = new BarberoRepository();
        const barbero = await barberoRepo.findByUsuarioId(usuario.id_usuario);
        if (barbero) {
          usuarioSinPassword.id_tienda = barbero.id_tienda;
          usuarioSinPassword.id_barbero = barbero.id_barbero;
        } else if (usuario.rol === 'Dueño' || usuario.rol === 'Proveedor') {
          const misTiendas = await require('../../db/knex')('Tienda').where({ id_dueño: usuario.id_usuario, este_activa: true }).first();
          if (misTiendas) {
            usuarioSinPassword.id_tienda = misTiendas.id_tienda;
          }
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

  async actualizarFoto(id, base64Image) {
    const CloudinaryService = require('../../infraestructure/storage/CloudinaryService');
    
    try {
      // Subir a Cloudinary
      const result = await CloudinaryService.uploadImage(base64Image, 'fadebooker/perfiles');
      
      // Actualizar en BD
      await this.usuarioRepository.update(id, { fotoUrl: result.secure_url });
      
      return { fotoUrl: result.secure_url };
    } catch (error) {
      console.error('--- ERROR EN USUARIO SERVICE (UPLOAD FOTO) ---');
      console.error(error);
      throw new Error(`Error al procesar la imagen: ${error.message}`);
    }
  }

  async solicitarRecuperacionContrasena(email) {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      // Por seguridad, no informamos si el correo existe o no, 
      // pero el requerimiento dice "con una validacion si el correo esta registrado"
      // así que lanzaremos error para que el frontend pueda avisar.
      throw new Error('El correo electrónico no está registrado');
    }

    // Generar token de corta duración (1 hora)
    const token = require('jsonwebtoken').sign(
      { id: usuario.id_usuario, email: usuario.email, purpose: 'password_reset' },
      this.tokenManager.secret,
      { expiresIn: '1h' }
    );

    const emailService = require('../../infraestructure/notifications/EmailService');
    await emailService.sendResetPasswordEmail(usuario.email, token);
    
    return { mensaje: 'Si el correo existe, recibirá un enlace de recuperación' };
  }

  async restablecerContrasena(token, nuevaContrasena) {
    try {
      const decoded = require('jsonwebtoken').verify(token, this.tokenManager.secret);
      
      if (decoded.purpose !== 'password_reset') {
        throw new Error('Token inválido');
      }

      // 1. Buscar usuario para validar contraseña antigua
      const usuario = await this.usuarioRepository.findById(decoded.id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // 2. Validar que la nueva contraseña no sea igual a la antigua
      const esIgual = await this.hasher.compare(nuevaContrasena, usuario.contrasena);
      if (esIgual) {
        throw new Error('La nueva contraseña no puede ser igual a la anterior');
      }

      const hashedPassword = await this.hasher.hash(nuevaContrasena);
      await this.usuarioRepository.update(decoded.id, { contrasena: hashedPassword });
      
      return { mensaje: 'Contraseña actualizada correctamente' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('El enlace ha expirado');
      }
      if (error.message === 'La nueva contraseña no puede ser igual a la anterior') {
        throw error;
      }
      throw new Error(error.message || 'Enlace de recuperación inválido o expirado');
    }
  }
}

module.exports = UsuarioService