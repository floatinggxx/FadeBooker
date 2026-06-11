import api from './axios'

export const availabilityService = {
  // Obtener bloques horarios bloqueados para un barbero en una fecha específica
  async getBloquesPorFecha(idBarbero: number, fecha: string) {
    try {
      const response = await api.get(`/bloques/${idBarbero}/${fecha}`)
      return response.data
    } catch (error: any) {
      console.error('Error al obtener bloques:', error)
      throw error
    }
  },

  // Obtener todos los bloques de un barbero
  async getBloquesPorBarbero(idBarbero: number) {
    try {
      const response = await api.get(`/bloques/${idBarbero}`)
      return response.data
    } catch (error: any) {
      console.error('Error al obtener bloques del barbero:', error)
      throw error
    }
  },

  // Crear un nuevo bloque horario
  async crearBloque(
    idBarbero: number,
    fechaHoraInicio: string,
    fechaHoraFin: string,
    motivo?: string
  ) {
    try {
      const response = await api.post(`/bloques/${idBarbero}`, {
        id_barbero: idBarbero,
        fecha_hora_inicio: fechaHoraInicio,
        fecha_hora_fin: fechaHoraFin,
        motivo
      })
      return response.data
    } catch (error: any) {
      console.error('Error al crear bloque:', error)
      throw error
    }
  },

  // Eliminar un bloque horario
  async eliminarBloque(idBloque: number) {
    try {
      const response = await api.delete(`/bloques/${idBloque}`)
      return response.data
    } catch (error: any) {
      console.error('Error al eliminar bloque:', error)
      throw error
    }
  }
}
