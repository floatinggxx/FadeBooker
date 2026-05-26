import React from 'react';
import { Calendar, User, Scissors, Info, CheckCircle2, XCircle, Clock, CreditCard } from 'lucide-react';
import { clsx } from 'clsx';
import { pagoService } from '@/lib/api/pagoService';
import { useNotification } from '@/context/NotificationContext';
import { parseError } from '@/lib/utils/errorParser';

interface BookingCardProps {
  dateTime: string;
  barberName: string;
  clienteName?: string;
  serviceName: string;
  status: string;
  notes?: string;
  isBarberoView?: boolean;
  id?: number;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  dateTime, 
  barberName, 
  clienteName,
  serviceName, 
  status = 'pendiente', 
  notes,
  isBarberoView,
  id
}) => {
  const { showNotification } = useNotification();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handlePayNow = async () => {
    if (!id) return;
    setIsProcessing(true);
    try {
      showNotification("Iniciando portal de pago...", "info");
      await pagoService.procesarPago(id);
    } catch (err: any) {
      showNotification(parseError(err), "error");
    } finally {
      setIsProcessing(false);
    }
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
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-[#3366FF] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-[#2563EB] disabled:opacity-50 transition-all hover:scale-105"
            >
              <CreditCard size={16} />
              {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
            </button>
          )}
        </div>
      </div>

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
