class BarberoService {
  constructor(barberoRepository) {
    this.barberoRepository = barberoRepository;
  }

  async crearBarbero(data) {
    return this.barberoRepository.create(data)
  }

  async obtenerBarberoPorId(id) {
    return this.barberoRepository.findById(id)
  }

  async obtenerBarberoPorEmail(email) {
    return this.barberoRepository.findByEmail(email)
  }

  async buscarBarberosPorEspecialidad(especialidad) {
    return this.barberoRepository.findByEspecialidad(especialidad)
  }

  async obtenerTodosLosBarberos() {
    return this.barberoRepository.findAll()
  }

  async actualizarBarbero(id, data) {
    return this.barberoRepository.update(id, data)
  }

  async eliminarBarbero(id) {
    return this.barberoRepository.delete(id)
  }

  async actualizarHorarioBarbero(id_barbero, horario) {
    return this.barberoRepository.actualizarHorario(id_barbero, horario)
  }

  async obtenerDisponibilidadBarbero(id_barbero, fecha) {
    const citas = await this.barberoRepository.obtenerDisponibilidad(id_barbero, fecha);
    
    const slots = [];
    const inicio = 9; // 09:00
    const fin = 18;   // 18:00
    
    for (let hora = inicio; hora < fin; hora++) {
      for (let min of ['00', '30']) {
        const horaStr = `${hora.toString().padStart(2, '0')}:${min}:00`;
        const slotKey = `${hora.toString().padStart(2, '0')}:${min}`;
        
        const ocupado = citas.some(cita => {
          let citaHora = '';
          if (cita.fecha_hora_inicio instanceof Date) {
            citaHora = cita.fecha_hora_inicio.toTimeString().substring(0, 5);
          } else if (typeof cita.fecha_hora_inicio === 'string') {
            const timePart = cita.fecha_hora_inicio.includes('T') 
              ? cita.fecha_hora_inicio.split('T')[1] 
              : cita.fecha_hora_inicio.split(' ')[1];
            citaHora = timePart ? timePart.substring(0, 5) : '';
          }
          return citaHora === slotKey;
        });

        slots.push({
          hora: horaStr,
          disponible: !ocupado
        });
      }
    }
    
    return slots;
  }

  async obtenerServiciosPorBarbero(id_barbero) {
    return this.barberoRepository.obtenerServiciosPorBarbero(id_barbero)
  }

  /**
   * NUEVO (v1.1.0): Obtiene el catálogo de servicios de un barbero
   * @param {number} id_barbero - ID del barbero
   */
  async obtenerServiciosBarbero(id_barbero) {
    return this.barberoRepository.getServicios(id_barbero)
  }

  /**
   * NUEVO (v1.1.0): Agrega un servicio al catálogo de un barbero
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   * @param {number} precio_barbero - Precio override (opcional)
   * @param {number} tiempo_servicio_minutos - Duración override (opcional)
   */
  async agregarServicioBarbero(id_barbero, id_servicio, precio_barbero = null, tiempo_servicio_minutos = null) {
    return this.barberoRepository.agregarServicio(id_barbero, id_servicio, precio_barbero, tiempo_servicio_minutos)
  }

  /**
   * NUEVO (v1.1.0): Elimina un servicio del catálogo de un barbero
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   */
  async eliminarServicioBarbero(id_barbero, id_servicio) {
    return this.barberoRepository.eliminarServicio(id_barbero, id_servicio)
  }

  /**
   * NUEVO (v1.1.0): Verifica si un barbero puede hacer un servicio específico
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   */
  async puedeHacerServicio(id_barbero, id_servicio) {
    return this.barberoRepository.puedeMakerServicio(id_barbero, id_servicio)
  }

  /**
   * NUEVO (v1.1.0): Obtiene el precio efectivo de un servicio para un barbero
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   */
  async obtenerPrecioServicioBarbero(id_barbero, id_servicio) {
    return this.barberoRepository.getPrecioServicio(id_barbero, id_servicio)
  }

  /**
   * NUEVO (v1.1.0): Obtiene la duración efectiva de un servicio para un barbero
   * @param {number} id_barbero - ID del barbero
   * @param {number} id_servicio - ID del servicio
   */
  async obtenerDuracionServicioBarbero(id_barbero, id_servicio) {
    return this.barberoRepository.getDuracionServicio(id_barbero, id_servicio)
  }
}

module.exports = BarberoService
