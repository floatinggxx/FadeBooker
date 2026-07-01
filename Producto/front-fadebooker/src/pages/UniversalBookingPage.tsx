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
import { useNotification } from '@/context/NotificationContext';
import { parseError } from '@/lib/utils/errorParser';
import HaircutSimulator from '@/components/booking/HaircutSimulator';
import PaymentWaitingModal from '@/components/molecules/PaymentWaitingModal';
import { 
  Star, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ChevronLeft,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Scissors,
  AlertCircle
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
  const { showNotification } = useNotification();
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServicioBarbero | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentType, setPaymentType] = useState<'abono' | 'total'>('abono');
  const [isBooking, setIsBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [simulatedLook, setSimulatedLook] = useState<{ url: string; styleId: string } | null>(null);

  // Estados para el modal de espera del pago
  const [createdBookingId, setCreatedBookingId] = useState<number | null>(null);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [showWaitingModal, setShowWaitingModal] = useState(false);

  // Estados para la reserva pendiente y cuenta regresiva
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending');
  const [bookingCreationTime, setBookingCreationTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutos en segundos

  // Cuenta regresiva del tiempo límite de pago (3 minutos)
  useEffect(() => {
    if (!confirmed || paymentStatus !== 'pending' || !bookingCreationTime) return;

    const calculateRemaining = () => {
      const elapsed = Math.floor((Date.now() - bookingCreationTime) / 1000);
      return Math.max(0, 180 - elapsed);
    };

    setTimeRemaining(calculateRemaining());

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [confirmed, paymentStatus, bookingCreationTime]);

  const formatCountdownTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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

  const isBarberInactive = barber?.activo === 0 || barber?.activo === false;

  const { data: availability, isLoading: loadingAvailability } = useQuery({
    queryKey: ['availability', id, selectedDate],
    queryFn: () => barberService.getDisponibilidad(Number(id), selectedDate),
    enabled: !!id && !!selectedDate && !isBarberInactive && (step === 4 || step === 5),
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

    // Usar directamente los slots devueltos por el backend (ya están en bloques de 1 hora)
    const hourlyAvailability = React.useMemo(() => {
      if (!filteredAvailability) return [];
      // Filter out any slot where hora (start) is >= tienda cierre if tienda tiene horario
      let cierreHour: number | null = null;
      if (tienda?.horario_cierre) {
        const match = String(tienda.horario_cierre).match(/(\d{1,2}):(\d{2})/);
        if (match) cierreHour = Number(match[1]);
      }

      const slots = filteredAvailability.map((s: any) => ({ hora: s.hora, disponible: s.disponible, detalle: s.detalle }));
      if (cierreHour !== null) {
        return slots.filter((s: any) => Number(s.hora.split(':')[0]) < cierreHour);
      }
      return slots;
    }, [filteredAvailability, tienda]);

  const isStepCompleted = (currentStep: number) => {
    if (currentStep === 1) return !!barber;
    if (currentStep === 2) return !!selectedService;
    if (currentStep === 3) return true; // El paso de Foto IA es opcional y siempre accesible una vez se selecciona servicio
    if (currentStep === 4) return !!selectedDate;
    if (currentStep === 5) return !!selectedTime;
    return false;
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
        showNotification("Debes iniciar sesión para reservar", "warning");
        navigate('/login', { state: { from: `/barbero/${id}` } });
        return;
    }

    if (!user || !selectedService || !selectedDate || !selectedTime || !barber) {
        showNotification("Faltan datos para completar la reserva", "warning");
        return;
    }

    if (isBarberInactive) {
      showNotification('El barbero seleccionado está inactivo y no puede reservarse.', 'warning');
      return;
    }
    
    setIsBooking(true);
    try {
      // Validar IDs antes de enviar
      const clienteId = Number(user.id_usuario || user.id);
      const barberoId = Number(barber.id_barbero || barber.id || id);
      // Intentar obtener id_servicio de varias fuentes
      const servicioId = Number(selectedService.id_servicio || selectedService.servicio?.id_servicio);
      // Forzar id_tienda válido (usar el de la tienda si el barbero no lo tiene)
      const tiendaId = Number(barber.id_tienda || tienda?.id_tienda || tienda?.id || 1);

      if (!clienteId || isNaN(clienteId)) {
        throw new Error("Sesión de usuario no válida. Por favor, vuelve a ingresar.");
      }
      
      if (!barberoId || isNaN(barberoId)) {
        throw new Error("No se pudo identificar al barbero.");
      }

      if (!servicioId || isNaN(servicioId)) {
        throw new Error("Servicio seleccionado no identificado.");
      }

      if (!tiendaId || isNaN(tiendaId)) {
        // Si no hay tienda, intentamos usar 1 como fallback final o lanzamos error si es crítico
        console.warn("[Booking] Tienda no identificada, usando ID default: 1");
      }

      // Asegurar formato de hora HH:mm:ss
      let timeStr = selectedTime;
      if (timeStr.length === 5) timeStr += ":00";
      
      // Combinar fecha y hora en formato ISO local
      const fechaHoraInicio = `${selectedDate}T${timeStr}`;
      
      const basePrice = Number(selectedService.precio_barbero || selectedService.precio || selectedService.servicio?.precio_base || 0);
      // Comisión: preferir configuración de tienda (porcentaje en formato 5 = 5%), luego del barbero, por defecto 5
      const commissionRatePercent = Number(tienda?.comision_porcentaje ?? barber?.comision_porcentaje ?? 5);
      const commissionAmount = Math.round(basePrice * (commissionRatePercent / 100));
      // monto total incluye comisión sobre el total
      const total = basePrice + commissionAmount;
      // El abono corresponde al 50% del total del servicio (sin comisión), pero al realizar el abono se cobra además la comisión completa sobre el total
      const abonoServicio = Math.round(basePrice * 0.5);
      const abonoCalculado = paymentType === 'abono' ? abonoServicio : total;

      const duracionDefault = 60; // usar 60 minutos como duración por defecto
      const duration = Number(selectedService.tiempo_servicio_minutos || selectedService.duracion || selectedService.servicio?.duracion_minutos || duracionDefault);

      const payload = {
        id_cliente: clienteId,
        id_barbero: barberoId,
        id_servicio: servicioId,
        id_tienda: tiendaId,
        fecha_hora_inicio: fechaHoraInicio,
        duracion_minutos: duration,
        // Guardar el monto_total como el precio base del servicio (sin comisión). La comisión se almacena por separado.
        monto_total: basePrice,
        monto_base: basePrice,
        comision: commissionAmount,
        comision_porcentaje: commissionRatePercent,
        estado: 'pendiente', // Inicia como pendiente hasta que se pague
        metodo_pago: 'mercadopago', // Coincide con el esquema de validación
        origen: 'web_universal',
        // pago_abono en la base de datos representa el monto ya pagado; inicialmente es 0 (no se ha pagado aún)
        pago_abono: 0,
        notas: simulatedLook 
          ? `[Simulación de Peinado IA: ${simulatedLook.styleId}] Imagen: ${simulatedLook.url}`
          : ''
      };

      console.log("[UniversalBookingPage] Payload Final:", payload);
      
      const response = await bookingService.crearCita(payload);
      const id_cita = response.id_cita || response.id;

      // Invalidate cached bookings so dashboard and bookings lists refresh immediately
      try {
        // react-query client is not directly imported here; use window.__REACT_QUERY_CLIENT if available
        // This is a lightweight fallback for environments where the QueryClient is exposed globally during runtime.
        const qc = (window as any).__REACT_QUERY_CLIENT;
        if (qc && typeof qc.invalidateQueries === 'function') {
          qc.invalidateQueries(['my-bookings-summary']);
          qc.invalidateQueries(['my-bookings']);
          qc.invalidateQueries(['citas']);
        }
      } catch (e) {
        console.warn('No se pudo invalidar cache de React Query automáticamente:', e);
      }

      setBookingCreationTime(Date.now());
      setPaymentStatus('pending');

      showNotification("¡Reserva confirmada! Generando portal de pago...", "success");
      
      // Esperar un momento para que el usuario lea el mensaje
      setTimeout(async () => {
        try {
          const resultado = await pagoService.crearPago({ 
            id_cita: Number(id_cita),
            tipo_pago: paymentType
          });
          setCreatedBookingId(Number(id_cita));
          setPaymentUrl(resultado.url);
          setShowWaitingModal(true);
        } catch (pagoErr) {
          console.error("Error al iniciar pago:", pagoErr);
          const msg = (pagoErr && pagoErr.response && pagoErr.response.data && (pagoErr.response.data.error || pagoErr.response.data.message)) || pagoErr.message || String(pagoErr);
          // Si el backend indica que el abono ya fue cubierto, intentar crear preferencia para pagar el total
          if (String(msg).toLowerCase().includes('abono') && paymentType === 'abono') {
            try {
              const retry = await pagoService.crearPago({ id_cita: Number(id_cita), tipo_pago: 'total' });
              setCreatedBookingId(Number(id_cita));
              setPaymentUrl(retry.url);
              setShowWaitingModal(true);
              return;
            } catch (retryErr) {
              console.error('Retry pagando total falló:', retryErr);
            }
          }

          showNotification("Cita creada, pero no se pudo iniciar el pago. Puedes pagarla en 'Mis Citas'.", "warning");
          setConfirmed(true);
        }
      }, 1500);

    } catch (err: any) {
      console.error("Error al crear cita:", err);
      showNotification(parseError(err), "error");
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
        {isBarberInactive && (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-800">
            <p className="font-black text-lg">Este barbero está actualmente inactivo.</p>
            <p className="text-sm text-red-700 mt-2">No puede reservarse ni aparece con horarios disponibles mientras esté desactivado.</p>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-6">
          {[
            { title: 'Barbero', subtitle: barber.nombre },
            { title: 'Servicio', subtitle: selectedService ? 'Seleccionado' : 'Pendiente' },
            { title: 'Foto IA', subtitle: simulatedLook ? 'Listo' : 'Opcional' },
            { title: 'Fecha', subtitle: selectedDate ? 'Seleccionada' : 'Pendiente' },
            { title: 'Hora', subtitle: selectedTime ? 'Seleccionada' : 'Pendiente' },
            { title: 'Confirmación', subtitle: step === 6 ? 'Último' : 'Pendiente' }
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
                    <div className="h-64 w-64 overflow-hidden rounded-[3rem] bg-slate-100 shadow-xl border-4 border-slate-50">
                        <img
                            src={barber.foto_perfil_url || PLACEHOLDERS.BARBERO}
                            alt={`${barber.nombre} ${barber.apellido}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = PLACEHOLDERS.BARBERO;
                            }}
                        />
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h3 className="text-5xl font-black text-slate-900">{barber.nombre} {barber.apellido}</h3>
                        <p className="inline-block bg-blue-50 text-[#3366FF] px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm">
                            {barber.especialidad || 'Estilista Profesional'}
                        </p>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                            {barber.descripcion || 'Especialista en cortes modernos y clásicos con años de experiencia transformando estilos.'}
                        </p>
                        <div className="flex items-center gap-6 justify-center md:justify-start pt-4">
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
              // Filtrar elementos nulos/indefinidos por seguridad
              (services || []).filter(Boolean).map((service) => (
                <button
                  key={service?.id_servicio_barbero || service?.id}
                  type="button"
                  onClick={() => {
                    if (!service) return;
                    setSelectedService(service);
                    setStep(3);
                  }}
                  className={`group rounded-[2.5rem] border-4 p-8 text-left transition-all ${selectedService?.id_servicio_barbero === service?.id_servicio_barbero ? 'border-[#3366FF] bg-[#3366FF] text-white shadow-2xl shadow-blue-200' : 'border-white bg-white hover:border-slate-100 shadow-xl'}`}
                >
                  <Scissors className={clsx("mb-6", selectedService?.id_servicio_barbero === service?.id_servicio_barbero ? 'text-blue-100' : 'text-[#3366FF]')} size={32} />
                  <p className={clsx("text-2xl font-black", selectedService?.id_servicio_barbero === service?.id_servicio_barbero ? 'text-white' : 'text-slate-900')}>
                    {service?.nombre_servicio || service?.servicio?.nombre || service?.servicio?.nombre_servicio || 'Servicio'}
                  </p>
                  <p className={clsx("mt-3 text-sm leading-relaxed", selectedService?.id_servicio_barbero === service?.id_servicio_barbero ? 'text-blue-100' : 'text-slate-500')}>
                    {service?.descripcion || service?.servicio?.descripcion || 'Sin descripción'}
                  </p>
                  <div className="mt-8 flex items-center justify-between">
                    <span className={clsx("text-3xl font-black", selectedService?.id_servicio_barbero === service?.id_servicio_barbero ? 'text-white' : 'text-[#3366FF]')}>
                      {formatMoney(service?.precio_barbero || service?.precio || service?.servicio?.precio_base || 0)}
                    </span>
                    <div className={clsx("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest", selectedService?.id_servicio_barbero === service?.id_servicio_barbero ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")}>
                      {service?.tiempo_servicio_minutos || service?.duracion || service?.servicio?.duracion_minutos || 30} min
                    </div>
                  </div>
                </button>
              ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] shadow-xl">
                    <p className="text-slate-400 font-black uppercase tracking-[0.35em] mb-4">No hay servicios registrados</p>
                    <p className="text-xl font-bold text-slate-800">Este barbero aún no ha configurado sus servicios.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* --- STEP 3: FOTO IA --- */}
        {step === 3 && (
          <section className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Foto IA</p>
                <h2 className="mt-3 text-4xl font-black text-slate-900">Personaliza tu corte con la simulación IA</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">Sube una foto o usa tu cámara para probar un estilo y enviarlo a tu barbero.</p>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-black uppercase tracking-[0.35em] text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                ← Cambiar Servicio
              </button>
            </div>

            <div className="rounded-[3rem] border border-slate-100 bg-white p-8 shadow-xl">
              <HaircutSimulator
                onSimulationComplete={(url, styleId) => {
                  if (url && styleId) {
                    setSimulatedLook({ url, styleId });
                  } else {
                    setSimulatedLook(null);
                  }
                }}
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full sm:w-auto py-3 px-6 bg-slate-900 text-white rounded-full font-black text-base shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"
              >
                Seguir sin hacerlo
              </button>
              <button
                type="button"
                disabled={!simulatedLook}
                onClick={() => setStep(4)}
                className="w-full sm:w-auto py-3 px-6 bg-[#3366FF] text-white rounded-full font-black text-base shadow-lg shadow-blue-200 hover:bg-[#2a5dd9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviarlo con la imagen
              </button>
            </div>
          </section>
        )}

        {/* --- STEP 4: FECHA --- */}
        {step === 4 && (
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
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setSelectedDate(newDate);
                    // Validar disponibilidad después de actualizar (defer para que la query se ejecute primero)
                    setTimeout(() => {
                      const checkDateAvailability = async () => {
                        try {
                          const avail = await barberService.getDisponibilidad(Number(id), newDate);
                          const hasAvailable = avail && avail.some((slot: any) => slot.disponible);
                          if (!hasAvailable) {
                            showNotification('No hay citas disponibles ese día. Selecciona otra fecha.', 'warning');
                          }
                        } catch (err) {
                          console.error('Error validating availability:', err);
                        }
                      };
                      checkDateAvailability();
                    }, 100);
                  }}
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
                onClick={() => setStep(5)}
                className="bg-[#3366FF] text-white px-12 py-5 rounded-full font-black text-xl shadow-xl shadow-blue-200 disabled:opacity-50"
              >
                VER HORARIOS <ArrowRight className="inline ml-2" />
              </button>
            </div>
          </section>
        )}

        {/* --- STEP 5: HORA --- */}
        {step === 5 && (
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
                onClick={() => setStep(4)}
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
                {hourlyAvailability && hourlyAvailability.length > 0 ? (
                  hourlyAvailability.map((slot: any) => (
                  <button
                    key={slot.hora}
                    type="button"
                    disabled={!slot.disponible}
                    onClick={() => {
                    if (!slot.disponible) return;
                    // Normalizamos a HH:mm conservando solo hora y minutos
                    const horaSimple = slot.hora.slice(0,5);
                    setSelectedTime(horaSimple);
                    setStep(6);
                    }}
                    className={`rounded-[2.5rem] border-4 p-8 font-black text-2xl transition-all shadow-xl group ${selectedTime === slot.hora.slice(0,5) ? 'border-[#3366FF] bg-[#3366FF] text-white shadow-blue-200 scale-105' : slot.disponible ? 'border-white bg-white text-slate-900 hover:border-blue-100 hover:scale-105' : 'border-red-300 bg-red-100 text-red-600 cursor-not-allowed'}`}
                  >
                    {slot.hora.slice(0,5)}
                    <div className={clsx("mt-4 text-xs font-black uppercase tracking-widest", slot.disponible ? (selectedTime === slot.hora.slice(0,5) ? 'text-blue-100' : 'text-[#3366FF]') : 'text-red-600')}>
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

        {/* --- STEP 6: RESUMEN --- */}
        {step === 6 && !confirmed && (
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
                    <div className="h-24 w-24 rounded-3xl bg-slate-100 overflow-hidden shadow-inner border-2 border-slate-50">
                        <img 
                          src={barber.foto_perfil_url || PLACEHOLDERS.BARBERO} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = PLACEHOLDERS.BARBERO;
                          }}
                        />
                    </div>
                    <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-400 font-black">Barbero</p>
                        <p className="text-3xl font-black text-slate-900">{barber.nombre} {barber.apellido}</p>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-black mb-4">Servicio seleccionado</p>
                    <p className="text-2xl font-black text-slate-900">
                      {selectedService?.nombre_servicio || selectedService?.servicio?.nombre || selectedService?.servicio?.nombre_servicio || 'Servicio'}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-3xl font-black text-[#3366FF]">
                          {formatMoney(selectedService?.precio_barbero || selectedService?.precio || selectedService?.servicio?.precio_base || 0)}
                        </span>
                        <div className="bg-white px-4 py-2 rounded-xl text-xs font-black text-slate-500 shadow-sm border border-slate-100">
                            {selectedService?.tiempo_servicio_minutos || selectedService?.duracion || selectedService?.servicio?.duracion_minutos || 30} MIN
                        </div>
                    </div>
                  </div>

                  {simulatedLook && (
                    <div className="p-6 bg-amber-50/50 rounded-[2.5rem] border border-amber-100 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl overflow-hidden shadow-inner border border-amber-200 shrink-0">
                        <img src={simulatedLook.url} alt="Simulación IA" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-amber-600 font-black">Estilo IA Solicitado</p>
                        <p className="text-lg font-black text-slate-900 capitalize">{simulatedLook.styleId}</p>
                        <p className="text-xs text-slate-500">Se enviará el resultado de la simulación a tu barbero</p>
                      </div>
                    </div>
                  )}
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

                   {/* Elección de pago configurable */}
                   <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#3366FF]" /> Configuración de Pago
                     </p>
                     <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentType('abono')}
                          className={clsx(
                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1",
                            paymentType === 'abono' 
                              ? "bg-white border-[#3366FF] shadow-md" 
                              : "bg-transparent border-slate-100 opacity-60 hover:opacity-100"
                          )}
                        >
                          <span className={clsx("text-[10px] font-black", paymentType === 'abono' ? "text-[#3366FF]" : "text-slate-400")}>PAGAR ABONO</span>
                          <span className="text-sm font-black text-slate-900">50% ({formatMoney((selectedService?.precio_barbero || selectedService?.precio || 0) * 0.5)})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentType('total')}
                          className={clsx(
                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1",
                            paymentType === 'total' 
                              ? "bg-white border-[#3366FF] shadow-md" 
                              : "bg-transparent border-slate-100 opacity-60 hover:opacity-100"
                          )}
                        >
                          <span className={clsx("text-[10px] font-black", paymentType === 'total' ? "text-[#3366FF]" : "text-slate-400")}>PAGO TOTAL</span>
                          <span className="text-sm font-black text-slate-900">100% ({formatMoney(selectedService?.precio_barbero || selectedService?.precio || 0)})</span>
                        </button>
                     </div>
                   </div>

                   <button
                    onClick={handleBooking}
                    disabled={isBooking || isBarberInactive}
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

        {/* --- SUCCESS OR PENDING STATE --- */}
        {confirmed && (
          paymentStatus === 'success' ? (
            <div className="rounded-[4rem] bg-white border-4 border-green-500 p-16 text-center shadow-2xl animate-appearance">
              <div className="w-32 h-32 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-100">
                  <CheckCircle2 size={64} />
              </div>
              <h3 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">¡Reserva Completada y Confirmada!</h3>
              <p className="text-xl text-slate-500 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
                  Tu cita con {barber.nombre} ha sido agendada exitosamente y el pago de tu abono fue recibido y validado de forma automática por Mercado Pago.
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
          ) : (
            <div className={clsx(
              "rounded-[4rem] bg-white border-4 p-16 text-center shadow-2xl transition-all duration-500",
              timeRemaining <= 0 ? "border-rose-500" : "border-amber-500"
            )}>
              {timeRemaining <= 0 ? (
                <>
                  <div className="w-32 h-32 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-rose-100 animate-pulse">
                      <AlertCircle size={64} />
                  </div>
                  <h3 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">¡Tiempo de Reserva Expirado!</h3>
                  <p className="text-xl text-slate-500 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
                      El límite de 3 minutos para completar el pago ha expirado. Para garantizar la disponibilidad de la agenda, la reserva provisional de tu hora ha sido liberada.
                      <span className="block mt-4 text-sm text-rose-500 font-black uppercase tracking-wider">
                          Por favor, realiza un nuevo agendamiento.
                      </span>
                  </p>
                  <div className="flex flex-col gap-6 sm:flex-row justify-center">
                    <button
                      onClick={() => {
                        setConfirmed(false);
                        setStep(2);
                        setSelectedService(null);
                        setSelectedTime('');
                        setCreatedBookingId(null);
                        setPaymentUrl('');
                        setBookingCreationTime(null);
                      }}
                      className="bg-rose-600 text-white px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all"
                    >
                      NUEVO AGENDAMIENTO
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="bg-white text-slate-700 border-4 border-slate-100 px-12 py-6 rounded-full font-black text-xl hover:bg-slate-50 active:scale-95 transition-all"
                    >
                      VOLVER AL INICIO
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-amber-100 animate-pulse">
                      <Clock size={64} />
                  </div>
                  <h3 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">¡Reserva Guardada, Falta Pago!</h3>
                  
                  {/* Countdown Badge */}
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-black text-sm uppercase tracking-wider mb-8 mx-auto shadow-md">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    Tiempo restante: <span className="text-amber-400 font-mono text-base ml-1">{formatCountdownTime(timeRemaining)}</span>
                  </div>

                  <p className="text-xl text-slate-500 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
                      Tu cita con {barber.nombre} se encuentra pre-reservada provisionalmente. 
                      Para confirmarla definitivamente y asegurar tu espacio, debes realizar el pago antes de que se agote el tiempo de espera de 3 minutos.
                  </p>
                  
                  <div className="flex flex-col gap-6 sm:flex-row justify-center">
                    <button
                      onClick={() => {
                        if (paymentUrl) {
                          window.open(paymentUrl, '_blank');
                        }
                        setShowWaitingModal(true);
                      }}
                      className="bg-[#3366FF] text-white px-12 py-6 rounded-full font-black text-xl shadow-2xl shadow-blue-200 hover:bg-[#2563EB] hover:scale-105 active:scale-95 transition-all"
                    >
                      COMPLETAR PAGO AHORA
                    </button>
                    <button
                      onClick={() => navigate('/bookings')}
                      className="bg-slate-900 text-white px-12 py-6 rounded-full font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      PAGAR DESPUÉS / MIS CITAS
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        )}
      </div>

      {createdBookingId && paymentUrl && (
        <PaymentWaitingModal
          isOpen={showWaitingModal}
          onClose={() => {
            setShowWaitingModal(false);
            setConfirmed(true);
            setPaymentStatus('pending');
          }}
          onSuccess={() => {
            setShowWaitingModal(false);
            showNotification("¡Pago recibido con éxito!", "success");
            setConfirmed(true);
            setPaymentStatus('success');
          }}
          bookingId={createdBookingId}
          paymentUrl={paymentUrl}
        />
      )}
    </div>
  );
};

export default UniversalBookingPage;
