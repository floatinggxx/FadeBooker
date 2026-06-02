const CitaRepository = require('../../../infraestructure/database/CitaRepositoryImpl');
const ServicioRepository = require('../../../infraestructure/database/ServicioRepositoryImpl');
const UsuarioRepository = require('../../../infraestructure/database/UsuarioRepositoryImpl');
const CitaService = require('../../../application/usecases/cita.service');

// Mantener instancias por defecto para compatibilidad si se requiere require simple, 
// pero el test usará el constructor.
const defaultCitaRepository = new CitaRepository();
const defaultServicioRepository = new ServicioRepository();
const defaultUsuarioRepository = new UsuarioRepository();
const defaultCitaService = new CitaService(defaultCitaRepository, defaultServicioRepository, defaultUsuarioRepository);

class CitaController {
  constructor(citaService = defaultCitaService) {
    this.citaService = citaService;
  }

  crear = async (req, res) => {
    try {
      const result = await this.citaService.crearCita(req.body)
      const idFinal = typeof result === 'object' ? result.id_cita : result;
      res.status(201).json({ id: idFinal, mensaje: 'Cita creada exitosamente' })
    } catch (error) {
      console.error('Error al crear cita:', error);
      let message = error.message;
      if (message.includes('DECLARE') || message.includes('INSERT INTO')) {
        if (message.includes('- ')) {
           message = message.split('- ').pop();
        } else {
           message = 'Error de base de datos al procesar la reserva';
        }
      }
      res.status(400).json({ error: message })
    }
  }

  cambiarEstado = async (req, res) => {
    try {
      const { id } = req.params
      const { estado, motivo_cancelacion } = req.body
      
      console.log(`[CitaController] Cambiando estado de cita ID=${id} a "${estado}"`);
      
      await this.citaService.actualizarEstado(id, estado, motivo_cancelacion)
      res.json({ mensaje: `Cita actualizada a estado: ${estado}` })
    } catch (error) {
      console.error(`[CitaController] Error al cambiar estado:`, error.message);
      res.status(400).json({ error: error.message })
    }
  }

  cancelar = async (req, res) => {
    try {
      const { id } = req.params;
      const { motivo, cancelado_por } = req.body; // cancelado_por es el ID del usuario que cancela

      console.log(`[CitaController] Cancelando cita ID=${id}`);
      const resultado = await this.citaService.cancelarCita(id, motivo, cancelado_por);
      res.json(resultado);
    } catch (error) {
      console.error(`[CitaController] Error al cancelar cita:`, error.message);
      res.status(400).json({ error: error.message });
    }
  }

  checkDisponibilidad = async (req, res) => {
    try {
      const { idBarbero, fecha, hora, duracion } = req.query
      if (!idBarbero || !fecha || !hora || !duracion) {
        return res.status(400).json({ error: 'Faltan parámetros: idBarbero, fecha, hora, duracion' })
      }
      const disponible = await this.citaService.verificarDisponibilidad(
        parseInt(idBarbero), 
        fecha, 
        hora, 
        parseInt(duracion)
      )
      res.json({ disponible })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  listar = async (req, res) => {
    try {
      const { clienteId, barberoId, tiendaId, fecha, period } = req.query
      
      // Intentar auto-completar citas si el repositorio lo permite
      // Nota: Aquí se accede al repo directamente o vía service. 
      // Para mantener compatibilidad con la lógica previa:
      try {
        if (this.citaService.citaRepository && this.citaService.citaRepository.autoCompletarCitasVencidas) {
           await this.citaService.citaRepository.autoCompletarCitasVencidas();
        }
      } catch (syncErr) {
        console.error('[CitaController] Error en sincronización de estados:', syncErr.message);
      }

      let citas
      if (clienteId !== undefined) {
        const id = parseInt(clienteId, 10)
        citas = await this.citaService.obtenerCitasPorCliente(id)
      } else if (barberoId !== undefined) {
        const id = parseInt(barberoId, 10)
        citas = await this.citaService.obtenerCitasPorBarbero(id, fecha, period)
      } else if (tiendaId !== undefined) {
        const id = parseInt(tiendaId, 10)
        citas = await this.citaService.obtenerCitasPorTienda(id, fecha, period)
      } else {
        citas = await this.citaService.obtenerTodasCitas()
      }

      res.status(200).json(citas)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  obtenerPorId = async (req, res) => {
    try {
      const { id } = req.params
      const cita = await this.citaService.obtenerCitaPorId(id)
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' })
      }
      res.json(cita)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  registrarPagoEfectivo = async (req, res) => {
    try {
      const { id } = req.params
      console.log(`[CitaController] Registrando pago en EFECTIVO para cita ID=${id}`);
      await this.citaService.registrarPagoEfectivo(id)
      res.json({ mensaje: 'Pago en efectivo registrado correctamente' })
    } catch (error) {
      console.error(`[CitaController] Error al registrar pago en efectivo:`, error.message);
      res.status(400).json({ error: error.message })
    }
  }

  crearResena = async (req, res) => {
    try {
      const { id } = req.params;
      const { puntuacion, comentario } = req.body;
      
      if (!puntuacion) {
        return res.status(400).json({ error: 'La puntuación es obligatoria' });
      }

      const id_resena = await this.citaService.crearResena(id, { puntuacion, comentario });
      res.status(201).json({ 
        id: id_resena, 
        id_resena: id_resena, 
        status: 'success',
        mensaje: 'Reseña creada exitosamente' 
      });
    } catch (error) {
      console.error(`[CitaController] Error al crear reseña:`, error.message);
      let message = error.message;
      if (message.includes('DECLARE') || message.includes('INSERT INTO') || message.includes('UPDATE')) {
         message = 'Error al procesar la reseña en la base de datos';
      }
      res.status(400).json({ error: message });
    }
  }

  eliminar = async (req, res) => {
    try {
      const { id } = req.params
      await this.citaService.eliminarCita(id)
      res.json({ mensaje: 'Cita eliminada' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = CitaController
