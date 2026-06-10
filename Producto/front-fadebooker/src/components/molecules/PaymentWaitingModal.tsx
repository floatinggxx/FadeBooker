import React, { useEffect, useState, useRef } from 'react';
import { Loader2, ExternalLink, ShieldCheck, HelpCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { pagoService } from '@/lib/api/pagoService';
import api from '@/lib/api';

interface PaymentWaitingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookingId: number;
  paymentUrl: string;
}

const PaymentWaitingModal: React.FC<PaymentWaitingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  bookingId,
  paymentUrl,
}) => {
  const [dots, setDots] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<'success' | 'error' | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos para pagar
  const [isExpired, setIsExpired] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSimulateWebhook = async () => {
    if (isExpired) return;
    setIsSimulating(true);
    setSimulationStatus(null);
    try {
      // Simular el webhook de Mercado Pago en nuestro backend (es compatible de igual forma tanto en local como en Azure)
      await api.post('/pagos/webhook', {
        action: 'payment.created',
        data: {
          id: '1327318202', // ID de pago simulado
          status: 'approved',
          external_reference: `cita_${bookingId}`
        },
        type: 'payment',
        external_reference: `cita_${bookingId}`
      });
      setSimulationStatus('success');
      // Después de simular, esperar 2 segundos y entonces disparar onSuccess para que el polling detecte el cambio
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error('[MercadoPago Simulación] Error enviando mock webhook:', err);
      setSimulationStatus('error');
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    // Resetear estados al abrir el modal
    setTimeLeft(180);
    setIsExpired(false);
    setSimulationStatus(null);
    setErrorCount(0);

    // Efecto visual de puntos suspensivos en movimiento
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 600);

    // Cuenta regresiva de tiempo límite
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setIsExpired(true);
          // Frenar polling inmediatamente al expirar
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Polling consultando el estado del pago cada 3 segundos
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const pagos = await pagoService.obtenerPagosCita(bookingId);
        // Si algún pago registrado está "completado" o "aprobado"
        const tienePagoAprobado = pagos.some(
          (p: any) => p.estado_pago === 'completado' || p.estado_pago === 'approved'
        );

        if (tienePagoAprobado) {
          clearInterval(pollingIntervalRef.current!);
          pollingIntervalRef.current = null;
          clearInterval(timerInterval);
          onSuccess();
        }
      } catch (err) {
        console.error('[MercadoPago] Error consultando estado de pagos:', err);
        setErrorCount((prev) => prev + 1);
      }
    }, 3000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(timerInterval);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isOpen, bookingId, paymentUrl, onSuccess]);

  if (!isOpen) return null;

  const handleOpenAgain = () => {
    window.open(paymentUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-10 max-w-md w-full text-center border border-slate-100 relative overflow-hidden animate-scale-up">
        {/* Adornos de fondo */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${isExpired ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'}`}></div>

        {isExpired ? (
          <>
            <div className="flex justify-center mb-8 relative">
              <div className="absolute inset-0 bg-rose-100 rounded-full blur-xl scale-75 animate-pulse"></div>
              <div className="relative bg-rose-50 text-rose-600 p-6 rounded-full border border-rose-100">
                <AlertTriangle size={44} className="animate-bounce" />
              </div>
            </div>

            <h2 className="text-3xl font-black text-rose-600 mb-4 tracking-tight leading-tight">
              Pago Expirado
            </h2>

            <p className="text-slate-500 font-medium mb-8 leading-relaxed px-2 text-sm sm:text-base">
              Superaste el límite de tiempo de **3 minutos** para concretar el abono. No se registró el pago a tiempo y el espacio en la agenda ha sido liberado de seguridad.
              <span className="block mt-3 text-xs text-rose-500 font-bold uppercase tracking-wider">
                Por favor, genera una nueva reserva e intenta pagar más rápido para asegurar tu espacio.
              </span>
            </p>

            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 font-black uppercase text-xs tracking-widest shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={16} />
                Regresar y Re-intentar
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-8 relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl scale-75 animate-pulse"></div>
              <div className="relative bg-blue-50 text-blue-600 p-6 rounded-full border border-blue-100 animate-spin-slow">
                <Loader2 size={44} className="animate-spin" />
              </div>
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Esperando Pago{dots}
            </h2>

            {/* Countdown Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider mb-6 mx-auto">
              <Clock size={14} className="text-blue-500 animate-pulse" />
              Tiempo restante: <span className="text-blue-600 font-mono text-sm">{formatTime(timeLeft)}</span>
            </div>

            <p className="text-slate-500 font-medium mb-8 leading-relaxed px-2 text-sm sm:text-base">
              Para completar el pago, por favor haz clic en el botón de abajo. Se abrirá el portal oficial de **Mercado Pago**.
              <span className="block mt-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
                Esta pantalla se actualizará automáticamente apenas completes la transacción.
              </span>
            </p>

            <div className="space-y-3">
              <button
                onClick={handleOpenAgain}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink size={16} />
                Ir a Pestaña de Pago
              </button>

              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-slate-50 text-slate-500 hover:text-slate-700 font-black uppercase text-xs tracking-widest border-2 border-slate-100 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={16} />
                Seguir explorando / Pagar después
              </button>
            </div>

            {/* Helper de desarrollo para simular el pago */}
            <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
              <button
                onClick={handleSimulateWebhook}
                disabled={isSimulating}
                className="w-full py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 font-black uppercase text-xs tracking-[0.075em] border border-amber-200 hover:border-amber-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Loader2 size={14} className={`animate-spin ${isSimulating ? 'block' : 'hidden'}`} />
                ⚡ Simular Aprobación (Modo Test)
              </button>
              
              {simulationStatus === 'success' && (
                <p className="mt-2 text-xs text-emerald-600 font-bold animate-pulse">
                  ¡Simulación enviada! Estado actualizándose...
                </p>
              )}
              {simulationStatus === 'error' && (
                <p className="mt-2 text-xs text-rose-600 font-bold">
                  Error enviando la simulación. Revisa la consola de tu backend.
                </p>
              )}
            </div>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-bold">
          <ShieldCheck size={16} className="text-emerald-500" />
          Pago Protegido por Mercado Pago Sandbox
        </div>

        {!isExpired && errorCount > 3 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2 text-left">
            <HelpCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[10px] text-amber-700 leading-normal font-medium">
              Estamos teniendo problemas de conexión con tu backend. Recuerda verificar que tu túnel público **localtunnel** esté activo y corriendo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentWaitingModal;
