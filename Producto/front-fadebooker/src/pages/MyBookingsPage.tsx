import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/lib/api/bookingService';

const MyBookingsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery(['my-bookings'], bookingService.listCitas);

  if (isLoading) return <div className="p-6">Cargando tus citas...</div>;
  if (error) return <div className="p-6 text-red-600">Error al cargar citas.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Citas</h1>
      {data && data.length ? (
        <ul className="space-y-3">
          {data.map((c: any) => (
            <li key={c.id} className="border p-3 rounded">
              <strong>{new Date(c.fechaHora).toLocaleString()}</strong>
              <div>Estado: {c.estado}</div>
            </li>
          ))}
        </ul>
      ) : <p>No tienes citas.</p>}
    </div>
  );
};

export default MyBookingsPage;
