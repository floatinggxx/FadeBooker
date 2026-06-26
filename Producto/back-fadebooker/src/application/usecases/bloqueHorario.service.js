const BloqueHorarioRepositoryImpl = require('../../infraestructure/database/BloqueHorarioRepositoryImpl')

const bloqueHorarioRepository = new BloqueHorarioRepositoryImpl()

function parseDateTimeString(fechaHora) {
  if (typeof fechaHora !== 'string') return null
  const normalized = fechaHora.replace(' ', 'T')
  const [fecha, hora] = normalized.split('T')
  if (!fecha || !hora) return null

  const fechaParts = fecha.split('-').map(Number)
  const horaParts = hora.split(':').map(Number)
  if (fechaParts.length !== 3 || horaParts.length < 2) return null

  const [year, month, day] = fechaParts
  const [hour, minute] = horaParts
  const second = horaParts[2] ?? 0

  if ([year, month, day, hour, minute, second].some(Number.isNaN)) return null

  return {
    year,
    month,
    day,
    hour,
    minute,
    second
  }
}

function formatChileDateTimeString(dateTime) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${dateTime.year}-${pad(dateTime.month)}-${pad(dateTime.day)}T${pad(dateTime.hour)}:${pad(dateTime.minute)}:${pad(dateTime.second)}`
}

function getChileNowString() {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const parts = formatter.formatToParts(now)
  const part = (type) => parts.find((p) => p.type === type)?.value || '00'

  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}:${part('second')}`
}

class BloqueHorarioService {
  async crearBloque(id_barbero, fecha_hora_inicio, fecha_hora_fin, motivo) {
    // Validaciones básicas
    if (!id_barbero || !fecha_hora_inicio || !fecha_hora_fin) {
      throw new Error('Parámetros inválidos: se requieren id_barbero, fecha_hora_inicio y fecha_hora_fin')
    }

    const inicioInfo = parseDateTimeString(fecha_hora_inicio)
    const finInfo = parseDateTimeString(fecha_hora_fin)

    if (!inicioInfo || !finInfo) {
      throw new Error('Formato de fecha/hora inválido')
    }

    const inicioString = formatChileDateTimeString(inicioInfo)
    const finString = formatChileDateTimeString(finInfo)

    if (inicioString >= finString) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin')
    }

    // No permitir bloques en el pasado según hora de Chile
    if (inicioString < getChileNowString()) {
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
