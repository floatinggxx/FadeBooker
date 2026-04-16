const db = require('../../db/knex')

/**
 * CitaRepositoryImpl
 * 
 * ACTUALIZADO (v1.1.0):
 * - Agregado método validarServicioBarbero() para verificar que barbero puede hacer el servicio
 * - Mejora de verificarDisponibilidad para usar lógica correcta con Knex
 */
class CitaRepositoryImpl {
  constructor() {
    this.db = db
  }

  async create(data) {
    const [id] = await this.db('Cita').insert(data).returning('id_cita')
    return id
  }

  async findById(id) {
    return this.db('Cita').where({ id_cita: id }).first()
  }

  async findByClienteId(id_cliente) {
    return this.db('Cita').where({ id_cliente }).orderBy('fecha_hora_inicio', 'desc').select()
  }

  async findByBarberoId(id_barbero) {
    return this.db('Cita').where({ id_barbero }).orderBy('fecha_hora_inicio', 'desc').select()
  }

  async findByCliente(id_cliente) {
    return this.db('Cita').where({ id_cliente }).orderBy('fecha_hora_inicio', 'desc').select()
  }

  async findByBarbero(id_barbero) {
    return this.db('Cita').where({ id_barbero }).orderBy('fecha_hora_inicio', 'desc').select()
  }

  async verificarDisponibilidad(id_barbero, fecha_hora_inicio, duracion_minutos) {
    const fecha_hora_fin = new Date(new Date(fecha_hora_inicio).getTime() + duracion_minutos * 60000)
    return this.db('Cita')
      .where({ id_barbero })
      .whereIn('estado', ['confirmada', 'completada'])
      .where(kb => {
        kb.whereBetween('fecha_hora_inicio', [fecha_hora_inicio, fecha_hora_fin])
          .orWhere(function() {
            this.where('fecha_hora_inicio', '<', fecha_hora_fin)
              .andWhere(this.db.raw('DATEADD(minute, duracion_minutos, fecha_hora_inicio) > ?', [fecha_hora_inicio]))
          })
      })
      .select()
  }

  async findAll() {
    return this.db('Cita').orderBy('fecha_hora_inicio', 'desc').select()
  }

  async update(id, data) {
    return this.db('Cita').where({ id_cita: id }).update(data)
  }

  async delete(id) {
    return this.db('Cita').where({ id_cita: id }).del()
  }

  async findByFecha(fecha) {
    return this.db('Cita')
      .where('fecha_hora_inicio', '>=', fecha)
      .andWhere('fecha_hora_inicio', '<', fecha + ' 23:59:59')
      .select()
  }

  async findByEstado(estado) {
    return this.db('Cita').where({ estado }).select()
  }

  /**
   * NUEVO (v1.1.0): Valida que un barbero puede hacer un servicio específico
   * Verifica que existe relación en tabla ServicioBarbero
   * 
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   * @returns {Promise<boolean>} true si el barbero puede hacer el servicio
   */
  async validarServicioBarbero(id_barbero, id_servicio) {
    const result = await this.db('ServicioBarbero')
      .where('id_barbero', id_barbero)
      .where('id_servicio', id_servicio)
      .where('disponible', true)
      .first()
    return !!result
  }

  /**
   * NUEVO (v1.1.0): Obtiene información completa de una cita con detalles de servicio y barbero
   * @param {number} id_cita - ID de la cita
   * @returns {Promise<Object>} Cita con información expandida
   */
  async findByIdConDetalles(id_cita) {
    return this.db('Cita')
      .join('Usuario as cliente', 'Cita.id_cliente', '=', 'cliente.id_usuario')
      .join('Barbero', 'Cita.id_barbero', '=', 'Barbero.id_barbero')
      .join('Usuario as barbero_usuario', 'Barbero.id_usuario', '=', 'barbero_usuario.id_usuario')
      .join('Servicio', 'Cita.id_servicio', '=', 'Servicio.id_servicio')
      .join('Tienda', 'Cita.id_tienda', '=', 'Tienda.id_tienda')
      .where('Cita.id_cita', id_cita)
      .select(
        'Cita.*',
        'cliente.nombre as cliente_nombre',
        'cliente.email as cliente_email',
        'barbero_usuario.nombre as barbero_nombre',
        'barbero_usuario.email as barbero_email',
        'Servicio.nombre_servicio',
        'Tienda.nombre_tienda'
      )
      .first()
  }
}

module.exports = CitaRepositoryImpl