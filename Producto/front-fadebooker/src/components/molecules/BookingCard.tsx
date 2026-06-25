import React, { useState } from 'react';
import { Calendar, User, Scissors, Info, CheckCircle2, XCircle, Clock, CreditCard, Star, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import { pagoService } from '@/lib/api/pagoService';
import { useNotification } from '@/context/NotificationContext';
import { parseError } from '@/lib/utils/errorParser';
import ReviewModal from './ReviewModal';
import PaymentWaitingModal from './PaymentWaitingModal';
import BarbieroCancelBookingModal from '@/features/barbero/ui/BarbieroCancelBookingModal';

interface BookingCardProps {
  dateTime: string;
  barberName: string;
  clienteName?: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  barberoId?: number;
  tiendaName?: string;
  serviceName: string;
  status: string;
  notes?: string;
  isBarberoView?: boolean;
  id?: number;
  montoTotal?: number;
  pagoAbono?: number;
  createdAt?: string;
  aiImageUrl?: string;
  onRemove?: (id?: number) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  dateTime, 
  barberName, 
  clienteName,
  clienteEmail,
  clienteTelefono,
  barberoId,
  tiendaName,
  serviceName, 
  status = 'pendiente', 
  notes,
  isBarberoView,
  id,
  montoTotal = 0,
  pagoAbono = 0,
  createdAt,
  aiImageUrl,
  onRemove
}) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [paymentType, setPaymentType] = useState<'total' | 'abono'>('abono');
  
  // Estados para el modal de espera del pago
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [initialPref, setInitialPref] = useState<{
    montoBase?: number;
    comision?: number;
    montoConComision?: number;
  } | null>(null);

  // Estado para modal de confirmación de cancelación
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showBarberoCancelModal, setShowBarberoCancelModal] = useState(false);

  const montoPendiente = (montoTotal || 0) - (pagoAbono || 0);
  const abonoFaltante = Math.max(0, (montoTotal || 0) * 0.5 - (pagoAbono || 0));

  const handlePayNow = async () => {
    if (!id) return;
    setIsProcessing(true);
    const paymentWindow = window.open('about:blank', '_blank');
    try {
      showNotification("Generando pasarela de pago...", "info");
      const outcomeType = (paymentType === 'abono' && abonoFaltante > 0) ? 'abono' : 'total';
      const resultado = await pagoService.crearPago({ 
        id_cita: id,
        tipo_pago: outcomeType
      });
      setPaymentUrl(resultado.url);
      // store preference breakdown to show immediately in modal
      setInitialPref({
        montoBase: resultado.montoBase ?? resultado.monto_base ?? montoTotal,
        comision: resultado.comision ?? resultado.comision_calculada ?? resultado.comision_total ?? null,
        montoConComision: resultado.montoConComision ?? resultado.monto_con_comision ?? null
      });
      if (paymentWindow) {
        if (resultado && resultado.url) {
          paymentWindow.location.href = resultado.url;
        } else {
          // Si no hay URL devuelta, cerramos la ventana y alertamos
          paymentWindow.close();
          console.warn('crearPago no devolvió URL de pago:', resultado);
          showNotification('No se pudo iniciar pasarela de pago (falta URL).', 'error');
        }
      }
      setShowWaitingModal(true);
      // Pass initial pref so modal doesn't refetch unnecessarily
      setTimeout(() => {
        // noop, modal reads paymentUrl and will fetch pref if needed
      }, 0);
    } catch (err: any) {
      if (paymentWindow) paymentWindow.close();
      showNotification(parseError(err), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelClick = () => {
    if (isBarberoView) {
      setShowBarberoCancelModal(true);
      return;
    }
    setShowCancelConfirmModal(true);
  };

  const handleRemoveClick = async () => {
    if (!id || isRemoving) return;

    setIsRemoving(true);
    try {
      await onRemove?.(id);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleConfirmCancel = async () => {
    setShowCancelConfirmModal(false);
    if (!id) return;
    
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

  const handleBarberoCancelSuccess = () => {
    setShowBarberoCancelModal(false);
    showNotification('Cita cancelada y cliente notificado', 'success');
    queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
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
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="bg-[#3366FF]/10 text-[#3366FF] p-3 rounded-2xl">
                <Calendar size={20} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{dateTime}</h3>
            </div>
            {createdAt && (
              <p className="text-xs font-bold text-slate-400 pl-[52px]">
                Solicitada el: {new Date(createdAt).toLocaleDateString('es-CL', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })} a las {new Date(createdAt).toLocaleTimeString('es-CL', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
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
                {/* Reservar siempre espacio visual para la tienda (placeholder si falta) */}
                <p className="text-xs text-slate-400 font-medium mt-1 h-4">
                  {tiendaName ? (
                    <>En: {tiendaName}</>
                  ) : (
                    <span className="inline-block w-36 h-3 bg-slate-100 rounded-md" aria-hidden="true" />
                  )}
                </p>
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

          {aiImageUrl && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Diseño IA</p>
              <a
                href={aiImageUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex break-all text-sm font-semibold text-blue-600 hover:underline"
              >
                {aiImageUrl}
              </a>
              <img
                src={aiImageUrl}
                alt="Imagen generada por IA"
                className="mt-3 h-40 w-full rounded-2xl object-cover shadow-sm"
              />
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
              onClick={handleCancelClick}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 border-2 border-rose-100 text-rose-500 hover:bg-rose-50 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <XCircle size={16} />
              Cancelar Cita
            </button>
          )}

          <button
            type="button"
            onClick={handleRemoveClick}
            disabled={isRemoving}
            className="w-full flex items-center justify-center gap-2 border-2 border-rose-100 text-rose-500 hover:bg-rose-50 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
            aria-label="Eliminar cita"
          >
            <Trash2 size={16} />
            {isRemoving ? 'Eliminando...' : 'Eliminar Cita'}
          </button>

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
          paymentType={paymentType}
          initialPref={initialPref ?? undefined}
        />
      )}

      {/* Modal de confirmación de cancelación premium */}
      {showCancelConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in animate-duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-10 max-w-md w-full text-center border border-slate-100 relative overflow-hidden animate-scale-up animate-duration-250">
            <div className="absolute top-0 left-0 right-0 h-2 bg-rose-500"></div>
            
            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-rose-100 rounded-full blur-xl scale-75 animate-pulse"></div>
              <div className="relative bg-rose-50 text-rose-600 p-5 rounded-full border border-rose-100">
                <XCircle size={44} className="animate-bounce" />
              </div>
            </div>

            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              ¿Cancelar esta cita?
            </h3>
            
            <p className="text-slate-500 font-medium mb-8 leading-relaxed px-2 text-sm sm:text-base">
              ¿Estás seguro de que deseas cancelar tu reserva para el día <strong>{dateTime}</strong>? 
              <span className="block mt-3 text-xs text-rose-400 font-bold uppercase tracking-wider">
                Esta acción no se puede deshacer y está sujeta a nuestras políticas de reembolso.
              </span>
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShowCancelConfirmModal(false)}
                className="py-4 rounded-2xl bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-black uppercase text-xs tracking-widest border-2 border-slate-100 transition-all active:scale-95"
              >
                Volver
              </button>
              
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="py-4 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 font-black uppercase text-xs tracking-widest shadow-lg shadow-rose-200 transition-all active:scale-95"
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showBarberoCancelModal && (
        <BarbieroCancelBookingModal
          booking={{
            id_cita: id,
            id_barbero: barberoId ?? undefined,
            cliente_nombre: clienteName ?? undefined,
            cliente_email: clienteEmail ?? undefined,
            cliente_telefono: clienteTelefono ?? undefined,
            servicio_nombre: serviceName,
            fecha_hora_inicio: dateTime,
            monto_total: montoTotal
          }}
          onClose={() => setShowBarberoCancelModal(false)}
          onSuccess={handleBarberoCancelSuccess}
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
