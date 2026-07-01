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
    const BloqueHorarioRepository = require('../../infraestructure/database/BloqueHorarioRepositoryImpl');
    const bloqueRepo = new BloqueHorarioRepository();

    const barbero = await this.barberoRepository.findById(id_barbero)
    if (!barbero) {
      throw new Error('Barbero no encontrado')
    }
    if (!barbero.activo) {
      throw new Error('El barbero está inactivo y no tiene disponibilidad')
    }

    const [citas, horarios, bloques] = await Promise.all([
      this.barberoRepository.obtenerDisponibilidad(id_barbero, fecha),
      this.barberoRepository.obtenerHorariosTienda(id_barbero),
      bloqueRepo.obtenerPorBarberoYFecha(id_barbero, fecha)
    ]);
    
    const slots = [];
    
    // Parsear horarios de la tienda
    const parseTimeField = (val) => {
      if (!val) return { h: 0, m: 0 };
      // Si es un objeto Date (Knex/tedious a veces devuelve Date), usar UTC para evitar shift local
      if (val instanceof Date) {
        return { h: val.getUTCHours(), m: val.getUTCMinutes() };
      }

      // Si viene en formato ISO '1970-01-01T09:00:00.000Z' o similar, extraer la parte T sin conversión
      if (typeof val === 'string' && val.includes('T')) {
        // Extraer la parte HH:MM:SS sin aplicar conversión de zona (evita shift UTC)
        const match = val.match(/T(\d{2}:\d{2}:\d{2})/);
        if (match && match[1]) {
          const parts = match[1].split(':').map(Number);
          return { h: parts[0] || 0, m: parts[1] || 0 };
        }
      }
      // Si viene en formato 'HH:MM:SS' o 'HH:MM'
      try {
        const parts = String(val).split(':');
        const h = parseInt(parts[0]);
        const m = parseInt(parts[1]) || 0;
        if (!isNaN(h)) return { h, m };
      } catch (e) {}
      return { h: 0, m: 0 };
    };

    // Debug: mostrar valor crudo recibido desde DB
    try {
      console.log('[Disponibilidad][DEBUG] raw horario_apertura:', horarios.horario_apertura, 'type:', typeof horarios.horario_apertura, 'isDate:', horarios.horario_apertura instanceof Date);
      console.log('[Disponibilidad][DEBUG] raw horario_cierre:', horarios.horario_cierre, 'type:', typeof horarios.horario_cierre, 'isDate:', horarios.horario_cierre instanceof Date);
      if (horarios.horario_apertura instanceof Date) console.log('[Disponibilidad][DEBUG] apertura getHours:', horarios.horario_apertura.getHours(), 'getUTCHours:', horarios.horario_apertura.getUTCHours());
      if (horarios.horario_cierre instanceof Date) console.log('[Disponibilidad][DEBUG] cierre getHours:', horarios.horario_cierre.getHours(), 'getUTCHours:', horarios.horario_cierre.getUTCHours());
    } catch (e) {}

    const { h: horaApertura, m: minApertura } = parseTimeField(horarios.horario_apertura);
    const { h: horaCierre, m: minCierre } = parseTimeField(horarios.horario_cierre);

    const startMinutes = horaApertura * 60 + minApertura;
    const endMinutes = horaCierre * 60 + minCierre;

    // (Logs temporales removidos)

    // Helper para parsear fechas sin depender del engine (evita problemas de timezone)
    const parseDateTime = (dateStr, timeStr) => {
      // dateStr: 'YYYY-MM-DD', timeStr: 'HH:MM:SS' or 'HH:MM'
      const [y, m, d] = dateStr.split('-').map(Number);
      const parts = (timeStr || '00:00:00').split(':').map(Number);
      const hh = parts[0] || 0;
      const mm = parts[1] || 0;
      const ss = parts[2] || 0;
      return new Date(y, m - 1, d, hh, mm, ss);
    };

    // Use 60-minute blocks (1-hour) per product requirement
    // If times look like UTC-shifted (apertura muy temprano), apply a local offset heuristic
    let adjustedHoraApertura = horaApertura;
    let adjustedHoraCierre = horaCierre;
    // Heurística: si apertura < 8 (probablemente UTC shift) y cierre está relativamente temprano, sumar +3 horas
    if (horaApertura < 8 && horaCierre <= 17) {
      adjustedHoraApertura = horaApertura + 3;
      adjustedHoraCierre = horaCierre + 3;
    }
    const adjustedStartMinutes = adjustedHoraApertura * 60 + minApertura;
    const adjustedEndMinutes = adjustedHoraCierre * 60 + minCierre;

    for (let totalMin = adjustedStartMinutes; totalMin < adjustedEndMinutes; totalMin += 60) {
      const hora = Math.floor(totalMin / 60);
      const min = totalMin % 60;
      const slotTimeStr = `${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;
      const slotDate = parseDateTime(fecha, slotTimeStr);
      const slotTime = slotDate.getTime();
      const slotFin = slotTime + 60 * 60000;
        
      // Verificar si hay una cita que solape con este slot
      const citaOcupante = citas.find(cita => {
        // Normalizar parseo de fecha/hora de la cita
        let citaInicio;
        if (typeof cita.fecha_hora_inicio === 'string') {
          // Soporta formatos 'YYYY-MM-DD HH:mm:ss' y 'YYYY-MM-DDTHH:mm:ss'
          const parts = cita.fecha_hora_inicio.replace('T', ' ').split(' ');
          const fechaPart = parts[0];
          const timePart = parts[1] || '00:00:00';
          citaInicio = parseDateTime(fechaPart, timePart).getTime();
        } else {
          citaInicio = new Date(cita.fecha_hora_inicio).getTime();
        }
        const citaFin = citaInicio + (cita.duracion_minutos || 30) * 60000;

        // Solapamiento: (SlotInicio < CitaFin) AND (SlotFin > CitaInicio)
        return (slotTime < citaFin) && (slotFin > citaInicio);
      });

      // Verificar si hay un bloque horario que solape con este slot
      const bloqueOcupante = (bloques || []).find(bloque => {
        // Normalizar parseo de bloques
        let bloqueInicio = new Date(bloque.fecha_hora_inicio).getTime();
        let bloqueFin = new Date(bloque.fecha_hora_fin).getTime();
        if (typeof bloque.fecha_hora_inicio === 'string') {
          const partsA = bloque.fecha_hora_inicio.replace('T', ' ').split(' ');
          bloqueInicio = parseDateTime(partsA[0], partsA[1] || '00:00:00').getTime();
        }
        if (typeof bloque.fecha_hora_fin === 'string') {
          const partsB = bloque.fecha_hora_fin.replace('T', ' ').split(' ');
          bloqueFin = parseDateTime(partsB[0], partsB[1] || '00:00:00').getTime();
        }

        // Solapamiento: (SlotInicio < BloqueFin) AND (SlotFin > BloqueInicio)
        return (slotTime < bloqueFin) && (slotFin > bloqueInicio);
      });

      // Considerar indisponible si el slot corresponde a una hora pasada
      const ahora = Date.now();
      const esPasado = slotFin <= ahora;
      const disponible = !citaOcupante && !bloqueOcupante && !esPasado;
      let detalle = null;
      
      if (citaOcupante) {
        detalle = `Cita ${citaOcupante.estado}`;
      } else if (bloqueOcupante) {
        detalle = `Bloqueado${bloqueOcupante.motivo ? ': ' + bloqueOcupante.motivo : ''}`;
      }

      slots.push({
        hora: slotTimeStr,
        disponible,
        detalle
      });
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
