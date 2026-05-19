const CitaRepository = require('../../../infraestructure/database/CitaRepositoryImpl');
const ServicioRepository = require('../../../infraestructure/database/ServicioRepositoryImpl');
const CitaService = require('../../../application/usecases/cita.service');

const citaRepository = new CitaRepository();
const servicioRepository = new ServicioRepository();
const citaService = new CitaService(citaRepository, servicioRepository);

const CitaController = {
  async crear(req, res) {
    try {
      const citaId = await citaService.crearCita(req.body)
      res.status(201).json({ id: citaId, mensaje: 'Cita creada exitosamente' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async cambiarEstado(req, res) {
    try {
      const { id } = req.params
      const { estado, motivo_cancelacion } = req.body
      await citaService.actualizarEstado(id, estado, motivo_cancelacion)
      res.json({ mensaje: `Cita actualizada a estado: ${estado}` })
    } catch (error) {
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
      const { clienteId, barberoId, fecha } = req.query
      if (clienteId && barberoId) {
        return res.status(400).json({ error: 'No puede especificarse clienteId y barberoId al mismo tiempo.' })
      }

      let citas
      if (clienteId !== undefined) {
        const id = parseInt(clienteId, 10)
        if (Number.isNaN(id)) {
          return res.status(400).json({ error: 'clienteId debe ser un número válido.' })
        }
        citas = await citaService.obtenerCitasPorCliente(id)
      } else if (barberoId !== undefined) {
        const id = parseInt(barberoId, 10)
        if (Number.isNaN(id)) {
          return res.status(400).json({ error: 'barberoId debe ser un número válido.' })
        }
        citas = await citaService.obtenerCitasPorBarbero(id, fecha)
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