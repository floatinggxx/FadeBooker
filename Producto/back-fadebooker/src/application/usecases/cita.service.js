const { enviarReserva } = require('../../infraestructure/automation/PowerAutomateService');

class CitaService {
  constructor(citaRepository, servicioRepository, usuarioRepository) {
    this.citaRepository = citaRepository;
    this.servicioRepository = servicioRepository;
    this.usuarioRepository = usuarioRepository;
  }

  async crearCita(data) {
    // 1. Validar que el barbero puede realizar el servicio
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
        const nuevoClienteData = {
          nombre: data.cliente_nombre.split(' ')[0] || 'Cliente',
          apellido: data.cliente_nombre.split(' ').slice(1).join(' ') || 'Manual',
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

    // 6. Enviar a Power Automate (Notificación de agendamiento)
    if (id_cita) {
      try {
        await this.enviarReservaPowerAutomate(id_cita)
      } catch (error) {
        console.error('Error al enviar reserva inicial a Power Automate:', error.message)
      }
    }

    // Retornamos el ID o el objeto completo si fuera necesario
    return id_cita;
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

    if (estado.toLowerCase() === 'confirmada') {
      try {
        await this.enviarReservaPowerAutomate(id)
      } catch (error) {
        console.error('Error al enviar reserva a Power Automate:', error.message)
      }
    }

    return result
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
    return this.citaRepository.findByBarbero(id_barbero, fecha, period)
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
    const fechaHora = `${fecha}T${hora}`
    return this.citaRepository.verificarDisponibilidad(idBarbero, fechaHora, duracion)
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
