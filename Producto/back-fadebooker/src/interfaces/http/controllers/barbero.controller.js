const BarberoService = require('../../../application/usecases/barbero.service')

const BarberoController = {
  async crear(req, res) {
    try {
      const barbero = await BarberoService.crearBarbero(req.body)
      res.status(201).json(barbero)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params
      const barbero = await BarberoService.obtenerBarberoPorId(id)
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
      const barbero = await BarberoService.obtenerBarberoPorEmail(email)
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
      const barberos = await BarberoService.buscarBarberosPorEspecialidad(especialidad)
      res.json(barberos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerTodos(req, res) {
    try {
      const barberos = await BarberoService.obtenerTodosLosBarberos()
      res.json(barberos)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params
      const barbero = await BarberoService.actualizarBarbero(id, req.body)
      res.json(barbero)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params
      await BarberoService.eliminarBarbero(id)
      res.json({ mensaje: 'Barbero eliminado' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async actualizarHorario(req, res) {
    try {
      const { id } = req.params
      const { horario } = req.body
      await BarberoService.actualizarHorarioBarbero(id, horario)
      res.json({ mensaje: 'Horario actualizado' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerDisponibilidad(req, res) {
    try {
      const { id, fecha } = req.params
      const disponibilidad = await BarberoService.obtenerDisponibilidadBarbero(id, fecha)
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
  }
}

module.exports = BarberoController