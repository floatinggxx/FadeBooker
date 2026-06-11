const BloqueHorarioService = require('../../../application/usecases/bloqueHorario.service')

const bloqueHorarioService = new BloqueHorarioService()

const BloqueHorarioController = {
  async crear(req, res) {
    try {
      const { id_barbero, fecha_hora_inicio, fecha_hora_fin, motivo } = req.body

      if (!id_barbero || !fecha_hora_inicio || !fecha_hora_fin) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' })
      }

      const bloque = await bloqueHorarioService.crearBloque(
        id_barbero,
        fecha_hora_inicio,
        fecha_hora_fin,
        motivo
      )

      res.status(201).json(bloque)
    } catch (error) {
      console.error('[DEBUG] Error al crear bloque horario:', error.message)
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorFecha(req, res) {
    try {
      const { id_barbero, fecha } = req.params
      const queryFecha = req.query.fecha || fecha

      if (!id_barbero || !queryFecha) {
        return res.status(400).json({ error: 'Se requieren id_barbero y fecha' })
      }

      const bloques = await bloqueHorarioService.obtenerBloquesPorFecha(id_barbero, queryFecha)
      res.json(bloques)
    } catch (error) {
      console.error('[DEBUG] Error al obtener bloques por fecha:', error.message)
      res.status(400).json({ error: error.message })
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({ error: 'Se requiere id del bloque' })
      }

      await bloqueHorarioService.eliminarBloque(id)
      res.json({ mensaje: 'Bloque horario eliminado' })
    } catch (error) {
      console.error('[DEBUG] Error al eliminar bloque horario:', error.message)
      res.status(400).json({ error: error.message })
    }
  },

  async obtenerPorBarbero(req, res) {
    try {
      const { id_barbero } = req.params

      if (!id_barbero) {
        return res.status(400).json({ error: 'Se requiere id_barbero' })
      }

      const bloques = await bloqueHorarioService.obtenerBloquesPorBarbero(id_barbero)
      res.json(bloques)
    } catch (error) {
      console.error('[DEBUG] Error al obtener bloques por barbero:', error.message)
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = BloqueHorarioController
