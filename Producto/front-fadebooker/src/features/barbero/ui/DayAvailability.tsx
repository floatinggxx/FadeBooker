import React, { useState } from 'react'
import { Calendar, Plus, Lock, X } from 'lucide-react'
import { useDayAvailability } from '../hooks/useDayAvailability'
import BlockTimeModal from './BlockTimeModal'

interface DayAvailabilityProps {
  idBarbero: number
  selectedDate: string
  onDateChange: (date: string) => void
  citas?: any[]
  onBlockCreated?: () => void
}

const DayAvailability: React.FC<DayAvailabilityProps> = ({
  idBarbero,
  selectedDate,
  onDateChange,
  citas = [],
  onBlockCreated
}) => {
  const { horarios, isLoading, isCreating, eliminarBloque } = useDayAvailability(
    idBarbero,
    selectedDate,
    citas
  )

  const [showModal, setShowModal] = useState(false)
  const [selectedHora, setSelectedHora] = useState<string | null>(null)
  const [bloqueAEliminar, setBloqueAEliminar] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleBlockHora = (hora: string, estado: string) => {
    if (estado === 'libre') {
      setSelectedHora(hora)
      setShowModal(true)
    }
  }

  const handleEliminarBloque = async (idBloque: number) => {
    setIsDeleting(true)
    try {
      const result = await eliminarBloque(idBloque)
      if (result.success) {
        setBloqueAEliminar(null)
        if (onBlockCreated) onBlockCreated()
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const getEstadoColor = (estado: string, pasado?: boolean) => {
    if (pasado) {
      return 'bg-red-100 border-2 border-red-300 text-red-600 cursor-not-allowed'
    }

    switch (estado) {
      case 'libre':
        return 'bg-green-50 border-2 border-green-200 text-green-600 hover:bg-green-100 cursor-pointer'
      case 'reservado':
        return 'bg-blue-50 border-2 border-blue-200 text-blue-600 cursor-not-allowed'
      default:
        return ''
    }
  }

  const getEstadoLabel = (estado: string, pasado?: boolean) => {
    if (pasado) {
      return 'Pasado'
    }

    switch (estado) {
      case 'libre':
        return 'Libre'
      case 'reservado':
        return 'Reservado'
      default:
        return estado
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-[#3366FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-[#3366FF] rounded-full" aria-hidden="true"></div>
          <h3 className="text-3xl font-black text-slate-900">Disponibilidad del Día</h3>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 pl-4 rounded-2xl">
          <Calendar size={20} className="text-[#3366FF]" aria-hidden="true" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent border-none font-black text-slate-900 text-sm focus:ring-0 outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-6 mb-8 p-6 bg-slate-50 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-green-100 border-2 border-green-200 rounded-lg"></div>
          <span className="font-bold text-slate-600 text-sm">Libre</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-100 border-2 border-blue-200 rounded-lg"></div>
          <span className="font-bold text-slate-600 text-sm">Reservado</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded-lg"></div>
          <span className="font-bold text-slate-600 text-sm">Pasado</span>
        </div>
      </div>

      {/* Grid de horarios */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
        {horarios.map((horario, index) => (
          <div key={index} className="relative group">
            <button
              onClick={() => handleBlockHora(horario.hora, horario.estado)}
              disabled={horario.estado !== 'libre' || horario.pasado}
              className={`w-full p-4 rounded-xl font-black text-sm transition-all ${getEstadoColor(
                horario.estado,
                horario.pasado
              )}`}
              title={`${horario.hora} - ${getEstadoLabel(horario.estado, horario.pasado)}`}
            >
              {horario.hora}
            </button>

            {/* Botón para eliminar bloque de barbero */}
            {horario.tipo === 'bloque' && (
              <button
                onClick={() => {
                  setBloqueAEliminar(horario.id_bloque ? Number(horario.id_bloque) : null)
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                title="Eliminar reserva de barbero"
                aria-label={`Eliminar reserva de barbero en ${horario.hora}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal para bloquear horario */}
      {showModal && selectedHora && (
        <BlockTimeModal
          fecha={selectedDate}
          hora={selectedHora}
          onClose={() => {
            setShowModal(false)
            setSelectedHora(null)
          }}
          onSuccess={() => {
            setShowModal(false)
            setSelectedHora(null)
            if (onBlockCreated) onBlockCreated()
          }}
          isLoading={isCreating}
          idBarbero={idBarbero}
        />
      )}

      {/* Modal de confirmación para eliminar bloque */}
      {bloqueAEliminar && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                  <Lock size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900">¿Eliminar bloqueo?</h3>
              </div>

              <p className="text-slate-500 font-bold mb-8">
                Este horario volverá a estar disponible para agendar citas.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setBloqueAEliminar(null)}
                  disabled={isDeleting}
                  className="flex-1 bg-slate-100 text-slate-900 py-3 rounded-xl font-black hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => bloqueAEliminar && handleEliminarBloque(bloqueAEliminar)}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <X size={16} />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DayAvailability
