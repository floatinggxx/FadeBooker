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
    console.log('--- Datos recibidos:', JSON.stringify(data));
    
    // Normalizar fecha para SQL Server (YYYY-MM-DD HH:mm:ss)
    const fechaSQL = data.fecha_hora_inicio.replace('T', ' ').substring(0, 19);
    
    // El estado inicial debe ser compatible con el CHECK constraint del Azure SQL
    // CHK_Cita_Estado CHECK (estado IN ('confirmada', 'cancelada', 'completada', 'no_presentado', 'pendiente'))
    const estadoInicial = data.estado || 'pendiente';

    // Solución específica para Azure SQL con Triggers: 
    // Usar query raw para evitar que Knex agregue "OUTPUT INSERTED.id_cita"
    let result;
    try {
      result = await this.db.raw(`
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
        fechaSQL, 
        data.duracion_minutos || 30, 
        estadoInicial, 
        data.monto_total || 0, 
        data.pago_abono || 0, 
        (data.metodo_pago || 'mercadopago').toLowerCase(), 
        data.notas || ''
      ]);
    } catch (error) {
      console.error('--- ERROR en insert Cita:', error.message || error);
      if (error.message && /CHK_.*(Estado|estado|CitaEstado)/i.test(error.message)) {
        throw new Error('La base de datos no acepta el estado "pendiente" para una nueva cita. Aplica la migración de esquema que actualiza el CHECK constraint de la tabla Cita para soportar este estado.');
      }
      throw error;
    }
    
    console.log('--- Resultado RAW (OUTPUT INTO):', JSON.stringify(result));
    
    // Extracción ultra-robusta del ID para SQL Server (Tedious/Knex)
    let id_cita = null;
    
    const findIdInObject = (obj) => {
      if (!obj) return null;
      if (typeof obj !== 'object') return null;
      
      // Búsqueda directa (evitar el valor 0 que a veces devuelve Azure como placeholder)
      if (obj.id_cita && typeof obj.id_cita === 'number' && obj.id_cita > 0) return obj.id_cita;
      
      // Búsqueda en arrays
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const found = findIdInObject(item);
          if (found) return found;
        }
      }
      
      // Búsqueda en sub-objetos (como recordset)
      if (obj.recordset) return findIdInObject(obj.recordset);
      
      // Caso especial Azure SQL: Si id_cita es 0, intentar buscar id_cita en otras props del objeto
      for (const key in obj) {
        if (key.toLowerCase() === 'id_cita' && obj[key] > 0) return obj[key];
        if (typeof obj[key] === 'object') {
           const found = findIdInObject(obj[key]);
           if (found) return found;
        }
      }
      
      return null;
    };

    id_cita = findIdInObject(result);
    
    // FALLBACK CRÍTICO: Si la BD devolvió 0 o nada, buscar la última cita creada para este cliente/barbero
    if (!id_cita || id_cita === 0) {
      console.log('--- ADVERTENCIA: ID 0 detectado, realizando búsqueda de respaldo ---');
      const ultimaCita = await this.db('Cita')
        .where({ id_cliente: data.id_cliente, id_barbero: data.id_barbero })
        .orderBy('id_cita', 'desc')
        .first();
      
      if (ultimaCita) {
        id_cita = ultimaCita.id_cita;
        console.log('--- ID Recuperado de búsqueda de respaldo:', id_cita);
      }
    }
    
    // Si aún no lo encontramos, escaneo por texto como último recurso
    if (!id_cita && result) {
       const strResult = JSON.stringify(result);
       const match = strResult.match(/"id_cita":\s*(\d+)/i);
       if (match && parseInt(match[1]) > 0) id_cita = parseInt(match[1]);
    }
    
    if (!id_cita) {
      console.error('--- ERROR CRÍTICO: No se pudo capturar id_cita del resultado SQL ---');
      console.error('Estructura recibida:', JSON.stringify(result, null, 2));
      throw new Error('La reserva se guardó en la base de datos, pero el sistema no pudo obtener el número de confirmación. Por favor, refresca la página de "Mis Citas" para verla.');
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
    
    let orderDirection = 'desc';

    if (fecha) {
      const fechaLimpia = (typeof fecha === 'string') ? fecha.split('T')[0] : new Date(fecha).toISOString().split('T')[0];
      query.whereRaw('CAST(c.fecha_hora_inicio AS DATE) = ?', [fechaLimpia])
      orderDirection = 'asc'; // Es una agenda del día
    } else {
      if (period === 'day') {
        query.whereRaw('CAST(c.fecha_hora_inicio AS DATE) = CAST(GETDATE() AS DATE)');
        orderDirection = 'asc'; // Agenda de hoy
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
    ).orderBy('c.fecha_hora_inicio', orderDirection)
  }

  async findByTienda(id_tienda, fecha = null, period = 'day') {
    const query = this.db('Cita as c')
      .leftJoin('Usuario as u_c', 'c.id_cliente', 'u_c.id_usuario')
      .leftJoin('Barbero as b', 'c.id_barbero', 'b.id_barbero')
      .leftJoin('Usuario as u_b', 'b.id_usuario', 'u_b.id_usuario')
      .leftJoin('Servicio as s', 'c.id_servicio', 's.id_servicio')
      .where('c.id_tienda', id_tienda)
    
    let orderDirection = 'desc';

    if (fecha) {
      const fechaLimpia = (typeof fecha === 'string') ? fecha.split('T')[0] : new Date(fecha).toISOString().split('T')[0];
      query.whereRaw('CAST(c.fecha_hora_inicio AS DATE) = ?', [fechaLimpia])
      orderDirection = 'asc';
    } else {
      if (period === 'day') {
        query.whereRaw('CAST(c.fecha_hora_inicio AS DATE) = CAST(GETDATE() AS DATE)');
        orderDirection = 'asc';
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
    ).orderBy('c.fecha_hora_inicio', orderDirection)
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
      .where(function() {
        this.whereIn('estado', ['confirmada', 'completada'])
          .orWhere('estado_pago', 'pagado')
      });

    if (period === 'day') {
      query.whereRaw('CAST(fecha_hora_inicio AS DATE) = CAST(GETDATE() AS DATE)');
    } else if (period === 'week') {
      query.whereRaw('fecha_hora_inicio >= DATEADD(day, -7, GETDATE())');
    } else if (period === 'month') {
      query.whereRaw('fecha_hora_inicio >= DATEADD(month, -1, GETDATE())');
    }

    const result = await query.select(
      this.db.raw('ISNULL(SUM(pago_abono), 0) as ingresos'),
      this.db.raw('COUNT(*) as totalServicios')
    ).first();

    // Obtener tendencia diaria para el periodo
    let trendQuery = this.db('Cita')
      .where({ id_barbero })
      .where(function() {
        this.whereIn('estado', ['confirmada', 'completada'])
          .orWhere('estado_pago', 'pagado')
      });

    if (period === 'day') {
      trendQuery.whereRaw('CAST(fecha_hora_inicio AS DATE) = CAST(GETDATE() AS DATE)');
    } else if (period === 'week') {
      trendQuery.whereRaw('fecha_hora_inicio >= DATEADD(day, -7, GETDATE())');
    } else if (period === 'month') {
      trendQuery.whereRaw('fecha_hora_inicio >= DATEADD(month, -1, GETDATE())');
    }

    const trend = await trendQuery
      .select(this.db.raw('CAST(fecha_hora_inicio AS DATE) as fecha'))
      .sum('monto_total as ingresos')
      .groupByRaw('CAST(fecha_hora_inicio AS DATE)')
      .orderBy('fecha', 'asc');

    return {
      ingresos: result?.ingresos || 0,
      totalServicios: result?.totalServicios || 0,
      period,
      trend
    };
  }

  async verificarDisponibilidad(id_barbero, fecha_hora_inicio, duracion_minutos) {
    const inicio = new Date(fecha_hora_inicio);
    const fin = new Date(inicio.getTime() + duracion_minutos * 60000);
    
    // Convertir a formato compatible con SQL (YYYY-MM-DD HH:mm:ss)
    const inicioStr = inicio.toISOString().replace('T', ' ').substring(0, 19);
    const finStr = fin.toISOString().replace('T', ' ').substring(0, 19);

    console.log(`[Disponibilidad] Verificando para barbero ${id_barbero} entre ${inicioStr} y ${finStr}`);

    const solapamientos = await this.db('Cita')
      .where('id_barbero', id_barbero) // FILTRO CRÍTICO POR BARBERO
      .whereIn('estado', ['confirmada', 'no_presentado', 'completada', 'pendiente'])
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
      });

    console.log(`[Disponibilidad] Solapamientos encontrados para barbero ${id_barbero}:`, solapamientos.length);
    return solapamientos.length === 0;
  }

  async findAll() {
    return this.db('Cita').orderBy('fecha_hora_inicio', 'desc').select()
  }

  async update(id, data) {
    return this.db('Cita').where({ id_cita: id }).update(data)
  }

  async registrarAuditoriaCancelacion(data) {
    return this.db('AuditoriaCancelacion').insert({
      id_cita: data.id_cita,
      cancelada_por: data.cancelada_por,
      motivo_cancelacion: data.motivo_cancelacion,
      ofrecer_reembolso: data.ofrecer_reembolso,
      porcentaje_reembolso: data.porcentaje_reembolso,
      fecha_cancelacion: this.db.raw('GETDATE()')
    });
  }

  async registrarPagoEfectivo(id) {
    // 1. Obtener la cita para conocer el monto total
    const cita = await this.db('Cita').where({ id_cita: id }).first();
    if (!cita) throw new Error('Cita no encontrada');

    // 2. Actualizar estado_pago a 'pagado' y pago_abono al total (ya que se pagó completo)
    // Además, cambiar estado a 'confirmada' al estar ya pagada
    return this.db('Cita').where({ id_cita: id }).update({
      estado: 'confirmada',
      estado_pago: 'pagado',
      pago_abono: cita.monto_total,
      metodo_pago: 'Efectivo',
      updatedAt: this.db.raw('GETDATE()')
    });
  }

  async autoCompletarCitasVencidas() {
    return this.db('Cita')
      .where('estado', 'confirmada') // SOLO completar las pagadas (confirmadas)
      // Solo completar si ya pasó el tiempo de inicio + duración del servicio
      .whereRaw('DATEADD(minute, duracion_minutos, fecha_hora_inicio) <= GETDATE()')
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

    // 1. Ingresos de hoy (confirmadas o completadas)
    const ingresos = await this.db('Cita')
      .where('id_tienda', id_tienda)
      .whereRaw("CONVERT(DATE, fecha_hora_inicio) = ?", [hoyISO])
      .whereIn('estado', ['confirmada', 'completada'])
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
      .whereIn('Cita.estado', ['confirmada', 'pendiente'])
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
      proximaCita: proxima || null,
      ingresos: ingresos[0].total || 0, // Aliases para compatibilidad frontend
      totalServicios: serviciosCount[0].total || 0
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