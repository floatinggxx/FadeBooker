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

  async findByBarbero(id_barbero, fecha = null) {
    const query = this.db('Cita').where({ id_barbero })
    if (fecha) {
      const fechaLimpia = fecha.split('T')[0]
      query.whereRaw('CAST(fecha_hora_inicio AS DATE) = ?', [fechaLimpia])
    }
    return query.orderBy('fecha_hora_inicio', 'desc').select()
  }

  async verificarDisponibilidad(id_barbero, fecha_hora_inicio, duracion_minutos) {
    const inicio = new Date(fecha_hora_inicio);
    const fin = new Date(inicio.getTime() + duracion_minutos * 60000);
    
    // Convertir a formato compatible con SQL
    const inicioStr = inicio.toISOString().replace('T', ' ').substring(0, 19);
    const finStr = fin.toISOString().replace('T', ' ').substring(0, 19);

    const solapamientos = await this.db('Cita')
      .where('id_barbero', id_barbero)
      .whereIn('estado', ['Confirmada', 'Pendiente'])
      .where(function() {
        this.where(function() {
          this.where('fecha_hora_inicio', '>=', inicioStr)
            .andWhere('fecha_hora_inicio', '<', finStr)
        })
        .orWhere(function() {
          this.whereRaw('DATEADD(minute, duracion_minutos, fecha_hora_inicio) > ?', [inicioStr])
            .andWhereRaw('DATEADD(minute, duracion_minutos, fecha_hora_inicio) <= ?', [finStr])
        })
        .orWhere(function() {
          this.where('fecha_hora_inicio', '<=', inicioStr)
            .andWhereRaw('DATEADD(minute, duracion_minutos, fecha_hora_inicio) >= ?', [finStr])
        })
      })
      .select('id_cita')

    return solapamientos.length === 0
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
    // Asegurarse de quitar la 'Z' o cualquier formato que confunda a MSSQL
    const fechaLimpia = fecha.split('T')[0] 
    return this.db('Cita')
      .whereRaw('CAST(fecha_hora_inicio AS DATE) = ?', [fechaLimpia])
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