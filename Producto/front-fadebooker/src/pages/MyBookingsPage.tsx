import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/lib/api/bookingService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import BookingsSection from '@/components/organisms/BookingsSection';

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

  return sortedAppointments && sortedAppointments.length ? (
    <BookingsSection
      bookings={sortedAppointments.map((c: any) => ({
        id: c.id,
        fecha: c.fecha,
        hora: c.hora,
        barberoName: c.barbero?.nombre || 'No especificado',
        servicioName: c.servicio?.servicio?.nombre || c.servicio?.nombre || 'Sin datos',
        estado: c.estado,
        notas: c.notas,
      }))}
    />
  ) : (
    <div className="card-surface page-message">No tienes citas registradas. Explora barberías y reserva tu próximo corte.</div>
  );
};

export default MyBookingsPage;
