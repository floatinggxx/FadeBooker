import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/lib/api/bookingService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user ? Number(user.id) : undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-bookings', userId],
    queryFn: () => bookingService.getCitasByCliente(userId as number),
    enabled: !!userId,
  });

  if (!userId) {
    return <div className="p-6">Inicia sesión para ver tus citas y gestionar tus reservas.</div>;
  }

  if (isLoading) return <div className="p-6">Cargando tus citas...</div>;
  if (error) return <div className="p-6 text-red-600">Error al cargar citas.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Citas</h1>
      {data && data.length ? (
        <ul className="space-y-3">
          {data.map((c: any) => {
            const fechaHora = c.fechaHora || `${c.fecha}T${c.hora}`;
            return (
              <li key={c.id} className="border p-3 rounded">
                <strong>{new Date(fechaHora).toLocaleString()}</strong>
                <div>Barbero: {c.barbero?.nombre || 'No especificado'}</div>
                <div>Servicio: {c.servicio?.servicio?.nombre || c.servicio?.nombre || 'Sin datos'}</div>
                <div>Estado: {c.estado}</div>
                {c.notas && <div>Notas: {c.notas}</div>}
              </li>
            );
          })}
        </ul>
      ) : <p>No tienes citas registradas.</p>}
    </div>
  );
};

export default MyBookingsPage;
