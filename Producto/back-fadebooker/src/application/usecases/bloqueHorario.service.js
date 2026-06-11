const BloqueHorarioRepositoryImpl = require('../../infraestructure/database/BloqueHorarioRepositoryImpl')

const bloqueHorarioRepository = new BloqueHorarioRepositoryImpl()

class BloqueHorarioService {
  async crearBloque(id_barbero, fecha_hora_inicio, fecha_hora_fin, motivo) {
    // Validaciones básicas
    if (!id_barbero || !fecha_hora_inicio || !fecha_hora_fin) {
      throw new Error('Parámetros inválidos: se requieren id_barbero, fecha_hora_inicio y fecha_hora_fin')
    }

    const inicio = new Date(fecha_hora_inicio)
    const fin = new Date(fecha_hora_fin)

    if (inicio >= fin) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin')
    }

    // No permitir bloques en el pasado
    if (inicio < new Date()) {
      throw new Error('No se pueden crear bloques en el pasado')
    }

    return await bloqueHorarioRepository.crear(id_barbero, fecha_hora_inicio, fecha_hora_fin, motivo)
  }

  async obtenerBloquesPorFecha(id_barbero, fecha) {
    if (!id_barbero || !fecha) {
      throw new Error('Se requieren id_barbero y fecha')
    }

    return await bloqueHorarioRepository.obtenerPorBarberoYFecha(id_barbero, fecha)
  }

  async obtenerBloque(id_bloque) {
    if (!id_bloque) {
      throw new Error('Se requiere id_bloque')
    }

    const bloque = await bloqueHorarioRepository.obtenerPorId(id_bloque)
    if (!bloque) {
      throw new Error('Bloque horario no encontrado')
    }

    return bloque
  }

  async eliminarBloque(id_bloque) {
    if (!id_bloque) {
      throw new Error('Se requiere id_bloque')
    }

    await bloqueHorarioRepository.eliminar(id_bloque)
    return { mensaje: 'Bloque horario eliminado' }
  }

  async obtenerBloquesPorBarbero(id_barbero) {
    if (!id_barbero) {
      throw new Error('Se requiere id_barbero')
    }

    return await bloqueHorarioRepository.obtenerPorBarbero(id_barbero)
  }
}

module.exports = BloqueHorarioService
