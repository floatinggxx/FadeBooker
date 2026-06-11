import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Star, Clock, Calendar, CheckCircle2, ChevronLeft } from 'lucide-react';
import { STUDIO_DANGER_BARBERS, STUDIO_DANGER_SERVICES, STUDIO_DANGER_TIMES } from '@/lib/data/studioDangerData';
import { PLACEHOLDERS, FALLBACK_URLS } from '@/lib/utils/placeholders';
import { ServicioBarbero } from '@/types';

type StudioDangerTime = { time: string; available: boolean };

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

const formatDateLabel = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
};

const StudioDangerBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState(STUDIO_DANGER_BARBERS[0]);
  const [selectedService, setSelectedService] = useState<ServicioBarbero | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const defaultBarberId = Number(searchParams.get('barberoId'));
    const barberFromUrl = STUDIO_DANGER_BARBERS.find((barber) => barber.id === defaultBarberId);
    if (barberFromUrl) {
      setSelectedBarber(barberFromUrl);
    }
  }, [searchParams]);

  const availableServices = useMemo(() => {
    return STUDIO_DANGER_SERVICES.filter((service) => service.id_barbero === selectedBarber.id);
  }, [selectedBarber]);

  const selectedDateLabel = formatDateLabel(selectedDate);

  const isStepCompleted = (currentStep: number) => {
    if (currentStep === 1) return !!selectedBarber;
    if (currentStep === 2) return !!selectedService;
    if (currentStep === 3) return !!selectedDate;
    if (currentStep === 4) return !!selectedTime;
    return false;
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const resetFlow = () => {
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setStep(1);
    setConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white shadow-lg shadow-slate-950/20">
              <span>StudioDanger</span>
              <Star size={14} className="text-yellow-400" />
              <span>4.9</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900">Reserva tu cita en StudioDanger</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
              Selecciona tu barbero premium, elige el servicio ideal, escoge la fecha y bloquea un horario. Al final verás el resumen de tu reserva para confirmar.
            </p>
          </div>
          <Link
            to="/studiodeanger"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-black text-slate-900 shadow-lg shadow-slate-200 transition hover:bg-slate-50"
          >
            Volver a StudioDanger
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {['Barbero', 'Servicio', 'Fecha', 'Hora'].map((title, index) => (
            <div
              key={title}
              className={`rounded-[2rem] p-6 text-center border-2 ${step === index + 1 ? 'border-[#3366FF] bg-slate-50 shadow-xl' : 'border-transparent bg-white/80'} transition-all`}
            >
              <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">Paso {index + 1}</p>
              <h2 className="mt-4 text-xl font-black text-slate-900">{title}</h2>
              <p className="mt-3 text-sm text-slate-500">{isStepCompleted(index + 1) ? 'Completo' : 'Pendiente'}</p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Barberos disponibles</p>
                <h2 className="mt-3 text-4xl font-black text-slate-900">Selecciona tu barbero de confianza</h2>
              </div>
              <span className="text-sm text-slate-500">StudioDanger - Quilicura</span>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {STUDIO_DANGER_BARBERS.map((barber) => (
                <button
                  key={barber.id}
                  type="button"
                  onClick={() => {
                    setSelectedBarber(barber);
                    setStep(2);
                  }}
                  className={`group rounded-[2.5rem] border-4 p-6 text-left transition-all shadow-xl ${selectedBarber.id === barber.id ? 'border-[#3366FF] bg-slate-100 shadow-blue-200' : 'border-white bg-white hover:border-slate-200 hover:shadow-slate-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 overflow-hidden rounded-[2.2rem] bg-slate-900">
                      <img
                        src={barber.foto_perfil_url}
                        alt={`${barber.nombre} ${barber.apellido}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (img.src !== FALLBACK_URLS.BARBERO) img.src = FALLBACK_URLS.BARBERO;
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900">{barber.nombre} {barber.apellido}</p>
                      <p className="mt-1 text-sm uppercase tracking-[0.35em] text-slate-500 font-bold">{barber.especialidad}</p>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#3366FF]/10 px-3 py-2 text-sm font-black text-[#3366FF]">
                        <Star size={14} /> {barber.calificacion.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-slate-500 leading-relaxed">{barber.descripcion}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Servicio</p>
                <h2 className="mt-3 text-4xl font-black text-slate-900">Selecciona el servicio ideal</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">Cada servicio está diseñado para una experiencia premium en StudioDanger.</p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-full border border-[#3366FF] bg-white px-7 py-3 text-sm font-black uppercase tracking-[0.35em] text-[#3366FF] shadow-sm transition hover:bg-[#eff6ff]"
              >
                Volver a barberos
              </button>
            </div>

            <div className="rounded-[3rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 font-black">Barbero seleccionado</p>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-900 text-white text-2xl font-black">
                  {selectedBarber.nombre.charAt(0)}{selectedBarber.apellido.charAt(0)}
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{selectedBarber.nombre} {selectedBarber.apellido}</p>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#3366FF] font-black">{selectedBarber.especialidad}</p>
                  <p className="mt-2 text-slate-600">{selectedBarber.descripcion}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {availableServices.map((service) => (
                <button
                  key={service?.id_servicio_barbero || service?.id}
                  type="button"
                  onClick={() => {
                    setSelectedService(service);
                    setStep(3);
                  }}
                  className="group rounded-[2.5rem] border-4 border-transparent bg-[#3366FF] p-8 text-left text-white shadow-2xl shadow-blue-200 transition hover:bg-[#2a5dd9]"
                >
                  <p className="text-xl font-black">{service.servicio?.nombre_servicio}</p>
                  <p className="mt-3 text-sm text-blue-100 leading-relaxed">{service.servicio?.descripcion}</p>
                  <div className="mt-6 flex items-center justify-between gap-4 text-slate-100">
                    <span className="text-2xl font-black">{formatMoney(service.precio_barbero || service.servicio?.precioBase || 0)}</span>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] font-black">{service.tiempo_servicio_minutos} min</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Fecha</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900">Selecciona una fecha disponible</h2>
              <p className="mt-4 text-slate-600 leading-relaxed">Elige el día que mejor se adapte a tu agenda y continúa con la hora.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="rounded-[3rem] bg-white p-10 shadow-xl shadow-slate-200">
                <label className="block text-sm font-black uppercase tracking-[0.35em] text-slate-500 mb-4">Fecha de reserva</label>
                <input
                  type="date"
                  className="w-full rounded-[2rem] border-4 border-slate-100 bg-slate-50 p-6 text-2xl font-black text-slate-900 outline-none transition focus:border-[#3366FF]"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <p className="mt-4 text-sm font-black uppercase tracking-[0.35em] text-[#3366FF]">Fecha actual seleccionada:</p>
                <p className="text-lg font-black text-slate-900">{selectedDateLabel}</p>
                <p className="mt-4 text-sm text-slate-500">Selecciona un día laboral disponible dentro del horario de la barbería.</p>
              </div>

              <div className="rounded-[3rem] bg-[#0F172A] p-10 text-white shadow-2xl shadow-slate-950/20 border border-[#1E293B]">
                <p className="uppercase tracking-[0.35em] text-sm text-slate-400 font-black">Consejo premium</p>
                <h3 className="mt-4 text-3xl font-black">Agenda con anticipación</h3>
                <p className="mt-4 text-slate-300 leading-relaxed">Las mejores franjas se ocupan rápido. Si estás buscando un horario puntual, confirma tu servicio y horario cuanto antes.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-full bg-white px-8 py-4 font-black text-slate-900 shadow-lg shadow-slate-200 transition hover:bg-slate-100"
              >
                Volver al servicio
              </button>
              <button
                type="button"
                disabled={!selectedDate}
                onClick={() => setStep(4)}
                className="rounded-full bg-[#3366FF] px-8 py-4 font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#2a5dd9] disabled:opacity-50"
              >
                Elegir hora
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Hora</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900">Selecciona el horario perfecto</h2>
              <p className="mt-4 text-slate-600 leading-relaxed">Las franjas horarias disponibles se muestran abajo para que elijas la que mejor te acomode.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STUDIO_DANGER_TIMES.map((slot: StudioDangerTime) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => {
                    if (!slot.available) return;
                    setSelectedTime(slot.time);
                    setStep(5);
                  }}
                  className={`rounded-[2rem] border-4 p-6 font-black text-xl transition ${selectedTime === slot.time ? 'border-[#3366FF] bg-[#3366FF] text-white shadow-blue-200' : slot.available ? 'border-transparent bg-[#eff6ff] text-slate-900 shadow-lg shadow-slate-200 hover:bg-[#dbeafe]' : 'border-red-400 bg-[#fee2e2] text-red-800 shadow-inner opacity-90 cursor-not-allowed'}`}
                >
                  <div>{slot.time}</div>
                  <div className={`mt-3 rounded-full px-3 py-1 text-xs font-black uppercase ${slot.available ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-[#FECACA] text-[#B91C1C]'}`}>
                    {slot.available ? 'Disponible' : 'Ocupado'}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-full bg-white px-8 py-4 font-black text-slate-900 shadow-lg shadow-slate-200 transition hover:bg-slate-100"
              >
                Cambiar fecha
              </button>
              <button
                type="button"
                disabled={!selectedTime}
                onClick={() => setStep(5)}
                className="rounded-full bg-[#3366FF] px-8 py-4 font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#2a5dd9] disabled:opacity-50"
              >
                Ver resumen
              </button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Resumen</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900">Confirma tu reserva</h2>
              <p className="mt-4 text-slate-600 leading-relaxed">Revisa los datos antes de finalizar. El pago del abono lo veremos en el siguiente paso.</p>
            </div>

            <div className="rounded-[3rem] bg-white p-10 shadow-2xl shadow-slate-200 border-4 border-[#3366FF]">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Barbero</p>
                    <p className="mt-3 text-2xl font-black text-slate-900">{selectedBarber.nombre} {selectedBarber.apellido}</p>
                    <p className="mt-2 text-slate-500">{selectedBarber.especialidad}</p>
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Servicio</p>
                    <p className="mt-3 text-2xl font-black text-slate-900">{selectedService?.servicio?.nombre_servicio}</p>
                    <p className="mt-2 text-slate-500">{selectedService?.servicio?.descripcion}</p>
                  </div>
                </div>

                <div className="space-y-4 rounded-[2.5rem] bg-[#F8FAFC] p-8">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Fecha</p>
                    <p className="mt-3 text-2xl font-black text-slate-900">{selectedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Hora</p>
                    <p className="mt-3 text-2xl font-black text-[#3366FF]">{selectedTime}</p>
                  </div>
                  <div className="rounded-[2rem] bg-white p-6 shadow-inner shadow-slate-100 border border-slate-200">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Total estimado</p>
                    <p className="mt-3 text-4xl font-black text-slate-900">{formatMoney(selectedService?.precio_barbero || selectedService?.servicio?.precioBase || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="rounded-full bg-white px-8 py-4 font-black text-slate-900 shadow-lg shadow-slate-200 transition hover:bg-slate-100"
                >
                  Modificar horario
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="rounded-full bg-[#3366FF] px-8 py-4 font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#2a5dd9]"
                >
                  Confirmar reserva
                </button>
              </div>
            </div>
          </section>
        )}

        {confirmed && (
          <div className="rounded-[3rem] border border-green-200 bg-green-50 p-10 text-center shadow-lg">
            <h3 className="text-3xl font-black text-green-700">Reserva preparada</h3>
            <p className="mt-4 text-slate-700">Tu reserva está lista. Más adelante podrás avanzar con el pago del abono para asegurar tu horario.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
              <button
                onClick={() => navigate('/')}
                className="rounded-full bg-white px-8 py-4 font-black text-slate-900 shadow-lg shadow-slate-200 transition hover:bg-slate-100"
              >
                Volver a inicio
              </button>
              <button
                onClick={resetFlow}
                className="rounded-full bg-[#3366FF] px-8 py-4 font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#2a5dd9]"
              >
                Agendar otra cita
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioDangerBookingPage;
