class UsuarioService {
  constructor(usuarioRepository, hasher, tokenManager) {
    this.usuarioRepository = usuarioRepository;
    this.hasher = hasher;
    this.tokenManager = tokenManager;
  }

  async registrar(data) {
    const { id_tienda, especialidad, anos_experiencia, servicios, tienda_nueva, ...userData } = data;

    // Mantener rol original para devolverlo en la respuesta y en el token
    const originalRole = userData.rol;

    if (tienda_nueva) {
      userData.rol = 'Dueño';
    }

    userData.contrasena = await this.hasher.hash(userData.contrasena);

    let id_usuario;
    try {
      id_usuario = await this.usuarioRepository.create(userData);
    } catch (err) {
      const msg = err && err.message ? String(err.message).toLowerCase() : '';
      // Detectar errores de constraint UNIQUE del email
      if (msg.includes('unique') || msg.includes('duplicate key') || msg.includes('violation')) {
        throw new Error('El correo electrónico ya está registrado');
      }
      throw err;
    }
    let final_id_tienda = id_tienda;

    // Si hay tienda nueva, crearla primero
    if (tienda_nueva) {
      const TiendaRepository = require('../../infraestructure/database/TiendaRepositoryImpl');
      const tiendaRepo = new TiendaRepository();

      // `ciudad` column may not exist in all DB schemas; do not send it to avoid SQL errors
      final_id_tienda = await tiendaRepo.create({
        nombre_tienda: tienda_nueva.nombre_tienda,
        direccion: tienda_nueva.direccion,
        comuna: tienda_nueva.comuna || null,
        id_dueño: id_usuario,
        este_activa: 1
      });
    }

    // Si el rol es Barbero, crear la entidad Barbero y sus servicios
    if (userData.rol === 'Barbero') {
      const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl');
      const barberoRepo = new BarberoRepository();
      
      const id_barbero = await barberoRepo.create({
        id_usuario,
        id_tienda: final_id_tienda || null,
        especialidad: especialidad || 'Barbero General',
        anos_experiencia: anos_experiencia || 0,
        activo: 1
      });

      // Si vienen servicios, asociarlos (solo para Barbero)
      const servicioIds = Array.isArray(servicios)
        ? servicios.map(s => Number(s)).filter(n => !Number.isNaN(n))
        : [];

      if (servicioIds.length > 0) {
        const ServicioBarberoRepository = require('../../infraestructure/database/ServicioBarberoRepositoryImpl');
        const servicioBarberoRepo = new ServicioBarberoRepository();
        
        for (const id_servicio of servicioIds) {
          await servicioBarberoRepo.create(id_servicio, id_barbero);
        }
      }
    }

    // Preparar objeto de retorno: preservar el rol original para la API
    const returnedUser = { id_usuario, ...userData, id_tienda: final_id_tienda };
    returnedUser.contrasena = undefined;
    // Reemplazar el rol almacenado por el rol real que la app espera
    returnedUser.rol = originalRole || returnedUser.rol;

    return returnedUser;
  }

  // Crea un registro pendiente de confirmación de email. No crea usuario hasta confirmación.
  async createPendingRegistration(data) {
    const { id_tienda, especialidad, anos_experiencia, servicios, tienda_nueva, ...userData } = data;

    // Validaciones existentes de uniqueness se manejarán al confirmar al crear el usuario definitivo
    userData.contrasena = await this.hasher.hash(userData.contrasena);

    // Generar token único (UUID corto) y expiración
    const token = require('crypto').randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24h

    const payload = {
      userData,
      meta: { id_tienda, especialidad, anos_experiencia, servicios, tienda_nueva }
    };

    const knex = require('../../db/knex');
    await knex('PendingEmailConfirmation').insert({ token, payload: JSON.stringify(payload), expires_at: expiresAt });

    const EmailService = require('../../infraestructure/notifications/EmailService');
    await EmailService.sendConfirmationEmail(userData.email, token);

    return { token };
  }

  async resendConfirmation(email) {
    const knex = require('../../db/knex');

    // Buscar pending más reciente por email dentro del payload JSON
    const row = await knex('PendingEmailConfirmation')
      .whereRaw("JSON_VALUE(payload, '$.userData.email') = ?", [email])
      .orderBy('created_at', 'desc')
      .first();

    if (!row) throw new Error('No se encontró un registro pendiente para ese correo');

    // Generar nuevo token y actualizar el registro (evita múltiples tokens válidos)
    const newToken = require('crypto').randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24h

    await knex('PendingEmailConfirmation').where({ id: row.id }).update({ token: newToken, expires_at: expiresAt, created_at: knex.fn.now() });

    const payloadObj = JSON.parse(row.payload);
    const EmailService = require('../../infraestructure/notifications/EmailService');
    await EmailService.sendConfirmationEmail(payloadObj.userData.email, newToken);

    return { mensaje: 'Correo de confirmación reenviado' };
  }

  // Confirmar token y crear el usuario definitivo
  async confirmPendingRegistration(token) {
    const knex = require('../../db/knex');
    const row = await knex('PendingEmailConfirmation').where({ token }).first();
    if (!row) throw new Error('Token inválido o no encontrado');
    if (new Date(row.expires_at) < new Date()) throw new Error('Token expirado');

    const data = JSON.parse(row.payload);
    const { userData, meta } = data;

    // Debug: ensure payload contains hashed password
    if (!userData || !userData.contrasena) {
      console.error('[ERROR] Pending payload missing contrasena:', row.payload);
      throw new Error('Registro pendiente corrupto: falta contraseña. Contacta al soporte.');
    }

    // Intentar crear usuario; manejar unique email
    let id_usuario;
    try {
      id_usuario = await this.usuarioRepository.create(userData);
    } catch (err) {
      const msg = err && err.message ? String(err.message).toLowerCase() : '';
      if (msg.includes('unique') || msg.includes('duplicate key') || msg.includes('violation')) {
        throw new Error('El correo electrónico ya está registrado');
      }
      throw err;
    }

    // Si hubo tienda nueva (meta.tienda_nueva), crearla y asignar id_dueño
    let final_id_tienda = meta.id_tienda;
    if (meta.tienda_nueva) {
      const TiendaRepository = require('../../infraestructure/database/TiendaRepositoryImpl');
      const tiendaRepo = new TiendaRepository();
      final_id_tienda = await tiendaRepo.create({
        nombre_tienda: meta.tienda_nueva.nombre_tienda,
        direccion: meta.tienda_nueva.direccion,
        comuna: meta.tienda_nueva.comuna || null,
        id_dueño: id_usuario,
        este_activa: 1
      });
    }

    // Si rol Barbero, crear barbero y servicios (igual que registrar)
    if (userData.rol === 'Barbero') {
      const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl');
      const barberoRepo = new BarberoRepository();
      const id_barbero = await barberoRepo.create({
        id_usuario,
        id_tienda: final_id_tienda || null,
        especialidad: meta.especialidad || 'Barbero General',
        anos_experiencia: meta.anos_experiencia || 0,
        activo: 1
      });

      const servicioIds = Array.isArray(meta.servicios) ? meta.servicios.map(s => Number(s)).filter(n => !Number.isNaN(n)) : [];
      if (servicioIds.length > 0) {
        const ServicioBarberoRepository = require('../../infraestructure/database/ServicioBarberoRepositoryImpl');
        const servicioBarberoRepo = new ServicioBarberoRepository();
        for (const id_servicio of servicioIds) {
          await servicioBarberoRepo.create(id_servicio, id_barbero);
        }
      }
    }

    // Borrar el pending
    await knex('PendingEmailConfirmation').where({ token }).delete();

    // Try to fetch the created user by id; fall back to email lookup if needed
    let created = null;
    if (id_usuario) {
      created = await this.usuarioRepository.findById(id_usuario);
    }
    if (!created) {
      // fallback: try find by email
      created = await this.usuarioRepository.findByEmail(userData.email);
    }

    if (!created) {
      // As last resort, return minimal info (without password) and log
      console.error('[ERROR] confirmPendingRegistration: created user not found after insert. id_usuario=', id_usuario, 'email=', userData.email);
      return { id_usuario: id_usuario || null, email: userData.email, nombre: userData.nombre, apellido: userData.apellido };
    }

    // Defensive: ensure created is an object before destructuring
    if (typeof created !== 'object' || created === null) {
      console.error('[ERROR] confirmPendingRegistration: unexpected created type:', typeof created, created);
      return { id_usuario: id_usuario || null, email: userData.email, nombre: userData.nombre, apellido: userData.apellido };
    }

    const usuarioSinPassword = (() => {
      const copy = { ...created };
      if (Object.prototype.hasOwnProperty.call(copy, 'contrasena')) delete copy.contrasena;
      return copy;
    })();

    return usuarioSinPassword;
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

    const token = this.tokenManager.sign({ id: usuario.id_usuario, email: usuario.email, rol: usuario.rol });

    // Actualizar último login
    await this.usuarioRepository.update(usuario.id_usuario, { ultimo_login: new Date() });

    // Quitar contraseña de la respuesta
    const { contrasena: _, ...usuarioSinPassword } = usuario

    // Si es barbero o dueño, incluir id_tienda e id_barbero
    if (usuario.rol === 'Barbero' || usuario.rol === 'Dueño') {
      const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl');
      const barberoRepo = new BarberoRepository();
      let barbero = await barberoRepo.findByUsuarioId(usuario.id_usuario);
      if (!barbero && usuario.rol === 'Dueño') {
        // Asegurar que el dueño también tenga un registro de barbero asociado.
        try {
          const TiendaRepository = require('../../infraestructure/database/TiendaRepositoryImpl');
          const tiendaRepo = new TiendaRepository();
          const misTiendas = await tiendaRepo.findAll({ id_dueño: usuario.id_usuario });
          const tienda = misTiendas && misTiendas[0];
          if (tienda) {
            const barberoId = await barberoRepo.create({
              id_usuario: usuario.id_usuario,
              id_tienda: tienda.id_tienda,
              especialidad: 'Dueño de Tienda',
              activo: 1,
              tarifa_base: 0
            });
            barbero = await barberoRepo.findByUsuarioId(usuario.id_usuario);
          }
        } catch (err) {
          console.error('[UsuarioService] Error asegurando barbero para dueño:', err);
        }
      }
      if (barbero) {
        usuarioSinPassword.id_tienda = barbero.id_tienda;
        usuarioSinPassword.id_barbero = barbero.id_barbero;
      } else if (usuario.rol === 'Dueño') {
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
      
      // Si es barbero o dueño, incluir id_tienda e id_barbero
      if (usuario.rol === 'Barbero' || usuario.rol === 'Dueño') {
        const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl');
        const barberoRepo = new BarberoRepository();
        const barbero = await barberoRepo.findByUsuarioId(usuario.id_usuario);
        if (barbero) {
          usuarioSinPassword.id_tienda = barbero.id_tienda;
          usuarioSinPassword.id_barbero = barbero.id_barbero;
        } else if (usuario.rol === 'Dueño') {
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