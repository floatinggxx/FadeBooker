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

  async obtenerBarberosPorTienda(id_tienda) {
    return this.barberoRepository.findByTienda(id_tienda)
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
    const fin = 21;   // Extender a 21:00 para más flexibilidad
    
    for (let hora = inicio; hora < fin; hora++) {
      for (let min of ['00', '30']) {
        const slotHora = hora;
        const slotMin = parseInt(min);
        const slotDate = new Date(`${fecha}T${slotHora.toString().padStart(2, '0')}:${min}:00`);
        const slotTime = slotDate.getTime();
        
        // Un slot de 30 min está ocupado si alguna cita se solapa con él
        const citaOcupante = citas.find(cita => {
          const citaInicio = new Date(cita.fecha_hora_inicio).getTime();
          const citaFin = citaInicio + (cita.duracion_minutos || 30) * 60000;
          const slotFin = slotTime + 30 * 60000;

          // Solapamiento: (SlotInicio < CitaFin) AND (SlotFin > CitaInicio)
          return (slotTime < citaFin) && (slotFin > citaInicio);
        });

        slots.push({
          hora: `${hora.toString().padStart(2, '0')}:${min}:00`,
          disponible: !citaOcupante,
          detalle: citaOcupante ? `Cita ${citaOcupante.estado}` : null
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
   * NUEVO (v1.5.0): Actualiza la foto de un barbero (Cloudinary)
   * @param {number} id - ID del barbero
   * @param {string} base64Image - Imagen en formato base64
   */
  async actualizarFoto(id, base64Image) {
    try {
      const CloudinaryService = require('../../infraestructure/storage/CloudinaryService');
      const result = await CloudinaryService.uploadImage(base64Image, 'fadebooker/barberos');
      
      await this.barberoRepository.actualizar(id, { 
        foto_perfil_url: result.secure_url 
      });

      return {
        status: 'success',
        fotoUrl: result.secure_url
      };
    } catch (error) {
      throw new Error(`Error al subir foto de barbero: ${error.message}`);
    }
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

  async actualizarFoto(id, base64Image) {
    const CloudinaryService = require('../../infraestructure/storage/CloudinaryService');
    try {
      const result = await CloudinaryService.uploadImage(base64Image, 'fadebooker/barberos');
      await this.barberoRepository.update(id, { fotoUrl: result.secure_url });
      return { fotoUrl: result.secure_url };
    } catch (error) {
      console.error('--- ERROR EN BARBERO SERVICE (UPLOAD FOTO) ---');
      console.error(error);
      throw new Error(`Error al procesar la imagen del barbero: ${error.message}`);
    }
  }
}

module.exports = BarberoService
