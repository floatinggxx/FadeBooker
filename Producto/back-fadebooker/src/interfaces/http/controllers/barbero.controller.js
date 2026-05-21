const BarberoRepository = require('../../../infraestructure/database/BarberoRepositoryImpl');
const CitaRepository = require('../../../infraestructure/database/CitaRepositoryImpl');
const BarberoService = require('../../../application/usecases/barbero.service');

const barberoRepository = new BarberoRepository();
const citaRepository = new CitaRepository();
const barberoService = new BarberoService(barberoRepository);

const BarberoController = {
  async crear(req, res) {
    try {
      const barbero = await barberoService.crearBarbero(req.body)
      res.status(201).json(barbero)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params
      const barbero = await barberoService.obtenerBarberoPorId(id)
      if (!barbero) {
        return res.status(404).json({ error: 'Barbero no encontrado' })
      }
      res.json(barbero)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorEmail(req, res) {
    try {
      const { email } = req.params
      const barbero = await barberoService.obtenerBarberoPorEmail(email)
      if (!barbero) {
        return res.status(404).json({ error: 'Barbero no encontrado' })
      }
      res.json(barbero)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async buscarPorEspecialidad(req, res) {
    try {
      const { especialidad } = req.params
      const barberos = await barberoService.buscarBarberosPorEspecialidad(especialidad)
      res.json(barberos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerTodos(req, res) {
    try {
      const { id_tienda } = req.query
      if (id_tienda) {
        const barberos = await barberoService.obtenerBarberosPorTienda(id_tienda)
        return res.json(barberos)
      }
      const barberos = await barberoService.obtenerTodosLosBarberos()
      res.json(barberos)
    } catch (error) {
      console.error('[DEBUG] Error en obtenerTodos los barberos:', error.message);
      res.status(400).json({ error: error.message })
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params
      const barbero = await barberoService.actualizarBarbero(id, req.body)
      res.json(barbero)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params
      await barberoService.eliminarBarbero(id)
      res.json({ mensaje: 'Barbero eliminado' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizarHorario(req, res) {
    try {
      const { id } = req.params
      const { horario } = req.body
      await barberoService.actualizarHorarioBarbero(id, horario)
      res.json({ mensaje: 'Horario actualizado' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerDisponibilidad(req, res) {
    try {
      const { id } = req.params
      const fecha = req.params.fecha || req.query.fecha
      if (!fecha) {
        return res.status(400).json({ error: 'Falta el parámetro fecha para verificar la disponibilidad.' })
      }
      const disponibilidad = await barberoService.obtenerDisponibilidadBarbero(id, fecha)
      res.json(disponibilidad)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerServicios(req, res) {
    try {
      const { id } = req.params
      const servicios = await barberoService.obtenerServiciosBarbero(id)
      res.json(servicios)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async agregarServicio(req, res) {
    try {
      const { id } = req.params
      const validatedData = ServicioBarberoSchema.parse({ ...req.body, id_barbero: parseInt(id) })
      await barberoService.agregarServicioBarbero(
        validatedData.id_barbero,
        validatedData.id_servicio,
        validatedData.precio_barbero,
        validatedData.tiempo_servicio_minutos
      )
      res.status(201).json({ mensaje: 'Servicio agregado al barbero' })
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Error de validación', detalles: error.errors })
      }
      res.status(400).json({ error: error.message })
    }
  },

  async eliminarServicio(req, res) {
    try {
      const { id, id_servicio } = req.params
      await barberoService.eliminarServicioBarbero(id, id_servicio)
      res.json({ mensaje: 'Servicio eliminado del barbero' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerStats(req, res) {
    try {
      const { id } = req.params;
      const { period } = req.query;
      const stats = await citaRepository.getStats(id, period);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async obtenerCitas(req, res) {
    try {
      const { id } = req.params;
      const { date } = req.query;
      const citas = await citaRepository.findByBarbero(id, date);
      res.json(citas);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = BarberoController

