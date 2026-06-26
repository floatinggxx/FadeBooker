import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { availabilityService } from '@/lib/api/availabilityService'

interface BloqueHorario {
  id_bloque: number | string
  id_barbero: number
  fecha_hora_inicio: string
  fecha_hora_fin: string
  motivo?: string
}

interface HorarioBloque {
  hora: string
  estado: 'libre' | 'reservado'
  tipo?: 'cita' | 'bloque'
  id_bloque?: number | string
  id_cita?: number
  motivo?: string
  pasado?: boolean
}

export const useDayAvailability = (idBarbero: number, fecha: string, citas: any[] = []) => {
  const [isCreating, setIsCreating] = useState(false)

  const bloquesQuery = useQuery({
    queryKey: ['bloques', idBarbero, fecha],
    queryFn: () => availabilityService.getBloquesPorFecha(idBarbero, fecha),
    enabled: Boolean(idBarbero && fecha),
    staleTime: 1000 * 60 * 5,
  })

  const bloques: BloqueHorario[] = (bloquesQuery.data as BloqueHorario[]) || []

    const generarHorariosDelDia = useCallback((): HorarioBloque[] => {
    const horarios: HorarioBloque[] = []

      // Filtrar citas para este barbero (asegurar que no se mezclen citas de otros barberos)
      const citasDelBarbero = (citas || []).filter((c: any) => {
        if (!c) return false
        return Number(c.id_barbero || c.barberoId || c.barbero_id) === Number(idBarbero)
      })

    for (let hora = 9; hora < 18; hora++) {
      for (let minutos = 0; minutos < 60; minutos += 30) {
        const horaFormato = `${String(hora).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`

        const citaEnHorario = citasDelBarbero.find((cita: any) => {
          const horaInicio = cita?.fecha_hora_inicio?.substring(11, 16)
          return horaInicio === horaFormato && cita.estado !== 'cancelada'
        })

        const bloqueEnHorario = bloques.find((bloque: any) => {
          const horaInicioBloque = bloque?.fecha_hora_inicio?.substring(11, 16)
          const horaFinBloque = bloque?.fecha_hora_fin?.substring(11, 16)
          return horaInicioBloque && horaFinBloque && horaFormato >= horaInicioBloque && horaFormato < horaFinBloque
        })

        const slotDateString = `${fecha}T${horaFormato}:00`
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
        const part = (type: string) => parts.find((p) => p.type === type)?.value || '00'
        const nowChileString = `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}:${part('second')}`
        const pasado = slotDateString < nowChileString

        if (citaEnHorario) {
          horarios.push({
            hora: horaFormato,
            estado: 'reservado',
            tipo: 'cita',
            id_cita: citaEnHorario.id_cita,
            pasado
          })
        } else if (bloqueEnHorario) {
          horarios.push({
            hora: horaFormato,
            estado: 'reservado',
            tipo: 'bloque',
            id_bloque: bloqueEnHorario.id_bloque,
            motivo: bloqueEnHorario.motivo,
            pasado
          })
        } else {
          horarios.push({
            hora: horaFormato,
            estado: 'libre',
            pasado
          })
        }
      }
    }

    return horarios
  }, [bloques, citas])

  const crearBloque = async (
    fechaHoraInicio: string,
    fechaHoraFin: string,
    motivo: string
  ) => {
    setIsCreating(true)
    try {
      await availabilityService.crearBloque(idBarbero, fechaHoraInicio, fechaHoraFin, motivo)
      await bloquesQuery.refetch()
      return { success: true }
    } catch (error) {
      console.error('Error al crear bloque:', error)
      return { success: false, error }
    } finally {
      setIsCreating(false)
    }
  }

  const eliminarBloque = async (idBloque: number | string) => {
    try {
      await availabilityService.eliminarBloque(Number(idBloque))
      await bloquesQuery.refetch()
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar bloque:', error)
      return { success: false, error }
    }
  }

  const horarios = useMemo(() => generarHorariosDelDia(), [generarHorariosDelDia])

  return {
    bloques,
    isLoading: bloquesQuery.isLoading,
    isCreating,
    horarios,
    crearBloque,
    eliminarBloque,
    refetch: bloquesQuery.refetch
  }
}
