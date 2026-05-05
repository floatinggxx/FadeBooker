import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { barberService } from '@/lib/api/barberService';

const BarberDetailPage: React.FC = () => {
  const { id } = useParams();
  const { data: barber, isLoading, error } = useQuery({
    queryKey: ['barber', id],
    queryFn: () => barberService.getBarberoById(Number(id)),
    enabled: !!id,
  });
  // const { data: services } = useQuery(['barber-services', id], () => getBarberServices(id as string), { enabled: !!id });

  if (isLoading) return <div className="p-10">Cargando...</div>;
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
              <li key={s.id} className="border rounded p-3">{s.nombre} — {s.duracionMinutos} min — ${s.precio}</li>
            ))}
          </ul>
        ) : <p>No hay servicios registrados.</p>}
      </div>
    </div>
  );
};

export default BarberDetailPage;
