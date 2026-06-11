import React, { useState } from 'react'
import { X, Lock } from 'lucide-react'
import { availabilityService } from '@/lib/api/availabilityService'
import { useNotification } from '@/context/NotificationContext'

interface BlockTimeModalProps {
  fecha: string
  hora: string
  onClose: () => void
  onSuccess: () => void
  isLoading: boolean
  idBarbero: number
}

const BlockTimeModal: React.FC<BlockTimeModalProps> = ({
  fecha,
  hora,
  onClose,
  onSuccess,
  isLoading,
  idBarbero
}) => {
  const { showNotification } = useNotification()
  const [motivo, setMotivo] = useState('')
  const [duracion, setDuracion] = useState('30') // minutos
  const [isCreating, setIsCreating] = useState(false)

  const handleConfirm = async () => {
    if (!motivo.trim()) {
      showNotification('Por favor ingresa un motivo del bloqueo', 'error')
      return
    }

    setIsCreating(true)
    try {
      // Calcular hora de fin
      const [horaNum, minNum] = hora.split(':').map(Number)
      const fechaHoraInicio = `${fecha}T${hora}:00`
      const fechaInicioDate = new Date(fechaHoraInicio)
      if (fechaInicioDate.getTime() < Date.now()) {
        showNotification('No puedes bloquear un horario que ya pasó', 'error')
        setIsCreating(false)
        return
      }

      const dateObj = new Date(fechaHoraInicio)
      dateObj.setMinutes(dateObj.getMinutes() + parseInt(duracion))
      
      const horaFin = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`
      const fechaHoraFin = `${fecha}T${horaFin}:00`

      await availabilityService.crearBloque(
        idBarbero,
        fechaHoraInicio,
        fechaHoraFin,
        motivo
      )

      showNotification('Horario bloqueado exitosamente', 'success')
      setMotivo('')
      setDuracion('30')
      onSuccess()
    } catch (error: any) {
      console.error('Error al bloquear horario:', error)
      const errorMsg = error.response?.data?.error || 'Error al bloquear el horario'
      showNotification(errorMsg, 'error')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white animate-scale-in">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#3366FF]/10 text-[#3366FF] rounded-2xl">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bloquear Horario</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isCreating}
              className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Contenido */}
          <div className="space-y-6">
            {/* Fecha y Hora */}
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">
                Fecha y Hora
              </p>
              <p className="text-xl font-black text-slate-900">
                {new Date(`${fecha}T${hora}:00`).toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
              <p className="text-[#3366FF] font-black text-lg mt-1">{hora} hrs</p>
            </div>

            {/* Duración */}
            <div>
              <label className="block text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3">
                Duración del Bloqueo
              </label>
              <div className="flex gap-3">
                {['30', '60', '90', '120'].map((min) => (
                  <button
                    key={min}
                    onClick={() => setDuracion(min)}
                    disabled={isCreating}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all disabled:opacity-50 ${
                      duracion === min
                        ? 'bg-[#3366FF] text-white shadow-lg shadow-blue-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {min}m
                  </button>
                ))}
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3">
                Motivo del Bloqueo
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                disabled={isCreating}
                placeholder="Ej: Almuerzo, Descanso, Mantenimiento..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-slate-900 font-bold focus:ring-2 focus:ring-[#3366FF] focus:border-transparent transition-all disabled:opacity-50 resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              disabled={isCreating}
              className="flex-1 bg-slate-100 text-slate-900 py-3 rounded-xl font-black hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isCreating || !motivo.trim()}
              className="flex-1 bg-[#3366FF] text-white py-3 rounded-xl font-black hover:bg-[#2952cc] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Bloqueando...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Bloquear
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockTimeModal
