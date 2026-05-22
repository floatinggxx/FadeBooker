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
    console.log('--- DEBUG: Entrando a CitaRepositoryImpl.create (SQL RAW) ---');
    console.log('--- Datos recibidos:', data);
    // Solución específica para Azure SQL con Triggers: 
    // Usar query raw para evitar que Knex agregue "OUTPUT INSERTED.id_cita"
    const result = await this.db.raw(`
      DECLARE @InsertedTable TABLE (id_cita INT);
      INSERT INTO [dbo].[Cita] (id_cliente, id_barbero, id_servicio, id_tienda, fecha_hora_inicio, duracion_minutos, estado, monto_total, pago_abono, metodo_pago, notas)
      OUTPUT INSERTED.id_cita INTO @InsertedTable
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      SELECT id_cita FROM @InsertedTable;
    `, [
      data.id_cliente, 
      data.id_barbero, 
      data.id_servicio, 
      data.id_tienda, 
      data.fecha_hora_inicio, 
      data.duracion_minutos || 30, 
      data.estado || 'confirmada', 
      data.monto_total, 
      data.pago_abono || 0, 
      (data.metodo_pago || 'efectivo').toLowerCase(), 
      data.notas || ''
    ]);
    
    console.log('--- Resultado RAW (OUTPUT INTO):', JSON.stringify(result));
    
    // En MSSQL con Knex y mssql driver, el resultado suele ser un array simple para SELECT
    let id_cita = null;
    if (result && Array.isArray(result) && result.length > 0) {
      id_cita = result[0].id_cita;
    } else if (result && result[0] && Array.isArray(result[0]) && result[0].length > 0) {
      id_cita = result[0][0].id_cita;
    }
    
    if (id_cita === null || id_cita === undefined) {
      console.error('--- FALLO AL OBTENER ID_CITA. Estructura:', result);
      throw new Error('No se pudo obtener el ID de la cita insertada');
    }
    
    return id_cita;
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
    return this.db('Cita as c')
      .leftJoin('Barbero as b', 'c.id_barbero', 'b.id_barbero')
      .leftJoin('Usuario as u', 'b.id_usuario', 'u.id_usuario')
      .leftJoin('Servicio as s', 'c.id_servicio', 's.id_servicio')
      .where('c.id_cliente', id_cliente)
      .select(
        'c.*',
        'u.nombre as barbero_nombre',
        'u.apellido as barbero_apellido',
        's.nombre_servicio as servicio_nombre'
      )
      .orderBy('c.fecha_hora_inicio', 'desc')
  }

  async findByBarbero(id_barbero, fecha = null, period = 'day') {
    const query = this.db('Cita as c')
      .leftJoin('Usuario as u_c', 'c.id_cliente', 'u_c.id_usuario')
      .leftJoin('Servicio as s', 'c.id_servicio', 's.id_servicio')
      .where('c.id_barbero', id_barbero)
    
    if (fecha) {
      const fechaLimpia = (typeof fecha === 'string') ? fecha.split('T')[0] : new Date(fecha).toISOString().split('T')[0];
      query.whereRaw('CAST(c.fecha_hora_inicio AS DATE) = ?', [fechaLimpia])
    } else {
      if (period === 'day') {
        query.whereRaw('CAST(c.fecha_hora_inicio AS DATE) = CAST(GETDATE() AS DATE)');
      } else if (period === 'week') {
        query.whereRaw('c.fecha_hora_inicio >= DATEADD(day, -7, GETDATE())');
      } else if (period === 'month') {
        query.whereRaw('c.fecha_hora_inicio >= DATEADD(month, -1, GETDATE())');
      }
    }

    return query.select(
      'c.*',
      'u_c.nombre as cliente_nombre',
      'u_c.apellido as cliente_apellido',
      's.nombre_servicio as servicio_nombre'
    ).orderBy('c.fecha_hora_inicio', 'desc')
  }

  async findByTienda(id_tienda, fecha = null, period = 'day') {
    const query = this.db('Cita as c')
      .leftJoin('Usuario as u_c', 'c.id_cliente', 'u_c.id_usuario')
      .leftJoin('Barbero as b', 'c.id_barbero', 'b.id_barbero')
      .leftJoin('Usuario as u_b', 'b.id_usuario', 'u_b.id_usuario')
      .leftJoin('Servicio as s', 'c.id_servicio', 's.id_servicio')
      .where('c.id_tienda', id_tienda)
    
    if (fecha) {
      const fechaLimpia = (typeof fecha === 'string') ? fecha.split('T')[0] : new Date(fecha).toISOString().split('T')[0];
      query.whereRaw('CAST(c.fecha_hora_inicio AS DATE) = ?', [fechaLimpia])
    } else {
      if (period === 'day') {
        query.whereRaw('CAST(c.fecha_hora_inicio AS DATE) = CAST(GETDATE() AS DATE)');
      } else if (period === 'week') {
        query.whereRaw('c.fecha_hora_inicio >= DATEADD(day, -7, GETDATE())');
      } else if (period === 'month') {
        query.whereRaw('c.fecha_hora_inicio >= DATEADD(month, -1, GETDATE())');
      }
    }

    return query.select(
      'c.*',
      'u_c.nombre as cliente_nombre',
      'u_c.apellido as cliente_apellido',
      'u_b.nombre as barbero_nombre',
      'u_b.apellido as barbero_apellido',
      's.nombre_servicio as servicio_nombre'
    ).orderBy('c.fecha_hora_inicio', 'desc')
  }

  async findAll() {
    return this.db('Cita as c')
      .leftJoin('Usuario as u_c', 'c.id_cliente', 'u_c.id_usuario')
      .leftJoin('Barbero as b', 'c.id_barbero', 'b.id_barbero')
      .leftJoin('Usuario as u_b', 'b.id_usuario', 'u_b.id_usuario')
      .leftJoin('Servicio as s', 'c.id_servicio', 's.id_servicio')
      .select(
        'c.*',
        'u_c.nombre as cliente_nombre',
        'u_c.apellido as cliente_apellido',
        'u_b.nombre as barbero_nombre',
        'u_b.apellido as barbero_apellido',
        's.nombre_servicio as servicio_nombre'
      )
      .orderBy('c.fecha_hora_inicio', 'desc')
  }

  async getStats(id_barbero, period = 'day') {
    let query = this.db('Cita')
      .where({ id_barbero })
      .whereIn('estado', ['confirmada', 'completada']);

    if (period === 'day') {
      query.whereRaw('CAST(fecha_hora_inicio AS DATE) = CAST(GETDATE() AS DATE)');
    } else if (period === 'week') {
      query.whereRaw('fecha_hora_inicio >= DATEADD(day, -7, GETDATE())');
    } else if (period === 'month') {
      query.whereRaw('fecha_hora_inicio >= DATEADD(month, -1, GETDATE())');
    }

    const result = await query.select(
      this.db.raw('SUM(monto_total) as ingresos'),
      this.db.raw('COUNT(*) as totalServicios')
    ).first();

    return {
      ingresos: result?.ingresos || 0,
      totalServicios: result?.totalServicios || 0,
      period
    };
  }

  async verificarDisponibilidad(id_barbero, fecha_hora_inicio, duracion_minutos) {
    const inicio = new Date(fecha_hora_inicio);
    const fin = new Date(inicio.getTime() + duracion_minutos * 60000);
    
    // Convertir a formato compatible con SQL
    const inicioStr = inicio.toISOString().replace('T', ' ').substring(0, 19);
    const finStr = fin.toISOString().replace('T', ' ').substring(0, 19);

    const solapamientos = await this.db('Cita')
      .where('id_barbero', id_barbero)
      .whereIn('estado', ['confirmada', 'no_presentado', 'completada'])
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

  async autoCompletarCitasVencidas() {
    return this.db('Cita')
      .where('estado', 'confirmada')
      .whereRaw('DATEADD(minute, duracion_minutos, fecha_hora_inicio) < GETDATE()')
      .update({
        estado: 'completada',
        updatedAt: this.db.raw('GETDATE()')
      });
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
        'cliente.telefono as cliente_telefono',
        'barbero_usuario.nombre as barbero_nombre',
        'barbero_usuario.email as barbero_email',
        'Servicio.nombre_servicio',
        'Tienda.nombre_tienda'
      )
      .first()
  }

  /**
   * Obtiene estadísticas para el dashboard
   */
  async getDashboardStats(id_tienda) {
    const hoy = new Date();
    const hoyISO = hoy.toISOString().split('T')[0];

    // 1. Ingresos de hoy (confirmadas o finalizadas)
    const ingresos = await this.db('Cita')
      .where('id_tienda', id_tienda)
      .whereRaw("CONVERT(DATE, fecha_hora_inicio) = ?", [hoyISO])
      .whereIn('estado', ['confirmada', 'finalizado', 'completada'])
      .sum('monto_total as total');

    // 2. Servicios de hoy
    const serviciosCount = await this.db('Cita')
      .where('id_tienda', id_tienda)
      .whereRaw("CONVERT(DATE, fecha_hora_inicio) = ?", [hoyISO])
      .count('id_cita as total');

    // 3. Próxima cita
    const proxima = await this.db('Cita')
      .join('Usuario as cliente', 'Cita.id_cliente', '=', 'cliente.id_usuario')
      .join('Servicio', 'Cita.id_servicio', '=', 'Servicio.id_servicio')
      .where('Cita.id_tienda', id_tienda)
      .where('Cita.fecha_hora_inicio', '>=', hoy.toISOString())
      .where('Cita.estado', 'confirmada')
      .orderBy('Cita.fecha_hora_inicio', 'asc')
      .select(
        'Cita.fecha_hora_inicio',
        'cliente.nombre as cliente_nombre',
        'Servicio.nombre_servicio'
      )
      .first();

    return {
      ingresosHoy: ingresos[0].total || 0,
      serviciosHoy: serviciosCount[0].total || 0,
      proximaCita: proxima || null
    };
  }

  /**
   * Sincroniza estados de citas antiguas
   */
  async syncStatuses() {
    const ahora = new Date();
    const haceUnaHora = new Date(ahora.getTime() - (60 * 60 * 1000));

    // Citas que pasaron hace más de una hora y siguen como 'confirmada' -> 'completada'
    const actualizados = await this.db('Cita')
      .where('estado', 'confirmada')
      .where('fecha_hora_inicio', '<', haceUnaHora.toISOString())
      .update({ estado: 'completada' }); // Cambiamos a 'completada' que es el estado permitido por el CHECK constraint

    return actualizados;
  }
}

module.exports = CitaRepositoryImpl