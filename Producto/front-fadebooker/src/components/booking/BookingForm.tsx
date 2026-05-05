import React from 'react';
import { useForm } from 'react-hook-form';
import { barberService } from '@/lib/api/barberService';
import { bookingService } from '@/lib/api/bookingService';
import { Barbero } from '@/types';

type FormData = {
  barberoId: string;
  servicioId: string;
  fechaHora: string;
};

const BookingForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { register, handleSubmit, watch, setValue } = useForm<FormData>();
  const [barbers, setBarbers] = React.useState<Barbero[]>([]);
  const [services, setServices] = React.useState<any[]>([]);

  React.useEffect(() => {
    barberService.listBarberos().then(setBarbers).catch(() => setBarbers([]));
  }, []);

  const barberoId = watch('barberoId');
  React.useEffect(() => {
    if (barberoId) {
      // getBarberServices(barberoId).then(setServices).catch(() => setServices([]));
      setServices([]);
      setValue('servicioId', '');
    }
  }, [barberoId, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await bookingService.crearCita({
        barberoId: data.barberoId,
        servicioId: data.servicioId,
        fechaHora: data.fechaHora,
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
        <select {...register('servicioId', { required: true })} className="w-full border p-2 rounded">
          <option value="">Seleccione</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.nombre} — {s.duracionMinutos} min</option>)}
        </select>
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
