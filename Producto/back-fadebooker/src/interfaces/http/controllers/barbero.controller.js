const BarberoRepository = require('../../../infraestructure/database/BarberoRepositoryImpl');
const BarberoService = require('../../../application/usecases/barbero.service');

const barberoRepository = new BarberoRepository();
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
      const barberos = await barberoService.obtenerTodosLosBarberos()
      res.json(barberos)
    } catch (error) {
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
      const { id, fecha } = req.params
      const disponibilidad = await barberoService.obtenerDisponibilidadBarbero(id, fecha)
      res.json(disponibilidad)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerServicios(req, res) {
    try {
      const { id } = req.params
      const servicios = await BarberoService.obtenerServiciosBarbero(id)
      res.json(servicios)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async agregarServicio(req, res) {
    try {
      const { id } = req.params
      const validatedData = ServicioBarberoSchema.parse({ ...req.body, id_barbero: parseInt(id) })
      await BarberoService.agregarServicioBarbero(
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
      await BarberoService.eliminarServicioBarbero(id, id_servicio)
      res.json({ mensaje: 'Servicio eliminado del barbero' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = BarberoController
