class BloqueHorarioRepository {
  async crear(id_barbero, fecha_hora_inicio, fecha_hora_fin, motivo) {
    throw new Error('Método crear() debe ser implementado')
  }

  async obtenerPorBarberoYFecha(id_barbero, fecha) {
    throw new Error('Método obtenerPorBarberoYFecha() debe ser implementado')
  }

  async obtenerPorId(id_bloque) {
    throw new Error('Método obtenerPorId() debe ser implementado')
  }

  async eliminar(id_bloque) {
    throw new Error('Método eliminar() debe ser implementado')
  }

  async obtenerPorBarbero(id_barbero) {
    throw new Error('Método obtenerPorBarbero() debe ser implementado')
  }
}

module.exports = BloqueHorarioRepository
