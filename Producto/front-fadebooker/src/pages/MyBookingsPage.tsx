import React, { useMemo } from 'react';
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

  const sortedAppointments = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a: any, b: any) => new Date(`${a.fecha} ${a.hora}`).getTime() - new Date(`${b.fecha} ${b.hora}`).getTime());
  }, [data]);

  if (!userId) {
    return <div className="page-content container page-message">Inicia sesión para ver tus citas y gestionar tus reservas.</div>;
  }

  if (isLoading) return <div className="page-content container page-message">Cargando tus citas...</div>;
  if (error) return <div className="page-content container page-message">Error al cargar tus citas.</div>;

  return (
    <div className="page-content container">
      <div className="section-heading">
        <h1>Mis Citas</h1>
        <p>Revisa tus próximas reservas y accede a la información de cada barbero.</p>
      </div>
      {sortedAppointments && sortedAppointments.length ? (
        <div className="grid gap-4">
          {sortedAppointments.map((c: any) => {
            const fechaHora = `${c.fecha} ${c.hora}`;
            return (
              <article key={c.id} className="booking-card card-surface">
                <h3>{new Date(fechaHora).toLocaleString()}</h3>
                <p><strong>Barbero:</strong> {c.barbero?.nombre || 'No especificado'}</p>
                <p><strong>Servicio:</strong> {c.servicio?.servicio?.nombre || c.servicio?.nombre || 'Sin datos'}</p>
                <p><strong>Estado:</strong> {c.estado}</p>
                {c.notas && <p><strong>Notas:</strong> {c.notas}</p>}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="card-surface page-message">No tienes citas registradas. Explora barberías y reserva tu próximo corte.</div>
      )}
    </div>
  );
};

export default MyBookingsPage;
