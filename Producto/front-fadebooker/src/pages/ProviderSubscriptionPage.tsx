import React, { useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuthContext'
import { subscriptionService } from '@/lib/api/subscriptionService'

const tiers = [
  { id: 1, name: 'Básico', price: 29.99, benefits: ['Visibilidad básica', 'Soporte por email'] },
  { id: 2, name: 'Pro', price: 59.99, benefits: ['Visibilidad destacada', 'Promociones', 'Soporte prioritario'] },
  { id: 3, name: 'Premium', price: 99.99, benefits: ['Panel avanzado', 'Analytics', 'Soporte 24/7'] }
]

const ProviderSubscriptionPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const { user } = useAuth();
  const providerId = user?.id ?? 123 // fallback for non-auth flows

  // local modal state
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubscribe = async () => {
    if (!selectedTier) return setMessage('Selecciona un plan')
    setLoading(true)
    setMessage(null)
      try {
      setShowConfirm(false)
      const res: any = await subscriptionService.createSubscription({ provider_id: Number(providerId), tier_id: Number(selectedTier) })
      setMessage(`Suscripción creada: ${res.id}`)
      // Si la API retorna una URL de pago, redirigimos al proveedor
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.error || 'Error creando suscripción')
    } finally {
      setLoading(false)
    }
  }

  const openConfirm = () => {
    if (!selectedTier) return setMessage('Selecciona un plan')
    setShowConfirm(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Planes de Suscripción</h1>
      <p className="text-sm text-slate-600 mb-6">Elige un plan para aumentar la visibilidad y acceder a herramientas premium.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tiers.map(t => (
          <div key={t.id} className={`p-4 border rounded-lg ${selectedTier === t.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
            <h3 className="font-bold">{t.name}</h3>
            <p className="text-sm text-slate-600">{t.benefits.join(' • ')}</p>
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-black">${t.price}</div>
                <div className="text-xs text-slate-500">/ mes</div>
              </div>
              <button onClick={() => setSelectedTier(t.id)} className="px-4 py-2 rounded-lg bg-slate-50 border">Seleccionar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button disabled={!selectedTier || loading} onClick={openConfirm} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-60">{loading ? 'Procesando...' : 'Contratar plan'}</button>
        {message && <div className="text-sm text-slate-700">{message}</div>}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="font-bold text-lg">Confirmar suscripción</h3>
            <p className="mt-2">Vas a contratar el plan: {tiers.find(t => t.id === selectedTier)?.name} por ${tiers.find(t => t.id === selectedTier)?.price}/mes</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 border rounded">Cancelar</button>
              <button onClick={handleSubscribe} className="px-4 py-2 bg-blue-600 text-white rounded">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProviderSubscriptionPage
