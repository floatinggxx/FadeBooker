const { enviarReserva } = require('../../infraestructure/automation/PowerAutomateService');
const resenaRepo = require('../../infraestructure/database/ResenaRepositoryImpl');
const TelegramNotificationService = require('./telegramNotification.service');
const TelegramService = require('../../infraestructure/notifications/TelegramService');
const NotificationLogRepository = require('../../infraestructure/database/NotificationLogRepositoryImpl');
const NotificationPreferenceRepository = require('../../infraestructure/database/NotificationPreferenceRepositoryImpl');
const BloqueHorarioRepository = require('../../infraestructure/database/BloqueHorarioRepositoryImpl');
const BarberoRepository = require('../../infraestructure/database/BarberoRepositoryImpl');

class CitaService {
  constructor(citaRepository, servicioRepository, usuarioRepository, barberoRepository = new BarberoRepository()) {
    this.citaRepository = citaRepository;
    this.servicioRepository = servicioRepository;
    this.usuarioRepository = usuarioRepository;
    this.barberoRepository = barberoRepository;
    const notificationLogRepo = new NotificationLogRepository();
    const notificationPrefRepo = new NotificationPreferenceRepository();
    this.telegramNotificationService = new TelegramNotificationService(TelegramService, notificationLogRepo, notificationPrefRepo, usuarioRepository);
  }

  async crearCita(data) {
    // 1. Validar que el barbero puede realizar el servicio
    const barbero = await this.barberoRepository.findById(data.id_barbero)
    if (!barbero) {
      throw new Error('Barbero no encontrado')
    }
    if (!barbero.activo) {
      throw new Error('El barbero está inactivo y no puede recibir reservas')
    }

    const puedeHacerServicio = await this.citaRepository.validarServicioBarbero(data.id_barbero, data.id_servicio)
    if (!puedeHacerServicio) {
      throw new Error('El barbero no ofrece este servicio o no está disponible')
    }

    // 2. Manejo del cliente (si no viene id_cliente, buscar por email/tel o crear)
    let id_cliente = data.id_cliente
    if (!id_cliente && (data.cliente_email || data.cliente_telefono)) {
      // Buscar cliente existente
      let clienteExistente = null
      if (data.cliente_email) {
        clienteExistente = await this.usuarioRepository.findByEmail(data.cliente_email)
      }
      
      if (!clienteExistente && data.cliente_telefono) {
        // Asumiendo que tenemos un método findByTelefono o usando query directo
        const knex = require('../../db/knex')
        clienteExistente = await knex('Usuario').where({ telefono: data.cliente_telefono }).first()
      }

      if (clienteExistente) {
        id_cliente = clienteExistente.id_usuario
        console.log(`--- Dashboard: Cliente vinculado automáticamente (ID: ${id_cliente}) ---`)
      } else {
        // Crear cliente nuevo para reserva manual
        console.log('--- Dashboard: Creando nuevo cliente para reserva manual ---')
        const nombreCompleto = data.cliente_nombre ? String(data.cliente_nombre).trim() : '';
        const partesNombre = nombreCompleto ? nombreCompleto.split(' ').filter(Boolean) : [];
        const nombre = partesNombre[0] || 'Cliente';
        const apellido = partesNombre.slice(1).join(' ') || 'Manual';
        const nuevoClienteData = {
          nombre,
          apellido,
          email: data.cliente_email || `manual_${Date.now()}@fadebooker.com`,
          telefono: data.cliente_telefono || '',
          rol: 'Cliente',
          contrasena: 'fb_manual_access' // Contraseña por defecto o hash aleatorio
        }
        id_cliente = await this.usuarioRepository.create(nuevoClienteData)
      }
    }

    if (!id_cliente) {
      throw new Error('Es necesario identificar o crear un cliente para la cita')
    }

    // 3. Obtener duración del servicio (si no viene en data)
    let duracion = data.duracion_minutos
    if (!duracion) {
      const servicio = await this.servicioRepository.findById(data.id_servicio)
      duracion = servicio ? servicio.duracion_minutos : 30
    }

    // 4. Verificar disponibilidad (no solapamientos)
    // Validación: no permitir crear citas en el pasado
    const ahora = new Date();
    // Parsear la fecha/hora propuesta como LOCAL explicitamente para evitar diferencias de zona
    const raw = String(data.fecha_hora_inicio || '');
    const parts = raw.split(/[-T:\s]/).map(p => Number(p));
    let fechaInicioPropuesta;
    if (parts.length >= 6 && parts.every(p => !Number.isNaN(p))) {
      // parts: [YYYY, MM, DD, hh, mm, ss]
      fechaInicioPropuesta = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
    } else {
      fechaInicioPropuesta = new Date(raw);
    }

    if (isNaN(fechaInicioPropuesta.getTime())) {
      throw new Error('Fecha/hora inválida para la cita. Revise el formato.');
    }

    if (fechaInicioPropuesta.getTime() < ahora.getTime()) {
      throw new Error('No se puede crear una cita en el pasado. Por favor seleccione una fecha/hora válida.');
    }
    const esDisponible = await this.citaRepository.verificarDisponibilidad(
      data.id_barbero, 
      data.fecha_hora_inicio, 
      duracion
    )

    if (!esDisponible) {
      throw new Error('El barbero ya tiene una cita programada o no está disponible en este horario.')
    }

    // 5. Crear la cita (retorna el ID)
    const id_cita = await this.citaRepository.create({
      ...data,
      id_cliente, // Usamos el ID resuelto
      duracion_minutos: duracion,
      estado: data.estado || 'pendiente'
    })

    // Retornamos el ID o el objeto completo si fuera necesario
    return id_cita;
  }

  async crearResena(id_cita, resenaData) {
    // 1. Validar que la cita existe y está completada
    const cita = await this.citaRepository.findById(id_cita)
    if (!cita) {
      throw new Error('Cita no encontrada')
    }
    
    if (cita.estado.toLowerCase() !== 'completada') {
      throw new Error('Solo se pueden dejar reseñas en citas completadas')
    }
    
    // 2. Validar que no exista ya una reseña para esta cita
    const resenaExistente = await resenaRepo.getByCitaId(id_cita)
    if (resenaExistente) {
      throw new Error('Ya has dejado una reseña para esta cita')
    }
    
    // 3. Crear reseña vinculando automáticamente datos de la cita
    return await resenaRepo.create({
      id_cita,
      id_cliente: cita.id_cliente,
      id_barbero: cita.id_barbero,
      id_tienda: cita.id_tienda,
      puntuacion: resenaData.puntuacion,
      comentario: resenaData.comentario
    })
  }

  async actualizarEstado(id, estado, motivo = null) {
    // Validación: No se puede completar una cita que no ha ocurrido
    if (estado.toLowerCase() === 'completada') {
      const cita = await this.citaRepository.findById(id);
      if (!cita) {
        throw new Error('No se encontró la cita especificada.');
      }

      const ahora = new Date();
      const fechaCita = new Date(cita.fecha_hora_inicio);

      // Si la fecha de la cita es posterior a la hora actual, no permitir completar
      if (fechaCita > ahora) {
        throw new Error('No puedes marcar como completada una cita que aún no ha comenzado o es para una fecha futura.');
      }
    }

    const dataUpdate = { estado }
    const result = await this.citaRepository.update(id, dataUpdate)

    if (estado.toLowerCase() === 'completada') {
      try {
        const cita = await this.citaRepository.findById(id);
        if (cita && cita.id_cliente) {
          const usuario = await this.usuarioRepository.findById(cita.id_cliente);
          if (usuario) {
            // Regla: 50 puntos por cada cita completada satisfactoriamente (migracion 20260526)
            const puntosGanados = 50;
            const nuevosPuntos = (usuario.puntos_acumulados || 0) + puntosGanados;
            await this.usuarioRepository.update(cita.id_cliente, { puntos_acumulados: nuevosPuntos });
            console.log(`[Puntos] Usuario ${cita.id_cliente} gano ${puntosGanados} puntos de fidelizacion. Total: ${nuevosPuntos}`);
          }
        }
      } catch (error) {
        console.error('Error al actualizar puntos de fidelizacion:', error.message);
      }
    }

    if (estado.toLowerCase() === 'confirmada') {
      try {
        await this.enviarReservaPowerAutomate(id)
        // Enviar notificación por Telegram (si aplica)
        const msg = `Tu cita #${id} ha sido confirmada. Fecha: ${new Date().toISOString()}`;
        await this.telegramNotificationService.sendAppointmentNotification({ userId: null, appointmentId: id, type: 'confirmed', message: msg }).catch(err => console.error('[TelegramNotify] confirmada error', err.message));
      } catch (error) {
        console.error('Error al enviar reserva a Power Automate:', error.message)
      }
    }

    return result
  }

  async cancelarCita(id, motivo, cancelado_por) {
    const cita = await this.citaRepository.findById(id);
    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    if (cita.estado === 'cancelada') {
      throw new Error('La cita ya se encuentra cancelada');
    }

    const ahora = new Date();
    const fechaCita = new Date(cita.fecha_hora_inicio);
    const diffHoras = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    let ofrecer_reembolso = false;
    let porcentaje_reembolso = 0;

    // Política: > 8 horas = reembolso total del abono
    if (diffHoras > 8 && (cita.pago_abono || 0) > 0) {
      ofrecer_reembolso = true;
      porcentaje_reembolso = 100;
    }

    // Actualizar estado de la cita
    await this.citaRepository.update(id, { estado: 'cancelada' });

    // Procesar reembolso automático en Mercado Pago si aplica
    if (ofrecer_reembolso) {
      try {
        const PagoRepositoryImpl = require('../../infraestructure/database/PagoRepositoryImpl');
        const pagoRepository = new PagoRepositoryImpl();
        const pagos = await pagoRepository.findByCitaId(id);
        
        // Filtrar pagos que estén completados o aprobados
        const pagosExitosos = pagos.filter(p => p.estado_pago === 'completado' || p.estado_pago === 'approved');
        
        if (pagosExitosos.length > 0) {
          const { client, Refund } = require('../../config/mercadopago');
          const refundInstance = new Refund(client);
          
          for (const pago of pagosExitosos) {
            if (pago.referencia_transaccion) {
              console.log(`[MercadoPago Reembolso] Reembolsando pago #${pago.id_pago} (Transacción: ${pago.referencia_transaccion}) para cita #${id}`);
              await refundInstance.create({
                payment_id: String(pago.referencia_transaccion)
              });
              
              // Actualizar estado del pago localmente
              await pagoRepository.update(pago.id_pago, {
                estado_pago: 'reembolsado'
              });
            }
          }
          console.log(`[MercadoPago Reembolso] Reembolsos procesados exitosamente para cita #${id}`);
        }
      } catch (refundError) {
        console.error('[MercadoPago Reembolso] Error al procesar reembolso en Mercado Pago:', refundError.message || refundError);
      }
    }

    // Registrar en auditoría
    await this.citaRepository.registrarAuditoriaCancelacion({
      id_cita: id,
      cancelada_por: cancelado_por || cita.id_cliente,
      motivo_cancelacion: motivo || 'Cancelada por el usuario',
      ofrecer_reembolso: ofrecer_reembolso ? 1 : 0,
      porcentaje_reembolso
    });

    // Notificar cancelación por Telegram
    try {
      const msg = `Tu cita #${id} ha sido cancelada. Motivo: ${motivo || 'No especificado'}`;
      await this.telegramNotificationService.sendAppointmentNotification({ userId: cita.id_cliente, appointmentId: id, type: 'cancelled', message: msg });
    } catch (err) {
      console.error('[TelegramNotify] cancelada error', err.message);
    }

    return {
      mensaje: 'Cita cancelada exitosamente',
      reembolso: ofrecer_reembolso,
      porcentaje: porcentaje_reembolso
    };
  }

  async registrarPagoEfectivo(id) {
    return this.citaRepository.registrarPagoEfectivo(id);
  }

  async enviarReservaPowerAutomate(id_cita) {
    const cita = await this.citaRepository.findByIdConDetalles(id_cita)
    if (!cita) {
      throw new Error('No se encontró la cita para enviar a Power Automate')
    }

    const fechaHoraInicio = new Date(cita.fecha_hora_inicio)
    const fechaHoraFin = new Date(fechaHoraInicio.getTime() + (cita.duracion_minutos || 30) * 60000)

    const fecha = fechaHoraInicio.toISOString().split('T')[0]
    const hora = fechaHoraInicio.toISOString().split('T')[1].slice(0, 5)

    await enviarReserva({
      cliente: cita.cliente_nombre || '',
      telefono: cita.cliente_telefono || '',
      correo: cita.cliente_email || '',
      fecha,
      hora,
      fecha_hora_iso: fechaHoraInicio.toISOString(),
      fecha_hora_fin_iso: fechaHoraFin.toISOString(),
      duracion: cita.duracion_minutos || 30,
      servicio: cita.nombre_servicio || '',
      barbero: cita.barbero_nombre || '',
      tienda: cita.nombre_tienda || '',
      id_cita: cita.id_cita
    })
  }

  async obtenerCitaPorId(id) {
    return this.citaRepository.findById(id)
  }

  async obtenerCitasPorCliente(id_cliente) {
    return this.citaRepository.findByCliente(id_cliente)
  }

  async obtenerCitasPorBarbero(id_barbero, fecha = null, period = 'day') {
    await this.citaRepository.syncStatuses();

    // Obtener citas normales
    const citas = await this.citaRepository.findByBarbero(id_barbero, fecha, period)

    // Si se pidió una fecha específica (o period === 'day'), incluir bloques permanentes
    try {
      const bloqueRepo = new BloqueHorarioRepository();
      let bloques = []
      if (fecha) {
        bloques = await bloqueRepo.obtenerPorBarberoYFecha(id_barbero, fecha)
      } else if (period === 'day') {
        // obtener bloques del día actual
        const hoy = new Date().toISOString().split('T')[0]
        bloques = await bloqueRepo.obtenerPorBarberoYFecha(id_barbero, hoy)
      }

      // Mapear bloques al mismo formato que las citas para que clientes los vean como reservados
      const bloquesComoCitas = (bloques || []).map(b => {
        const inicio = new Date(b.fecha_hora_inicio)
        const fin = new Date(b.fecha_hora_fin)
        const duracion_minutos = Math.round((fin - inicio) / 60000)
        return {
          id_cita: `bloque_${b.id_bloque}`,
          id_cliente: null,
          id_barbero: b.id_barbero,
          id_servicio: null,
          id_tienda: null,
          fecha_hora_inicio: b.fecha_hora_inicio,
          duracion_minutos,
          estado: 'confirmada', // mostrar como reservado al cliente
          monto_total: 0,
          pago_abono: 0,
          notas: b.motivo || 'Bloqueo por barbero',
          motivo_bloque: b.motivo || null
        }
      })

      // Fusionar y ordenar por fecha_hora_inicio
      const combinado = [...(citas || []), ...bloquesComoCitas]
      combinado.sort((a, b) => new Date(a.fecha_hora_inicio) - new Date(b.fecha_hora_inicio))
      return combinado
    } catch (err) {
      console.error('[CitaService] Error incluyendo BloqueHorario:', err.message)
      return citas
    }
  }

  async obtenerCitasPorTienda(id_tienda, fecha = null, period = 'day') {
    await this.citaRepository.syncStatuses();
    return this.citaRepository.findByTienda(id_tienda, fecha, period)
  }

  async obtenerDashboardStats(id_tienda) {
    await this.citaRepository.syncStatuses();
    return this.citaRepository.getDashboardStats(id_tienda);
  }

  async obtenerTodasCitas() {
    return this.citaRepository.findAll()
  }

  async verificarDisponibilidad(idBarbero, fecha, hora, duracion) {
    const barbero = await this.barberoRepository.findById(idBarbero)
    if (!barbero) {
      throw new Error('Barbero no encontrado')
    }
    if (!barbero.activo) {
      return false
    }

    const fechaHora = `${fecha}T${hora}`

    // Primero verificar contra citas existentes
    const disponibleCitas = await this.citaRepository.verificarDisponibilidad(idBarbero, fechaHora, duracion)
    if (!disponibleCitas) return false

    // Luego verificar contra bloques permanentes
    try {
      const bloqueRepo = new BloqueHorarioRepository()
      const fechaSolo = fecha
      const bloques = await bloqueRepo.obtenerPorBarberoYFecha(idBarbero, fechaSolo)
      const inicio = new Date(fechaHora)
      const fin = new Date(inicio.getTime() + duracion * 60000)

      for (const b of (bloques || [])) {
        const bInicio = new Date(b.fecha_hora_inicio)
        const bFin = new Date(b.fecha_hora_fin)
        // si hay solapamiento
        if (!(fin <= bInicio || inicio >= bFin)) {
          return false
        }
      }
    } catch (err) {
      console.error('[CitaService] Error al verificar bloques para disponibilidad:', err.message)
    }

    return true
  }

  async obtenerCitaPorIdConDetalles(id) {
    return this.citaRepository.findByIdConDetalles(id)
  }

  async obtenerCitasDelCliente(id_cliente) {
    return this.citaRepository.findByClienteId(id_cliente)
  }

  async obtenerCitasDelBarbero(id_barbero) {
    return this.citaRepository.findByBarberoId(id_barbero)
  }

  async obtenerCitasPorEstado(estado) {
    return this.citaRepository.findByEstado(estado)
  }

  async eliminarCita(id) {
    return this.citaRepository.delete(id)
  }
}

module.exports = CitaService
