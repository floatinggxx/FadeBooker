import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { barberService } from '@/lib/api/barberService';

const BarberDetailPage: React.FC = () => {
  const { id } = useParams();
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

  if (loadingBarber || loadingServices) return <div className="p-10">Cargando...</div>;
  if (error || !barber) return <div className="p-10 text-red-600">No se encontró el barbero.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{barber.nombre}</h1>
      <p className="text-sm text-gray-600">{barber.especialidad}</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Servicios</h2>
        {services && services.length ? (
          <ul className="mt-2 space-y-2">
            {services.map((s: any) => (
              <li key={s.id} className="border rounded p-3">{s.servicio?.nombre || 'Servicio'} — {(s.duracion ?? s.servicio?.duracion) || 'N/A'} min — ${(s.precio ?? s.servicio?.precioBase) || 'N/A'}</li>
            ))}
          </ul>
        ) : <p>No hay servicios registrados.</p>}
      </div>
    </div>
  );
};

export default BarberDetailPage;
