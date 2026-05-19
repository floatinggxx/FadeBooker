const { enviarReserva } = require('../../infraestructure/automation/PowerAutomateService');

class CitaService {
  constructor(citaRepository, servicioRepository) {
    this.citaRepository = citaRepository;
    this.servicioRepository = servicioRepository;
  }

  async crearCita(data) {
    // 1. Validar que el barbero puede realizar el servicio
    const puedeHacerServicio = await this.citaRepository.validarServicioBarbero(data.id_barbero, data.id_servicio)
    if (!puedeHacerServicio) {
      throw new Error('El barbero no ofrece este servicio o no está disponible')
    }

    // 2. Obtener duración del servicio (si no viene en data)
    let duracion = data.duracion_minutos
    if (!duracion) {
      const servicio = await this.servicioRepository.findById(data.id_servicio)
      duracion = servicio ? servicio.duracion_minutos : 30
    }

    // 3. Verificar disponibilidad (no solapamientos)
    const esDisponible = await this.citaRepository.verificarDisponibilidad(
      data.id_barbero, 
      data.fecha_hora_inicio, 
      duracion
    )

    if (!esDisponible) {
      throw new Error('El horario seleccionado no está disponible para este barbero')
    }

    // 4. Crear la cita
    return this.citaRepository.create({
      ...data,
      duracion_minutos: duracion,
      estado: 'confirmada'
    })
  }

  async actualizarEstado(id, estado, motivo = null) {
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

  async enviarReservaPowerAutomate(id_cita) {
    const cita = await this.citaRepository.findByIdConDetalles(id_cita)
    if (!cita) {
      throw new Error('No se encontró la cita para enviar a Power Automate')
    }

    const fechaHora = new Date(cita.fecha_hora_inicio)
    const fecha = fechaHora.toISOString().split('T')[0]
    const hora = fechaHora.toISOString().split('T')[1].slice(0, 5)

    await enviarReserva({
      cliente: cita.cliente_nombre || '',
      telefono: cita.cliente_telefono || '',
      correo: cita.cliente_email || '',
      fecha,
      hora,
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

  async obtenerCitasPorBarbero(id_barbero, fecha = null) {
    return this.citaRepository.findByBarbero(id_barbero, fecha)
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
