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
          const [newUserId] = await trx('Usuario').insert(usuarioData)
          id_usuario = newUserId.id_usuario || newUserId
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

      const [id_barbero] = await trx('Barbero').insert(barberoData)
      
      await trx.commit()
      return id_barbero.id_barbero || id_barbero
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
    return db('Cita')
      .where({ id_barbero })
      .whereBetween('fecha_hora_inicio', [
        `${fecha} 00:00:00`,
        `${fecha} 23:59:59`
      ])
      .whereIn('estado', ['confirmada', 'en_progreso'])
      .select('id_cita', 'fecha_hora_inicio', 'duracion_minutos', 'estado')
  }

  async findByTienda(id_tienda) {
    return db('Barbero')
      .leftJoin('Usuario', 'Barbero.id_usuario', '=', 'Usuario.id_usuario')
      .where({ 'Barbero.id_tienda': id_tienda, 'Barbero.activo': true })
      .orderBy('Usuario.nombre')
      .select(
        'Barbero.id_barbero',
        'Usuario.nombre',
        'Usuario.apellido',
        'Usuario.email',
        'Barbero.especialidad',
        'Usuario.foto_perfil_url',
        'Barbero.calificacion_promedio'
      )
  }

  async findAll() {
    return db('Barbero')
      .leftJoin('Usuario', 'Barbero.id_usuario', '=', 'Usuario.id_usuario')
      .where({ 'Barbero.activo': true })
      .orderBy('Usuario.nombre')
      .select(
        'Barbero.*',
        'Usuario.email',
        'Usuario.nombre',
        'Usuario.apellido',
        'Usuario.telefono',
        'Usuario.foto_perfil_url'
      )
  }

  async findById(id_barbero) {
    return db('Barbero')
      .leftJoin('Usuario', 'Barbero.id_usuario', '=', 'Usuario.id_usuario')
      .where('Barbero.id_barbero', id_barbero)
      .first()
      .select(
        'Barbero.*',
        'Usuario.email',
        'Usuario.nombre',
        'Usuario.apellido',
        'Usuario.telefono',
        'Usuario.foto_perfil_url'
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