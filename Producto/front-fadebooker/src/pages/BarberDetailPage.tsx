import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { barberService } from '@/lib/api/barberService';
import { tiendaService } from '@/lib/api/tiendaService';
import { bookingService } from '@/lib/api/bookingService';
import { pagoService } from '@/lib/api/pagoService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { ServicioBarbero, Barbero } from '@/types';
import { PLACEHOLDERS, FALLBACK_URLS } from '@/lib/utils/placeholders';
import { 
  Calendar, 
  Clock, 
  Star, 
  ChevronLeft, 
  MapPin, 
  Scissors, 
  CheckCircle2, 
  CreditCard,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

const BarberDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServicioBarbero | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Queries
  const { data: barber, isLoading: loadingBarber, error } = useQuery({
    queryKey: ['barber', id],
    queryFn: () => barberService.getBarberoById(Number(id)),
    enabled: !!id,
  });

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ['barber-services', id],
    queryFn: () => barberService.getServicios(Number(id)),
    enabled: !!id,
  });

  const { data: tienda } = useQuery({
    queryKey: ['tienda', barber?.id_tienda],
    queryFn: () => tiendaService.getTiendaById(barber!.id_tienda!),
    enabled: !!barber?.id_tienda,
  });

  const isBarberInactive = barber?.activo === 0 || barber?.activo === false;

  const { data: availability, isLoading: loadingAvailability } = useQuery({
    queryKey: ['availability', id, selectedDate],
    queryFn: () => barberService.getDisponibilidad(Number(id), selectedDate),
    enabled: !!id && !!selectedDate && step === 3 && !isBarberInactive,
  });

  const handleBooking = async () => {
    if (!user || !selectedService || !selectedDate || !selectedTime || !barber) return;

    if (isBarberInactive) {
      alert('Este barbero está inactivo y no puede reservarse en este momento.');
      return;
    }
    
    setIsBooking(true);
    try {
      const cita = await bookingService.crearCita({
        clienteId: Number(user.id_usuario || user.id),
        barberoId: Number(barber.id_barbero || barber.id),
        servicioBarberoId: Number(selectedService?.id_servicio_barbero || selectedService?.id),
        id_servicio: Number(selectedService?.id_servicio_barbero || selectedService?.id),
        fecha_hora_inicio: `${selectedDate}T${selectedTime}:00`,
        duracion_minutos: Number(selectedService?.duracion ?? selectedService?.servicio?.duracion ?? 60),
        monto_total: Number(selectedService?.precio ?? selectedService?.precio_barbero ?? selectedService?.servicio?.precioBase ?? 0),
        fecha: selectedDate,
        hora: selectedTime,
      });

      if (paymentMethod === 'card') {
        try {
          await pagoService.procesarPago(Number(cita.id_cita || cita.id));
        } catch (payError) {
          console.error("Error al procesar pago:", payError);
          alert("Cita creada, pero hubo un problema al iniciar el pago. Puedes pagar en la tienda.");
          navigate('/bookings');
        }
      } else {
        // En caso de transferencia, podrías redirigir a una página de instrucciones
        // o simplemente a mis citas por ahora.
        navigate('/bookings');
      }
    } catch (err) {
      console.error("Error al crear cita:", err);
      alert("No se pudo crear la cita. Por favor intenta de nuevo.");
    } finally {
      setIsBooking(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) navigate(-1);
    else setStep(s => s - 1);
  };

  if (loadingBarber || loadingServices) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E5E7EB]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-bold animate-pulse uppercase tracking-widest text-xs">Cargando experiencia...</p>
        </div>
      </div>
    );
  }

  if (error || !barber) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#E5E7EB]">
        <div className="text-center bg-white p-10 rounded-[3rem] shadow-xl max-w-sm">
          <div className="bg-rose-100 text-rose-600 p-4 rounded-2xl mb-6 font-bold">No pudimos encontrar al barbero solicitado.</div>
          <button onClick={() => navigate(-1)} className="text-slate-900 font-black flex items-center justify-center gap-2 mx-auto hover:text-rose-500 transition-colors">
            <ChevronLeft size={20} /> VOLVER
          </button>
        </div>
      </div>
    );
  }

  const renderHeader = (title: string, subtitle: string) => (
    <div className="relative mb-12 flex justify-between items-start">
      <div className="flex-1 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-14 w-1.5 bg-rose-500 rounded-full"></div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">{title}</h1>
        </div>
        <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">{subtitle}</p>
      </div>
      <div className="absolute right-0 top-0 hidden lg:block">
        <img 
            src={tienda?.foto_portada_url || PLACEHOLDERS.TIENDA} 
            alt="Logo" 
            className="h-24 w-auto object-contain rounded-2xl grayscale hover:grayscale-0 transition-all duration-500" 
            onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_URLS.TIENDA;
            }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E5E7EB] pt-12 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {isBarberInactive && (
          <div className="mb-8 rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm">
            <p className="font-black text-xl">Este barbero está actualmente inactivo.</p>
            <p className="mt-2 text-sm text-red-700">No puede reservarse ni mostrar horarios disponibles mientras permanezca desactivado.</p>
          </div>
        )}
        {/* Navigation */}
        <button 
          onClick={prevStep}
          className="mb-8 flex items-center gap-2 text-slate-500 font-black hover:text-slate-900 active:scale-95 transition-all group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md group-hover:bg-rose-500 group-hover:text-white group-active:bg-rose-600 group-active:text-white transition-all">
            <ChevronLeft size={24} />
          </div>
          <span className="text-xl uppercase tracking-tighter">Volver</span>
        </button>

        {/* Step Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {step === 1 && (
            <>
              {renderHeader("Selecciona un servicio", "Especialistas en fades y cortes de tendencia. Elige tu servicio y potencia tu imagen.")}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(services || []).filter(Boolean).map((s) => (
                  <button
                    key={s?.id_servicio_barbero || s?.id}
                    disabled={isBarberInactive}
                    onClick={() => {
                      if (!s || isBarberInactive) return;
                      setSelectedService(s);
                      nextStep();
                    }}
                    className={`group p-8 rounded-[2rem] shadow-xl border-4 transition-all flex flex-col items-center justify-center gap-2 ${isBarberInactive ? 'bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-[#3366FF] hover:bg-[#2952CC] active:bg-[#1E3D99] text-white border-transparent hover:border-white/20'}`}
                  >
                    <span className="text-2xl font-black tracking-tight group-hover:scale-105 transition-transform">
                      {s.servicio?.nombre_servicio || s.servicio?.nombre}
                    </span>
                    <span className="text-blue-100 font-bold opacity-80">
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(s.precio || s.servicio?.precioBase || 0)}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {renderHeader("Selecciona una fecha", "La fecha y hora que aparezca dependerá de la disponibilidad del barbero que hayas escogido.")}
              <div className="flex justify-center">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 w-full max-w-md">
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      nextStep();
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full text-2xl font-black text-slate-800 p-6 bg-slate-50 border-4 border-slate-100 rounded-[2rem] focus:border-rose-500 outline-none transition-all cursor-pointer"
                  />
                  <div className="mt-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    TOCA PARA CAMBIAR EL MES
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {renderHeader("Selecciona hora", "El horario seleccionado se bloqueará temporalmente mientras completas tu reserva.")}
              {loadingAvailability ? (
                <div className="flex justify-center py-20">
                   <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : isBarberInactive ? (
                <div className="col-span-full text-center py-10 bg-red-50 rounded-3xl text-red-700 font-bold italic border border-red-200">
                  Este barbero está inactivo. No es posible consultar horarios hasta que se reactive.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availability?.map((slot) => {
                    const isOccupied = !slot.disponible;
                    return (
                      <button
                        key={slot.hora}
                        disabled={isOccupied}
                        onClick={() => {
                          setSelectedTime(slot.hora);
                          nextStep();
                        }}
                        className={clsx(
                          "py-6 rounded-2xl font-black text-2xl transition-all shadow-lg border-2",
                          isOccupied 
                            ? "bg-rose-200 text-rose-500 border-rose-300 cursor-not-allowed opacity-60" 
                            : "bg-[#3366FF] text-white border-transparent hover:bg-white hover:text-[#3366FF] hover:border-[#3366FF] active:bg-blue-50 active:text-[#3366FF]"
                        )}
                      >
                        {slot.hora.substring(0, 5)}
                      </button>
                    );
                  })}
                  {(!availability || availability.length === 0) && (
                    <div className="col-span-full text-center py-10 bg-white rounded-3xl text-slate-400 font-bold italic">
                      No hay horarios disponibles para este día. Prueba con otra fecha.
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <>
              {renderHeader("Resumen de reserva", "Resumen de agendamiento: verifique su información y los detalles de su cita a continuación.")}
              <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-x-8 border-rose-500 max-w-2xl mx-auto">
                <div className="space-y-6 text-xl">
                  <div className="flex gap-4">
                    <span className="font-bold text-slate-900 min-w-[120px]">Nombre:</span>
                    <span className="text-slate-600 font-medium">{user?.nombre} {user?.apellido}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-bold text-slate-900 min-w-[120px]">Correo:</span>
                    <span className="text-slate-600 font-medium">{user?.email}</span>
                  </div>
                  {user?.telefono && (
                    <div className="flex gap-4">
                      <span className="font-bold text-slate-900 min-w-[120px]">Número:</span>
                      <span className="text-slate-600 font-medium">{user?.telefono}</span>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <span className="font-bold text-slate-900 min-w-[120px]">Barbero:</span>
                    <span className="text-slate-600 font-medium">{barber.nombre} {barber.apellido}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-bold text-slate-900 min-w-[120px]">Servicio:</span>
                    <span className="text-slate-600 font-medium">
                      {selectedService?.servicio?.nombre_servicio || selectedService?.servicio?.nombre} ({new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(selectedService?.precio || 0)})
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-bold text-slate-900 min-w-[120px]">Fecha:</span>
                    <span className="text-slate-600 font-medium">{selectedDate}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-bold text-slate-900 min-w-[120px]">Hora:</span>
                    <span className="text-slate-600 font-medium underline decoration-rose-500 decoration-4 underline-offset-4">{selectedTime.substring(0, 5)}</span>
                  </div>
                </div>

                <button 
                  onClick={nextStep}
                  className="mt-12 w-full py-6 bg-[#3366FF] text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-blue-200 hover:bg-rose-500 hover:text-white active:bg-rose-600 active:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirmar reserva
                </button>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              {renderHeader("Realizar abono", "Para asegurar tu cita, requerimos un pequeño abono que se descontará del total en la tienda.")}
              <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-[3rem] shadow-xl mb-8 flex items-center gap-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shrink-0">
                    <img 
                        src={barber.foto_perfil_url || PLACEHOLDERS.BARBERO} 
                        alt={barber.nombre} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_URLS.BARBERO;
                        }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{barber.nombre} {barber.apellido}</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">TU BARBERO SELECCIONADO</p>
                    <div className="h-px bg-slate-100 my-4"></div>
                    <p className="font-black text-slate-900 text-lg">
                      {new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(selectedDate))}
                    </p>
                    <p className="text-[#3366FF] font-black text-2xl">{selectedTime.substring(0, 5)} hrs</p>
                    <p className="text-slate-400 font-medium">{tienda?.nombre_tienda} - {tienda?.ciudad}</p>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-rose-500 text-center mb-8">
                  <h4 className="text-slate-900 font-black uppercase tracking-widest text-sm mb-4">MONTO DEL ABONO</h4>
                  <p className="text-6xl font-black text-green-500 mb-4">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format((selectedService?.precio || 0) * 0.5)}
                  </p>
                  <p className="text-slate-500 font-medium">Este abono asegura tu cita y se descuenta del total</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => {
                        setPaymentMethod('card');
                        handleBooking();
                    }}
                    disabled={isBooking}
                    className="w-full p-8 bg-white rounded-[2rem] shadow-md border-4 border-transparent hover:border-[#3366FF] transition-all flex items-center gap-6 group"
                  >
                    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-[#3366FF] group-hover:text-white transition-all text-slate-400">
                        <CreditCard size={32} />
                    </div>
                    <div className="text-left">
                        <p className="text-xl font-black text-slate-900">Tarjeta de Crédito/Débito</p>
                        <p className="text-slate-500 font-medium text-sm">Pago seguro con Mercado Pago. Todas las tarjetas.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                        setPaymentMethod('transfer');
                        handleBooking();
                    }}
                    disabled={isBooking}
                    className="w-full p-8 bg-white rounded-[2rem] shadow-md border-4 border-transparent hover:border-[#3366FF] transition-all flex items-center gap-6 group"
                  >
                    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-[#3366FF] group-hover:text-white transition-all text-slate-400">
                        <MapPin size={32} />
                    </div>
                    <div className="text-left">
                        <p className="text-xl font-black text-slate-900">Pagar en tienda / Transferencia</p>
                        <p className="text-slate-500 font-medium text-sm">Confirma tu reserva y paga directamente en el local.</p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarberDetailPage;
