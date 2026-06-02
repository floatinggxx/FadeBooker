import React, { useState } from 'react';
import { Calendar, User, Scissors, Info, CheckCircle2, XCircle, Clock, CreditCard, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import { pagoService } from '@/lib/api/pagoService';
import { useNotification } from '@/context/NotificationContext';
import { parseError } from '@/lib/utils/errorParser';
import ReviewModal from './ReviewModal';
import PaymentWaitingModal from './PaymentWaitingModal';

interface BookingCardProps {
  dateTime: string;
  barberName: string;
  clienteName?: string;
  serviceName: string;
  status: string;
  notes?: string;
  isBarberoView?: boolean;
  id?: number;
  montoTotal?: number;
  pagoAbono?: number;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  dateTime, 
  barberName, 
  clienteName,
  serviceName, 
  status = 'pendiente', 
  notes,
  isBarberoView,
  id,
  montoTotal = 0,
  pagoAbono = 0
}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [paymentType, setPaymentType] = useState<'total' | 'abono'>('abono');
  
  // Estados para el modal de espera del pago
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const montoPendiente = (montoTotal || 0) - (pagoAbono || 0);
  const abonoFaltante = Math.max(0, (montoTotal || 0) * 0.5 - (pagoAbono || 0));

  const handlePayNow = async () => {
    if (!id) return;
    setIsProcessing(true);
    try {
      showNotification("Generando pasarela de pago...", "info");
      const outcomeType = (paymentType === 'abono' && abonoFaltante > 0) ? 'abono' : 'total';
      const resultado = await pagoService.crearPago({ 
        id_cita: id,
        tipo_pago: outcomeType
      });
      setPaymentUrl(resultado.url);
      setShowWaitingModal(true);
    } catch (err: any) {
      showNotification(parseError(err), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) return;
    
    setIsProcessing(true);
    try {
      showNotification("Cancelando cita...", "info");
      const res = await (await import('@/lib/api/bookingService')).bookingService.cancelarCita(id);
      
      if (res.reembolso) {
        showNotification(`Cita cancelada. Se ha aprobado un reembolso del ${res.porcentaje}% de tu abono.`, "success");
      } else {
        showNotification("Cita cancelada. No aplica reembolso según la política de cancelación (<8h).", "info");
      }
      
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    } catch (err: any) {
      showNotification(parseError(err), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowWaitingModal(false);
    showNotification("¡Pago completado con éxito! Tu reserva está confirmada.", "success");
    // Invalidamos el caché de React Query para actualizar la lista de citas en tiempo real
    queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
  };

  const getStatusConfig = (s: string = 'confirmada') => {
    const statusLower = (s || 'confirmada').toLowerCase();
    switch (statusLower) {
      case 'confirmada':
        return { 
          icon: <CheckCircle2 className="text-emerald-500" />, 
          bg: 'bg-emerald-50 text-emerald-701 border-emerald-100',
          label: 'Confirmada'
        };
      case 'pendiente':
        return { 
          icon: <Clock className="text-amber-500" />, 
          bg: 'bg-amber-50 text-amber-701 border-amber-100',
          label: 'Pendiente de Pago'
        };
      case 'completada':
        return { 
          icon: <CheckCircle2 className="text-[#3366FF]" />, 
          bg: 'bg-blue-50 text-blue-801 border-blue-100',
          label: 'Completada'
        };
      case 'cancelada':
        return { 
          icon: <XCircle className="text-rose-500" />, 
          bg: 'bg-rose-50 text-rose-801 border-rose-100',
          label: 'Cancelada' 
        };
      default:
        return { 
          icon: <Clock className="text-slate-400" />, 
          bg: 'bg-slate-50 text-slate-701 border-slate-100',
          label: s
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <article className="group relative bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-blue-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-6 flex-1">
          {/* Header con Fecha */}
          <div className="flex items-center gap-3">
            <div className="bg-[#3366FF]/10 text-[#3366FF] p-3 rounded-2xl">
              <Calendar size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{dateTime}</h3>
          </div>

          {/* Detalles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center gap-3">
              <User className="text-slate-400" size={18} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {isBarberoView ? 'Cliente' : 'Barbero'}
                </p>
                <p className="font-black text-slate-800">{isBarberoView ? clienteName : barberName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Scissors className="text-slate-400" size={18} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Servicio</p>
                <p className="font-black text-slate-800">{serviceName}</p>
              </div>
            </div>
          </div>
          
          {notes && (
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Info className="text-slate-400 mt-1" size={16} />
              <p className="text-sm text-slate-600 font-medium italic">"{notes}"</p>
            </div>
          )}
        </div>

        {/* Status Badge & Actions */}
        <div className="flex flex-col items-center gap-4">
          <div className={clsx(
            "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2",
            statusConfig.bg
          )}>
            {statusConfig.icon}
            {statusConfig.label}
          </div>

          {status && status.toLowerCase() === 'pendiente' && !isBarberoView && (
            <div className="w-full space-y-3">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setPaymentType('abono')}
                  className={clsx(
                    "flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase transition-all",
                    paymentType === 'abono' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:bg-white/50"
                  )}
                >
                  Abono (50%)
                </button>
                <button
                  onClick={() => setPaymentType('total')}
                  className={clsx(
                    "flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase transition-all",
                    paymentType === 'total' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:bg-white/50"
                  )}
                >
                  Total (100%)
                </button>
              </div>

              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-[#3366FF] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-[#2563EB] disabled:opacity-50 transition-all hover:scale-105"
              >
                <CreditCard size={16} />
                {isProcessing ? 'Procesando...' : `Pagar ${paymentType === 'abono' ? 'Abono' : 'Total'}`}
              </button>
            </div>
          )}

          {status && (status.toLowerCase() === 'confirmada' || status.toLowerCase() === 'pendiente') && (
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 border-2 border-rose-100 text-rose-500 hover:bg-rose-50 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <XCircle size={16} />
              Cancelar Cita
            </button>
          )}

          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-1"
          >
            <Info size={12} />
            {showDetails ? 'Ocultar Detalles' : 'Ver Detalles'}
          </button>

          {status && status.toLowerCase() === 'completada' && !isBarberoView && !isReviewed && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-100 hover:bg-amber-500 transition-all hover:scale-105"
            >
              <Star size={16} className="fill-white" />
              Valorar Servicio
            </button>
          )}

          {isReviewed && (
             <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
               <CheckCircle2 size={16} />
               ¡Reseña Enviada!
             </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-8 pt-8 border-t-2 border-slate-50 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-slate-400">Total del Servicio</p>
            <p className="text-lg font-black text-slate-900">${montoTotal}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-slate-400">Abono Pagado</p>
            <p className="text-lg font-black text-emerald-600">${pagoAbono}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-slate-400">Restante</p>
            <p className="text-lg font-black text-blue-600">${montoTotal - pagoAbono}</p>
          </div>
        </div>
      )}

      {id && (
        <ReviewModal 
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => setIsReviewed(true)}
          bookingId={id}
          barberName={barberName}
        />
      )}

      {id && paymentUrl && (
        <PaymentWaitingModal
          isOpen={showWaitingModal}
          onClose={() => setShowWaitingModal(false)}
          onSuccess={handlePaymentSuccess}
          bookingId={id}
          paymentUrl={paymentUrl}
        />
      )}

      {/* Indicador lateral sutil */}
      <div className={clsx(
        "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full transition-all group-hover:h-20",
        {
          "bg-emerald-500": status && status.toLowerCase() === 'confirmada',
          "bg-[#3366FF]": status && status.toLowerCase() === 'completada',
          "bg-rose-500": status && status.toLowerCase() === 'cancelada',
          "bg-amber-500": status && status.toLowerCase() === 'pendiente',
          "bg-slate-300": !status || !['confirmada', 'completada', 'cancelada', 'pendiente'].includes(status.toLowerCase())
        }
      )} />
    </article>
  );
};

export default BookingCard;
