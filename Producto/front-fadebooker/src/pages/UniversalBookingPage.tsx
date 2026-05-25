import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { barberService } from '@/lib/api/barberService';
import { tiendaService } from '@/lib/api/tiendaService';
import { bookingService } from '@/lib/api/bookingService';
import { pagoService } from '@/lib/api/pagoService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { ServicioBarbero, Barbero, Tienda } from '@/types';
import { PLACEHOLDERS, FALLBACK_URLS } from '@/lib/utils/placeholders';
import { 
  Star, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ChevronLeft,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Scissors
} from 'lucide-react';
import { clsx } from 'clsx';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

const formatDateLabel = (value: string) => {
  if (!value) return '';
  // Usar T12:00:00 para evitar desajustes de zona horaria (UTC vs Local)
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
};

const UniversalBookingPage: React.FC = () => {
  const { id } = useParams(); // id_barbero
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServicioBarbero | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Queries
  const { data: barber, isLoading: loadingBarber } = useQuery({
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

  const { data: availability, isLoading: loadingAvailability } = useQuery({
    queryKey: ['availability', id, selectedDate],
    queryFn: () => barberService.getDisponibilidad(Number(id), selectedDate),
    enabled: !!id && !!selectedDate && step === 3,
  });

  const filteredAvailability = useMemo(() => {
    if (!availability) return [];
    
    // Si la fecha seleccionada es hoy, filtramos los horarios pasados
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate === today) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      return availability.map(slot => {
        const [hour, minute] = slot.hora.split(':').map(Number);
        // Deshabilitar si ya pasó la hora o si faltan menos de 15 minutos para la cita
        const isPast = hour < currentHour || (hour === currentHour && minute <= currentMinute + 15);
        return {
          ...slot,
          disponible: slot.disponible && !isPast
        };
      });
    }

    return availability;
  }, [availability, selectedDate]);

  const isStepCompleted = (currentStep: number) => {
    if (currentStep === 1) return !!barber;
    if (currentStep === 2) return !!selectedService;
    if (currentStep === 3) return !!selectedDate;
    if (currentStep === 4) return !!selectedTime;
    return false;
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
        navigate('/login', { state: { from: `/barbero/${id}` } });
        return;
    }

    if (!user || !selectedService || !selectedDate || !selectedTime || !barber) return;
    
    setIsBooking(true);
    try {
      const cita = await bookingService.crearCita({
        clienteId: Number(user.id_usuario || user.id),
        barberoId: Number(barber.id_barbero || barber.id),
        servicioBarberoId: Number(selectedService.id_servicio_barbero || selectedService.id),
        fecha: selectedDate,
        hora: selectedTime,
      });

      // Simplemente marcamos como confirmado por ahora como lo hacía la página del compañero
      setConfirmed(true);
    } catch (err) {
      console.error("Error al crear cita:", err);
      alert("No se pudo crear la cita. Por favor intenta de nuevo.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loadingBarber || loadingServices) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#3366FF]"></div>
        </div>
    );
  }

  if (!barber) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-6 text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4">Barbero no encontrado</h1>
            <p className="text-slate-500 mb-8">La disponibilidad del barbero solicitado no está disponible actualmente.</p>
            <button onClick={() => navigate('/barberias')} className="bg-[#3366FF] text-white px-8 py-4 rounded-full font-black shadow-lg">VOLVER AL CATÁLOGO</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white shadow-lg shadow-slate-950/20">
              <span>{tienda?.nombre_tienda || 'Cargando...'}</span>
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span>{tienda?.calificacion_promedio?.toFixed(1) || '4.9'}</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900">
                Reserva con {barber.nombre} {barber.apellido}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
              Personaliza tu experiencia seleccionando el servicio ideal, la fecha y el horario que mejor te acomode. 
              Confirmaremos tu reserva al final del proceso.
            </p>
          </div>
          <button
            onClick={() => navigate(`/tienda/${barber.id_tienda}`)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-black text-slate-900 shadow-lg shadow-slate-200 transition hover:bg-slate-50"
          >
            Volver a la tienda
          </button>
        </div>

        {/* Steps Navigator */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { title: 'Barbero', subtitle: barber.nombre },
            { title: 'Servicio', subtitle: selectedService ? 'Seleccionado' : 'Pendiente' },
            { title: 'Fecha', subtitle: selectedDate ? 'Seleccionada' : 'Pendiente' },
            { title: 'Hora', subtitle: selectedTime ? 'Seleccionada' : 'Pendiente' }
          ].map((item, index) => (
            <div
              key={item.title}
              className={`rounded-[2rem] p-6 text-center border-2 ${step === index + 1 ? 'border-[#3366FF] bg-slate-50 shadow-xl' : 'border-transparent bg-white/80'} transition-all`}
            >
              <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">Paso {index + 1}</p>
              <h2 className="mt-4 text-xl font-black text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm text-slate-500">{isStepCompleted(index + 1) ? '✓ Completo' : 'Pendiente'}</p>
            </div>
          ))}
        </div>

        {/* --- STEP 1: BARBERO (ALREADY SELECTED) --- */}
        {step === 1 && (
            <section className="space-y-8 animate-fade-in-up">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Tu Barbero</p>
                        <h2 className="mt-3 text-4xl font-black text-slate-900">Estás por agendar con el experto</h2>
                    </div>
                </div>

                <div className="rounded-[3rem] border-4 border-[#3366FF] bg-white p-10 shadow-2xl flex flex-col md:flex-row gap-10 items-center">
                    <div className="h-64 w-64 overflow-hidden rounded-[3rem] bg-slate-900 shadow-xl">
                        <img
                            src={barber.foto_perfil_url || PLACEHOLDERS.BARBERO}
                            alt={`${barber.nombre} ${barber.apellido}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                if (img.src !== FALLBACK_URLS.BARBERO) img.src = FALLBACK_URLS.BARBERO;
                            }}
                        />
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                            <span className="bg-[#3366FF]/10 text-[#3366FF] px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-4 inline-block">
                                {barber.especialidad || 'Master Barber'}
                            </span>
                            <h3 className="text-5xl font-black text-slate-900">{barber.nombre} {barber.apellido}</h3>
                        </div>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                            {barber.descripcion || 'Especialista en cortes modernos y estilo clásico con años de experiencia en la industria.'}
                        </p>
                        <div className="flex items-center gap-6 justify-center md:justify-start">
                            <div className="flex items-center gap-2">
                                <Star className="text-yellow-400 fill-yellow-400" size={24} />
                                <span className="text-2xl font-black text-slate-900">{barber.calificacion_promedio?.toFixed(1) || '4.9'}</span>
                            </div>
                            <div className="h-8 w-px bg-slate-200"></div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <Clock size={20} />
                                <span className="font-bold">Lunes a Sábado</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => setStep(2)}
                        className="bg-[#3366FF] text-white px-12 py-6 rounded-full font-black text-xl shadow-xl shadow-blue-200 flex items-center gap-4 hover:bg-[#2a5dd9] transition-all"
                    >
                        ELEGIR SERVICIO <ArrowRight size={24} />
                    </button>
                </div>
            </section>
        )}

        {/* --- STEP 2: SERVICIO --- */}
        {step === 2 && (
          <section className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Servicio</p>
                <h2 className="mt-3 text-4xl font-black text-slate-900">Selecciona el servicio ideal</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">El estilo que buscas está solo a una elección de distancia.</p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-black uppercase tracking-[0.35em] text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                ← Cambiar Barbero
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services && services.length > 0 ? (
                services.map((service) => (
                    <button
                        key={service.id_servicio_barbero || service.id}
                        type="button"
                        onClick={() => {
                            setSelectedService(service);
                            setStep(3);
                        }}
                        className={`group rounded-[2.5rem] border-4 p-8 text-left transition-all ${selectedService?.id_servicio_barbero === service.id_servicio_barbero ? 'border-[#3366FF] bg-[#3366FF] text-white shadow-2xl shadow-blue-200' : 'border-white bg-white hover:border-slate-100 shadow-xl'}`}
                    >
                        <Scissors className={clsx("mb-6", selectedService?.id_servicio_barbero === service.id_servicio_barbero ? 'text-blue-100' : 'text-[#3366FF]')} size={32} />
                        <p className={clsx("text-2xl font-black", selectedService?.id_servicio_barbero === service.id_servicio_barbero ? 'text-white' : 'text-slate-900')}>
                            {service.servicio?.nombre || service.nombre_servicio}
                        </p>
                        <p className={clsx("mt-3 text-sm leading-relaxed", selectedService?.id_servicio_barbero === service.id_servicio_barbero ? 'text-blue-100' : 'text-slate-500')}>
                            {service.servicio?.descripcion || service.descripcion}
                        </p>
                        <div className="mt-8 flex items-center justify-between">
                            <span className={clsx("text-3xl font-black", selectedService?.id_servicio_barbero === service.id_servicio_barbero ? 'text-white' : 'text-[#3366FF]')}>
                                {formatMoney(service.precio || service.precio_barbero || service.precio_base || 0)}
                            </span>
                            <div className={clsx("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest", selectedService?.id_servicio_barbero === service.id_servicio_barbero ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500')}>
                                {service.duracion || service.duracion_minutos || service.tiempo_servicio_minutos || 30} min
                            </div>
                        </div>
                    </button>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] shadow-xl">
                    <p className="text-slate-400 font-black uppercase tracking-widest mb-4">No hay servicios registrados</p>
                    <p className="text-xl font-bold text-slate-800">Este barbero aún no ha configurado sus servicios.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* --- STEP 3: FECHA --- */}
        {step === 3 && (
          <section className="space-y-8 animate-fade-in-up">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Fecha</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900">Selecciona una fecha disponible</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-start">
              <div className="rounded-[3rem] bg-white p-12 shadow-2xl border border-slate-100">
                <label className="block text-sm font-black uppercase tracking-[0.35em] text-slate-500 mb-6">Selecciona el día</label>
                <input
                  type="date"
                  className="w-full rounded-[2rem] border-4 border-slate-50 bg-slate-50 p-8 text-3xl font-black text-slate-900 outline-none transition focus:border-[#3366FF] hover:bg-slate-100"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <div className="mt-10 p-6 bg-[#E8F1FF] rounded-[2rem] border border-blue-100">
                    <p className="text-xs font-black uppercase tracking-[0.35em] text-[#3366FF] mb-2">Reserva para:</p>
                    <p className="text-2xl font-black text-slate-900">{formatDateLabel(selectedDate)}</p>
                </div>
              </div>

              <div className="rounded-[3rem] bg-[#0F172A] p-12 text-white shadow-2xl space-y-8 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3366FF]/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10 text-center sm:text-left">
                    <ShieldCheck className="text-[#3366FF] mb-6 mx-auto sm:mx-0" size={56} />
                    <h3 className="text-3xl font-black text-white">Tu satisfacción es nuestra prioridad</h3>
                    <p className="mt-6 text-slate-200 text-lg leading-relaxed font-medium">
                        Solo colaboramos con los mejores profesionales. Al agendar con {barber.nombre}, estás garantizando un resultado excepcional bajo los estándares de <span className="text-[#3366FF] font-black">FadeBooker</span>.
                    </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-white text-slate-900 px-10 py-5 rounded-full font-black text-lg border border-slate-200 hover:bg-slate-50 transition-all"
              >
                ← VOLVER A SERVICIO
              </button>
              <button
                type="button"
                disabled={!selectedDate}
                onClick={() => setStep(4)}
                className="bg-[#3366FF] text-white px-12 py-5 rounded-full font-black text-xl shadow-xl shadow-blue-200 disabled:opacity-50"
              >
                VER HORARIOS <ArrowRight className="inline ml-2" />
              </button>
            </div>
          </section>
        )}

        {/* --- STEP 4: HORA --- */}
        {step === 4 && (
          <section className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Hora</p>
                <h2 className="mt-3 text-4xl font-black text-slate-900">El horario perfecto para ti</h2>
                <p className="mt-4 text-slate-600 leading-relaxed font-bold uppercase tracking-tighter">
                   Día: <span className="text-[#3366FF]">{formatDateLabel(selectedDate)}</span>
                </p>
                </div>
                <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-black uppercase tracking-[0.35em] text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                ← CAMBIAR FECHA
              </button>
            </div>

            {loadingAvailability ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[2rem]"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {filteredAvailability && filteredAvailability.length > 0 ? (
                    filteredAvailability.map((slot: any) => (
                    <button
                        key={slot.hora}
                        type="button"
                        disabled={!slot.disponible}
                        onClick={() => {
                        if (!slot.disponible) return;
                        setSelectedTime(slot.hora);
                        setStep(5);
                        }}
                        className={`rounded-[2.5rem] border-4 p-8 font-black text-2xl transition-all shadow-xl group ${selectedTime === slot.hora ? 'border-[#3366FF] bg-[#3366FF] text-white shadow-blue-200 scale-105' : slot.disponible ? 'border-white bg-white text-slate-900 hover:border-blue-100 hover:scale-105' : 'border-slate-50 bg-slate-50 text-slate-300 cursor-not-allowed opacity-60'}`}
                    >
                        {slot.hora}
                        <div className={clsx("mt-4 text-xs font-black uppercase tracking-widest", slot.disponible ? (selectedTime === slot.hora ? 'text-blue-100' : 'text-[#3366FF]') : 'text-slate-400')}>
                            {slot.disponible ? '✓ LIBRE' : '✖ OCUPADO'}
                        </div>
                    </button>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-[3rem] text-center border-4 border-dashed border-slate-200">
                        <Clock size={48} className="mx-auto text-slate-300 mb-6" />
                        <h3 className="text-2xl font-black text-slate-900">No hay horarios disponibles</h3>
                        <p className="text-slate-500 font-bold mt-2">Intenta seleccionar otra fecha para este barbero.</p>
                    </div>
                )}
                </div>
            )}
          </section>
        )}

        {/* --- STEP 5: RESUMEN --- */}
        {step === 5 && !confirmed && (
          <section className="space-y-8 animate-fade-in-up">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Confirmación</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900">Finaliza tu reserva</h2>
              <p className="mt-4 text-slate-600 leading-relaxed max-w-2xl">Revisa que todos tus datos sean correctos. Te enviaremos un correo con los detalles una vez confirmes.</p>
            </div>

            <div className="rounded-[4rem] bg-white p-12 shadow-2xl border-4 border-[#3366FF] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              
              <div className="relative z-10 grid gap-12 lg:grid-cols-2">
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-3xl bg-slate-100 overflow-hidden shadow-inner">
                        <img src={barber.foto_perfil_url || PLACEHOLDERS.BARBERO} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-400 font-black">Barbero</p>
                        <p className="text-3xl font-black text-slate-900">{barber.nombre} {barber.apellido}</p>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-black mb-4">Servicio seleccionado</p>
                    <p className="text-2xl font-black text-slate-900">{selectedService?.nombre_servicio || selectedService?.servicio?.nombre_servicio}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-3xl font-black text-[#3366FF]">{formatMoney(selectedService?.precio_barbero || selectedService?.precio_base || 0)}</span>
                        <div className="bg-white px-4 py-2 rounded-xl text-xs font-black text-slate-500 shadow-sm border border-slate-100">
                            {selectedService?.duracion_minutos || 30} MIN
                        </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 flex flex-col justify-between">
                   <div className="grid grid-cols-2 gap-6">
                       <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-xl">
                            <p className="text-xs font-black uppercase tracking-widest text-[#3366FF] mb-3">Fecha</p>
                            <p className="text-xl font-black capitalize">{formatDateLabel(selectedDate).split(' ')[0]}</p>
                            <p className="text-sm text-slate-400 font-bold">{selectedDate}</p>
                       </div>
                       <div className="bg-[#3366FF] p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
                            <p className="text-xs font-black uppercase tracking-widest text-blue-100 mb-3">Hora</p>
                            <p className="text-3xl font-black">{selectedTime}</p>
                       </div>
                   </div>

                   <button
                    onClick={handleBooking}
                    disabled={isBooking}
                    className="w-full py-8 bg-[#3366FF] text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-blue-200 hover:bg-[#2563EB] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {isBooking ? (
                        <>PROCESANDO...</>
                    ) : (
                        <>CONFIRMAR RESERVA <CheckCircle2 size={32} /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- SUCCESS STATE --- */}
        {confirmed && (
          <div className="rounded-[4rem] bg-white border-4 border-green-500 p-16 text-center shadow-2xl animate-appearance">
            <div className="w-32 h-32 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-100">
                <CheckCircle2 size={64} />
            </div>
            <h3 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">¡Reserva Completada!</h3>
            <p className="text-xl text-slate-500 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
                Tu cita con {barber.nombre} ha sido agendada exitosamente. 
                Recibirás un correo de confirmación con los detalles y el link para el pago del abono.
            </p>
            <div className="flex flex-col gap-6 sm:flex-row justify-center">
              <button
                onClick={() => navigate('/bookings')}
                className="bg-slate-900 text-white px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                VER MIS CITAS
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-[#3366FF] border-4 border-blue-50 px-12 py-6 rounded-full font-black text-xl hover:bg-slate-50 active:scale-95 transition-all"
              >
                VOLVER AL INICIO
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalBookingPage;
