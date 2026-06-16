const UsuarioRepositoryImpl = require('./UsuarioRepositoryImpl')
const db = require('../../db/knex')

/**
 * BarberoRepositoryImpl
 * 
 * ACTUALIZADO (v1.1.0):
 * - Agregados métodos para gestionar servicios de barberos
 * - Métodos para obtener servicios que ofrece cada barbero
 * - Métodos para verificar disponibilidad de servicios
 */
class BarberoRepositoryImpl extends UsuarioRepositoryImpl {
  async create(data) {
    const trx = await db.transaction()
    try {
      let id_usuario = data.id_usuario

      // Si no viene id_usuario o si queremos asegurar que el usuario existe/se cree
      if (!id_usuario) {
        // Extraer campos de usuario
        const usuarioData = {
          email: data.email,
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          rol: 'Barbero',
          foto_perfil_url: data.foto_perfil_url,
          estado: 1
        }

        // Verificar si el usuario ya existe por email
        const existingUser = await trx('Usuario').where({ email: data.email }).first()
        if (existingUser) {
          id_usuario = existingUser.id_usuario
          // Opcionalmente actualizar el rol si era cliente
          await trx('Usuario').where({ id_usuario }).update({ rol: 'Barbero' })
        } else {
          const result = await trx('Usuario').insert(usuarioData).returning('id_usuario')
          if (result && Array.isArray(result) && result.length > 0) {
            const id = result[0]
            id_usuario = typeof id === 'object' ? id.id_usuario : id
          } else {
            id_usuario = result
          }
        }
      }

      // Preparar datos del barbero
      const barberoData = {
        id_usuario,
        id_tienda: data.id_tienda || 1, // Default a 1 si no viene
        especialidad: data.especialidad,
        anos_experiencia: data.anos_experiencia,
        tarifa_base: data.tarifa_base,
        foto_perfil_url: data.foto_perfil_url,
        activo: 1
      }

      const barberoResult = await trx('Barbero').insert(barberoData).returning('id_barbero')
      let id_barbero = null
      if (barberoResult && Array.isArray(barberoResult) && barberoResult.length > 0) {
        const id = barberoResult[0]
        id_barbero = typeof id === 'object' ? id.id_barbero : id
      } else {
        id_barbero = barberoResult
      }
      
      await trx.commit()
      return id_barbero
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async findByEspecialidad(especialidad) {
    // La especialidad está en el campo especialidad del Barbero
    return db('Barbero')
      .where({ 'Barbero.especialidad': especialidad, 'Barbero.activo': true })
      .orderBy('Barbero.calificacion_promedio', 'desc')
      .select()
  }

  async actualizarHorario(id_barbero, horario) {
    // Actualizar nota en el comentario del barbero si es necesario
    return db('Barbero').where({ id_barbero }).update({ updatedAt: db.raw('GETDATE()') })
  }

  async obtenerDisponibilidad(id_barbero, fecha) {
    // Obtener citas del barbero en la fecha para verificar disponibilidad
    // Sólo traer citas que efectivamente bloquean horarios: confirmadas o en progreso.
    // Evitamos traer 'pendiente' o 'completada' para que no aparezcan como ocupadas.
    return db('Cita')
      .where({ id_barbero })
      .whereBetween('fecha_hora_inicio', [
        `${fecha} 00:00:00`,
        `${fecha} 23:59:59`
      ])
      .whereIn('estado', ['confirmada', 'en_progreso'])
      .select('id_cita', 'fecha_hora_inicio', 'duracion_minutos', 'estado')
  }

  /**
   * Obtiene los horarios de apertura y cierre de la tienda a la que pertenece el barbero
   * @param {number} id_barbero - ID del barbero
   * @returns {Promise<{horario_apertura: string, horario_cierre: string}>}
   */
  async obtenerHorariosTienda(id_barbero) {
    const tienda = await db('Tienda')
      .join('Barbero', 'Tienda.id_tienda', '=', 'Barbero.id_tienda')
      .where('Barbero.id_barbero', id_barbero)
      .select('Tienda.horario_apertura', 'Tienda.horario_cierre')
      .first();
    
    // Valores por defecto si no se encuentran
    if (!tienda) {
      return { horario_apertura: '09:00:00', horario_cierre: '20:00:00' };
    }
    
    // Convertir de objeto Date/Time a string si es necesario (Knex con Tedious a veces lo hace)
    let apertura = tienda.horario_apertura;
    let cierre = tienda.horario_cierre;

    if (apertura instanceof Date) apertura = apertura.toTimeString().split(' ')[0];
    if (cierre instanceof Date) cierre = cierre.toTimeString().split(' ')[0];

    return { horario_apertura: apertura, horario_cierre: cierre };
  }

  async findByTienda(id_tienda) {
    return db('Barbero as b')
      .leftJoin('Usuario as u', 'b.id_usuario', '=', 'u.id_usuario')
      .leftJoin('Reseña as r', 'b.id_barbero', '=', 'r.id_barbero')
      .where({ 'b.id_tienda': id_tienda, 'b.activo': true })
      .whereExists(function() {
        this.select('*')
          .from('ServicioBarbero')
          .whereRaw('ServicioBarbero.id_barbero = b.id_barbero')
          .where('ServicioBarbero.disponible', true)
      })
      .groupBy('b.id_barbero', 'u.nombre', 'u.apellido', 'u.email', 'b.especialidad', 'u.foto_perfil_url', 'b.id_tienda')
      .orderBy('u.nombre')
      .select(
        'b.id_barbero',
        'u.nombre',
        'u.apellido',
        'u.email',
        'b.especialidad',
        'u.foto_perfil_url',
        db.raw('ISNULL(AVG(CAST(r.puntuacion AS FLOAT)), 0) as calificacion_promedio'),
        'b.id_tienda'
      )
  }

  async findByUsuarioId(id_usuario) {
    return db('Barbero').where({ id_usuario }).first()
  }

  async findById(id_barbero) {
    const row = await db('Barbero as b')
      .leftJoin('Usuario as u', 'b.id_usuario', '=', 'u.id_usuario')
      .leftJoin('Reseña as r', 'b.id_barbero', '=', 'r.id_barbero')
      .where({ 'b.id_barbero': id_barbero })
      .groupBy('b.id_barbero', 'u.id_usuario', 'u.nombre', 'u.apellido', 'u.email', 'u.telefono', 'u.foto_perfil_url', 'b.especialidad', 'b.anos_experiencia', 'b.tarifa_base', 'b.id_tienda', 'b.total_resenas', 'b.activo', 'b.createdAt', 'b.updatedAt')
      .select(
        'b.id_barbero',
        'u.id_usuario',
        'u.nombre',
        'u.apellido',
        'u.email',
        'u.telefono',
        'u.foto_perfil_url',
        'b.especialidad',
        'b.anos_experiencia',
        'b.tarifa_base',
        'b.id_tienda',
        'b.total_resenas',
        'b.activo',
        'b.createdAt',
        'b.updatedAt',
        db.raw('ISNULL(AVG(CAST(r.puntuacion AS FLOAT)), 0) as calificacion_promedio')
      )
      .first()
    return row
  }

  async findAll() {
    return db('Barbero as b')
      .leftJoin('Usuario as u', 'b.id_usuario', '=', 'u.id_usuario')
      .leftJoin('Reseña as r', 'b.id_barbero', '=', 'r.id_barbero')
      .where({ 'b.activo': true })
      .whereExists(function() {
        this.select('*')
          .from('ServicioBarbero')
          .whereRaw('ServicioBarbero.id_barbero = b.id_barbero')
          .where('ServicioBarbero.disponible', true)
      })
      .groupBy('b.id_barbero', 'b.id_usuario', 'b.id_tienda', 'b.especialidad', 'b.anos_experiencia', 'b.tarifa_base', 'b.total_resenas', 'b.activo', 'b.createdAt', 'b.updatedAt', 'u.email', 'u.nombre', 'u.apellido', 'u.telefono', 'u.foto_perfil_url')
      .orderBy('u.nombre')
      .select(
        'b.id_barbero',
        'b.id_usuario',
        'b.id_tienda',
        'b.especialidad',
        'b.anos_experiencia',
        'b.tarifa_base',
        'b.total_resenas',
        'b.activo',
        'b.createdAt',
        'b.updatedAt',
        'u.email',
        'u.nombre',
        'u.apellido',
        'u.telefono',
        'u.foto_perfil_url',
        db.raw('ISNULL(AVG(CAST(r.puntuacion AS FLOAT)), 0) as calificacion_promedio')
      )
  }

  /**
   * NUEVO (v1.1.0): Obtiene todos los servicios que ofrece un barbero
   * @param {number} id_barbero - ID del barbero
   * @returns {Promise<Array>} Array de servicios del barbero
   */
  async getServicios(id_barbero) {
    return db('ServicioBarbero')
      .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
      .where('ServicioBarbero.id_barbero', id_barbero)
      .where('ServicioBarbero.disponible', true)
      .select(
        'Servicio.id_servicio',
        'Servicio.nombre_servicio',
        'Servicio.descripcion',
        'Servicio.duracion_minutos',
        'Servicio.precio_base',
        'ServicioBarbero.id_servicio_barbero',
        'ServicioBarbero.precio_barbero',
        'ServicioBarbero.tiempo_servicio_minutos'
      )
  }

  /**
   * NUEVO (v1.1.0): Agrega un servicio al catálogo de un barbero
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   * @param {number} precio_barbero - Precio override (opcional)
   * @param {number} tiempo_servicio_minutos - Duración override (opcional)
   * @returns {Promise<number>} ID de la relación creada
   */
  async agregarServicio(id_barbero, id_servicio, precio_barbero = null, tiempo_servicio_minutos = null) {
    const [id] = await db('ServicioBarbero').insert({
      id_servicio,
      id_barbero,
      precio_barbero,
      tiempo_servicio_minutos,
      disponible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return id
  }

  /**
   * NUEVO (v1.1.0): Elimina un servicio del catálogo de un barbero
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   * @returns {Promise<number>} Número de filas eliminadas
   */
  async eliminarServicio(id_barbero, id_servicio) {
    return db('ServicioBarbero')
      .where('id_barbero', id_barbero)
      .where('id_servicio', id_servicio)
      .del()
  }

  /**
   * NUEVO (v1.1.0): Verifica si un barbero puede hacer un servicio específico
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   * @returns {Promise<boolean>} true si el barbero ofrece el servicio
   */
  async puedeMakerServicio(id_barbero, id_servicio) {
    const result = await db('ServicioBarbero')
      .where('id_barbero', id_barbero)
      .where('id_servicio', id_servicio)
      .where('disponible', true)
      .first()
    return !!result
  }

  /**
   * NUEVO (v1.1.0): Obtiene el precio efectivo de un servicio para un barbero
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   * @returns {Promise<number>} Precio a cobrar (precio_barbero o precio_base)
   */
  async getPrecioServicio(id_barbero, id_servicio) {
    const result = await db('ServicioBarbero')
      .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
      .where('ServicioBarbero.id_barbero', id_barbero)
      .where('ServicioBarbero.id_servicio', id_servicio)
      .select(
        db.raw('ISNULL(ServicioBarbero.precio_barbero, Servicio.precio_base) as precio_efectivo')
      )
      .first()
    return result ? result.precio_efectivo : null
  }

  /**
   * NUEVO (v1.1.0): Obtiene la duración efectiva de un servicio para un barbero
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   * @returns {Promise<number>} Duración en minutos (tiempo_servicio_minutos o duracion_minutos)
   */
  async getDuracionServicio(id_barbero, id_servicio) {
    const result = await db('ServicioBarbero')
      .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
      .where('ServicioBarbero.id_barbero', id_barbero)
      .where('ServicioBarbero.id_servicio', id_servicio)
      .select(
        db.raw('ISNULL(ServicioBarbero.tiempo_servicio_minutos, Servicio.duracion_minutos) as duracion_efectiva')
      )
      .first()
    return result ? result.duracion_efectiva : null
  }
}

module.exports = BarberoRepositoryImpl