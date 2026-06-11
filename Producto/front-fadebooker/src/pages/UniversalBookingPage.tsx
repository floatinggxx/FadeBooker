import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Star } from 'lucide-react';

// Note: these services are expected to exist in the project. If some paths differ,
// adjust the imports accordingly. Implementations here assume service functions
// return sensible shapes (we guard with safe defaults).
import { barberService } from '@/lib/api/barberService';
import { tiendaService } from '@/lib/api/tiendaService';
import { bookingService } from '@/lib/api/bookingService';
import { pagoService } from '@/lib/api/pagoService';
import PaymentWaitingModal from '@/components/molecules/PaymentWaitingModal';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useNotification } from '@/context/NotificationContext';

const formatMoney = (v?: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(v || 0);
const formatDateLabel = (value?: string) => { if (!value) return ''; return new Date(`${value}T12:00:00`).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }); };

const UniversalBookingPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const [createdBookingId, setCreatedBookingId] = useState<number | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [paymentType, setPaymentType] = useState<'abono'|'total'>('abono');
  const [paymentStatus, setPaymentStatus] = useState<'idle'|'pending'|'success'|'expired'>('idle');
  const [bookingCreationTime, setBookingCreationTime] = useState<number | null>(null);

  const { data: barber } = useQuery({ queryKey: ['barber', id], queryFn: () => barberService.getBarberoById(Number(id)), enabled: !!id }) as { data?: any };
  const { data: services } = useQuery({ queryKey: ['barber-services', id], queryFn: () => barberService.getServicios(Number(id)), enabled: !!id }) as { data?: any[] };
  const { data: tienda } = useQuery({ queryKey: ['tienda', barber?.id_tienda], queryFn: () => tiendaService.getTiendaById((barber as any)?.id_tienda), enabled: !!(barber as any)?.id_tienda }) as { data?: any };

  // For recovery we provide simple static slots; in real app this should come from API.
  const availableSlots = useMemo(() => ([
    { hora: '10:00', disponible: true },
    { hora: '11:00', disponible: true },
    { hora: '12:00', disponible: true },
    { hora: '15:00', disponible: false },
  ]), []);

  useEffect(() => { setSelectedTime(''); }, [selectedDate, selectedService]);

  const handleChooseService = (s: any) => { setSelectedService(s); setStep(2); };

  const handleBooking = async () => {
    if (!isAuthenticated) { showNotification('Debes iniciar sesión', 'warning'); navigate('/login'); return; }
    if (!user || !selectedService || !selectedDate || !selectedTime || !barber) { showNotification('Faltan datos', 'warning'); return; }
    setIsBooking(true);
    try {
      const baseAmount = Number(selectedService.precio_barbero || selectedService.precio || 0);
      const monto_total = paymentType === 'abono' ? Math.round(baseAmount * 0.5) : baseAmount;
      const pago_abono = paymentType === 'abono' ? Math.round(baseAmount * 0.5) : 0;

      const payload = {
        id_cliente: Number(user.id || user.id_usuario),
        id_barbero: Number(barber.id_barbero || barber.id),
        id_servicio: Number(selectedService.id || selectedService.id_servicio),
        id_tienda: Number(barber.id_tienda),
        fecha_hora_inicio: `${selectedDate}T${selectedTime}:00`,
        duracion_minutos: Number(selectedService.tiempo_servicio_minutos || 30),
        monto_total,
        metodo_pago: 'mercadopago',
        origen: 'web_universal',
        pago_abono,
        notas: undefined,
      };

      const resp = await bookingService.crearCita(payload);
      const id_cita = Number(resp?.id_cita || resp?.id);
      setCreatedBookingId(id_cita);

      // create payment and open waiting modal
      const tipo_pago = paymentType === 'abono' ? 'abono' : 'total';
      const pago = await pagoService.crearPago({ id_cita, tipo_pago });
      setPaymentUrl(pago?.url || '');
      setShowWaitingModal(true);
      setPaymentStatus('pending');
      setBookingCreationTime(Date.now());
      setStep(4);
    } catch (err: any) {
      console.error(err);
      showNotification('Error creando la cita', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  // Countdown timer (3 minutes = 180s)
  const timeRemaining = useMemo(() => {
    if (!bookingCreationTime) return 0;
    const elapsed = Math.floor((Date.now() - bookingCreationTime) / 1000);
    return Math.max(0, 180 - elapsed);
  }, [bookingCreationTime]);

  useEffect(() => {
    if (!bookingCreationTime) return;
    if (timeRemaining <= 0 && paymentStatus === 'pending') {
      setPaymentStatus('expired');
      showNotification('Tiempo de pago excedido. Reserva liberada.', 'warning');
    }
    const idt = setInterval(() => {
      if (!bookingCreationTime) return;
      if (timeRemaining <= 0) { clearInterval(idt); }
    }, 1000);
    return () => clearInterval(idt);
  }, [bookingCreationTime, timeRemaining, paymentStatus]);

  if (!barber) return <div className="min-h-screen flex items-center justify-center">Cargando barbero...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">Reserva con {barber.nombre} {barber.apellido}</h1>
            <div className="flex items-center gap-2 mt-2"><Star size={16} className="text-yellow-400" /> <span>{barber.calificacion_promedio || '4.9'}</span></div>
          </div>
          <button onClick={() => navigate(`/tienda/${barber.id_tienda}`)} className="px-4 py-2 bg-white rounded-full">Volver</button>
        </div>

        <div className="bg-white p-6 rounded">
          <h2 className="text-2xl font-black mb-4">Servicios</h2>
          <div className="grid grid-cols-3 gap-4">
            {(services || []).map((s: any) => (
              <button key={s.id_servicio_barbero || s.id} onClick={() => handleChooseService(s)} className={clsx('p-4 rounded', selectedService?.id === s.id ? 'bg-blue-500 text-white' : 'bg-slate-50')}>
                <div className="font-bold">{s.nombre_servicio || s.servicio?.nombre}</div>
                <div className="text-sm">{formatMoney(s.precio_barbero || s.precio || 0)}</div>
              </button>
            ))}
          </div>
        </div>

        {step >= 2 && (
          <div className="bg-white p-6 rounded grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Fecha</label>
              <input type="date" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} className="mt-2 p-3 border rounded" />
            </div>
            <div>
              <label className="block text-sm">Hora</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {availableSlots.map((slot: any) => (
                  <button key={slot.hora} onClick={()=>{ if(slot.disponible){ setSelectedTime(slot.hora); setStep(3); } }} className={clsx('p-3 rounded', selectedTime===slot.hora? 'bg-blue-500 text-white':'bg-slate-50')}>{slot.hora}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-6 rounded">
            <h3 className="text-xl font-black mb-4">Resumen</h3>
            <p>Servicio: {selectedService?.nombre_servicio || '-'}</p>
            <p>Fecha: {formatDateLabel(selectedDate)}</p>
            <p>Hora: {selectedTime}</p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => setPaymentType('abono')} className={clsx('p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1', paymentType === 'abono' ? 'bg-white border-[#3366FF] shadow-md' : 'bg-transparent border-slate-100 opacity-60')}>
                <span className={clsx('text-[10px] font-black', paymentType === 'abono' ? 'text-[#3366FF]' : 'text-slate-400')}>PAGAR ABONO</span>
                <span className="text-sm font-black text-slate-900">50% ({formatMoney(((selectedService?.precio_barbero || selectedService?.precio || 0) * 0.5))})</span>
              </button>
              <button type="button" onClick={() => setPaymentType('total')} className={clsx('p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1', paymentType === 'total' ? 'bg-white border-[#3366FF] shadow-md' : 'bg-transparent border-slate-100 opacity-60')}>
                <span className={clsx('text-[10px] font-black', paymentType === 'total' ? 'text-[#3366FF]' : 'text-slate-400')}>PAGO TOTAL</span>
                <span className="text-sm font-black text-slate-900">100% ({formatMoney(selectedService?.precio_barbero || selectedService?.precio || 0)})</span>
              </button>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleBooking} className="bg-blue-600 text-white px-6 py-3 rounded">Confirmar</button>
              <button onClick={()=>setStep(2)} className="px-6 py-3 rounded border">Volver</button>
            </div>
          </div>
        )}

        {createdBookingId && paymentUrl && (
          <PaymentWaitingModal
            isOpen={showWaitingModal}
            onClose={() => {
              setShowWaitingModal(false);
              // allow paying later: navigate to bookings but keep the created booking
            }}
            onSuccess={() => {
              setShowWaitingModal(false);
              setPaymentStatus('success');
              showNotification('Pago recibido', 'success');
              navigate('/bookings');
            }}
            onExpire={async () => {
              setShowWaitingModal(false);
              setPaymentStatus('expired');
              showNotification('Tiempo de pago expirado. Liberando reserva...', 'warning');
              try {
                if (createdBookingId) {
                  await bookingService.cancelarCita(createdBookingId);
                }
              } catch (e) {
                console.error('Error cancelando cita al expirar:', e);
              } finally {
                setCreatedBookingId(null);
                setPaymentUrl('');
                setBookingCreationTime(null);
              }
            }}
            bookingId={createdBookingId}
            paymentUrl={paymentUrl}
          />
        )}

        {/* Pay later / Cancel actions */}
        {createdBookingId && paymentStatus === 'pending' && (
          <div className="mt-6 flex gap-3">
            <button onClick={() => { setShowWaitingModal(false); navigate('/bookings'); showNotification('Puedes completar el pago en Mis Citas', 'info'); }} className="bg-slate-900 text-white px-6 py-3 rounded">Pagar después / Mis Citas</button>
            <button onClick={async () => {
              try { await bookingService.cancelarCita(createdBookingId); showNotification('Reserva cancelada', 'success'); setPaymentStatus('idle'); setCreatedBookingId(null); setPaymentUrl(''); setBookingCreationTime(null); }
              catch (e) { console.error(e); showNotification('No se pudo cancelar la reserva', 'error'); }
            }} className="bg-white text-rose-600 border border-rose-100 px-6 py-3 rounded">Cancelar reserva</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalBookingPage;

