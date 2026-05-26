const CitaRepository = require('../../../infraestructure/database/CitaRepositoryImpl');
const ServicioRepository = require('../../../infraestructure/database/ServicioRepositoryImpl');
const UsuarioRepository = require('../../../infraestructure/database/UsuarioRepositoryImpl');
const CitaService = require('../../../application/usecases/cita.service');

const citaRepository = new CitaRepository();
const servicioRepository = new ServicioRepository();
const usuarioRepository = new UsuarioRepository();
const citaService = new CitaService(citaRepository, servicioRepository, usuarioRepository);

const CitaController = {
  async crear(req, res) {
    try {
      const result = await citaService.crearCita(req.body)
      // Asegurar que enviamos el ID plano para que el frontend no se confunda
      const idFinal = typeof result === 'object' ? result.id_cita : result;
      res.status(201).json({ id: idFinal, mensaje: 'Cita creada exitosamente' })
    } catch (error) {
      console.error('Error al crear cita:', error);
      // Limpiar errores de base de datos para no exponer SQL en la respuesta
      let message = error.message;
      if (message.includes('DECLARE') || message.includes('INSERT INTO')) {
        // Buscar el mensaje después del error custom si existe
        if (message.includes('- ')) {
           message = message.split('- ').pop();
        } else {
           message = 'Error de base de datos al procesar la reserva';
        }
      }
      res.status(400).json({ error: message })
    }
  },

  async cambiarEstado(req, res) {
    try {
      const { id } = req.params
      const { estado, motivo_cancelacion } = req.body
      
      console.log(`[CitaController] Cambiando estado de cita ID=${id} a "${estado}"`);
      
      await citaService.actualizarEstado(id, estado, motivo_cancelacion)
      res.json({ mensaje: `Cita actualizada a estado: ${estado}` })
    } catch (error) {
      console.error(`[CitaController] Error al cambiar estado:`, error.message);
      res.status(400).json({ error: error.message })
    }
  },

  async checkDisponibilidad(req, res) {
    try {
      const { idBarbero, fecha, hora, duracion } = req.query
      if (!idBarbero || !fecha || !hora || !duracion) {
        return res.status(400).json({ error: 'Faltan parámetros: idBarbero, fecha, hora, duracion' })
      }
      const disponible = await citaService.verificarDisponibilidad(
        parseInt(idBarbero), 
        fecha, 
        hora, 
        parseInt(duracion)
      )
      res.json({ disponible })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async listar(req, res) {
    try {
      const { clienteId, barberoId, tiendaId, fecha, period } = req.query
      
      // Sincronizar estados antes de listar (pasar de confirmada a completada si ya pasó 1 hora)
      try {
        await citaRepository.autoCompletarCitasVencidas();
      } catch (syncErr) {
        console.error('[CitaController] Error en sincronización de estados:', syncErr.message);
      }

      let citas
      if (clienteId !== undefined) {
        const id = parseInt(clienteId, 10)
        citas = await citaService.obtenerCitasPorCliente(id)
      } else if (barberoId !== undefined) {
        const id = parseInt(barberoId, 10)
        citas = await citaService.obtenerCitasPorBarbero(id, fecha, period)
      } else if (tiendaId !== undefined) {
        const id = parseInt(tiendaId, 10)
        citas = await citaService.obtenerCitasPorTienda(id, fecha, period)
      } else {
        citas = await citaService.obtenerTodasCitas()
      }

      res.status(200).json(citas)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params
      const cita = await citaService.obtenerCitaPorId(id)
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' })
      }
      res.json(cita)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params
      await citaService.eliminarCita(id)
      res.json({ mensaje: 'Cita eliminada' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = CitaController