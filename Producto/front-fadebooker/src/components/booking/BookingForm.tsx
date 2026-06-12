import React from 'react';
import { useForm } from 'react-hook-form';
import { barberService } from '@/lib/api/barberService';
import { bookingService } from '@/lib/api/bookingService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { Barbero, ServicioBarbero } from '@/types';

type FormData = {
  barberoId: string;
  servicioBarberoId: string;
  fechaHora: string;
};

const BookingForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { register, handleSubmit, watch, setValue } = useForm<FormData>();
  const { user } = useAuth();
  const [barbers, setBarbers] = React.useState<Barbero[]>([]);
  const [services, setServices] = React.useState<ServicioBarbero[]>([]);
  const [serviceLoading, setServiceLoading] = React.useState(false);
  const [serviceError, setServiceError] = React.useState('');

  React.useEffect(() => {
    barberService.listBarberos().then(setBarbers).catch(() => setBarbers([]));
  }, []);

  const barberoId = watch('barberoId');
  React.useEffect(() => {
    if (barberoId) {
      setServiceLoading(true);
      setServiceError('');
      barberService.getServicios(Number(barberoId))
        .then((loadedServices) => setServices(loadedServices))
        .catch(() => {
          setServices([]);
          setServiceError('No se pudieron cargar los servicios de este barbero. Intenta de nuevo más tarde.');
        })
        .finally(() => setServiceLoading(false));
      setValue('servicioBarberoId', '');
    } else {
      setServices([]);
      setServiceError('');
      setValue('servicioBarberoId', '');
    }
  }, [barberoId, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      alert('Debes iniciar sesión para agendar una reserva.');
      return;
    }

    try {
      const [fecha, hora] = data.fechaHora.split('T');
      const servicioSeleccionado = services.find(s => String(s.id) === String(data.servicioBarberoId) || String(s.id_servicio_barbero) === String(data.servicioBarberoId));
      const duracion = Number(servicioSeleccionado?.duracion ?? servicioSeleccionado?.servicio?.duracion ?? 60);
      const monto = Number(servicioSeleccionado?.precio ?? servicioSeleccionado?.precio_barbero ?? servicioSeleccionado?.servicio?.precioBase ?? 0);
      await bookingService.crearCita({
        clienteId: Number(user.id || user.id_usuario),
        barberoId: Number(data.barberoId),
        servicioBarberoId: Number(data.servicioBarberoId),
        id_servicio: Number(data.servicioBarberoId),
        fecha_hora_inicio: `${fecha}T${hora}:00`,
        duracion_minutos: duracion,
        duracion: duracion,
        monto_total: monto,
        fecha: fecha,
        hora: hora,
      });
      alert('Reserva creada correctamente');
      onSuccess && onSuccess();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error al crear la reserva');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-w-lg">
      <div>
        <label className="block">Barbero</label>
        <select {...register('barberoId', { required: true })} className="w-full border p-2 rounded">
          <option value="">Seleccione</option>
          {barbers.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
      </div>

      <div>
        <label className="block">Servicio</label>
        <select {...register('servicioBarberoId', { required: true })} className="w-full border p-2 rounded">
          <option value="">Seleccione</option>
          {serviceLoading && <option disabled>Cargando servicios...</option>}
          {services.map(s => (
            <option key={s.id || s.id_servicio_barbero} value={s.id || s.id_servicio_barbero}>
              {s.servicio?.nombre || `Servicio ${s.servicio?.id_servicio || s.id || s.id_servicio_barbero}`} — {(((s.duracion ?? s.servicio?.duracion) || s.servicio?.duracion_minutos) || 'N/A')} min
            </option>
          ))}
        </select>
        {serviceError && <p className="text-sm text-red-600 mt-2">{serviceError}</p>}
      </div>

      <div>
        <label className="block">Fecha y hora</label>
        <input {...register('fechaHora', { required: true })} type="datetime-local" className="w-full border p-2 rounded" />
      </div>

      <div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Reservar</button>
      </div>
    </form>
  );
};

export default BookingForm;
