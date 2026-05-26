import { useQuery } from '@tanstack/react-query';
import { barberoService } from '../services/barberoService';

export const useBarberoDashboard = (idBarbero: number, period: 'day' | 'week' | 'month' = 'day', idTienda?: number, selectedDate?: string) => {
  const statsQuery = useQuery({
    queryKey: ['dashboard-stats', idBarbero, idTienda, period, selectedDate],
    queryFn: () => idTienda 
      ? barberoService.getTiendaStats(idTienda)
      : barberoService.getBarberoStats(idBarbero, period),
    enabled: !!idBarbero || !!idTienda,
  });

  const bookingsQuery = useQuery({
    queryKey: ['barbero-bookings', idBarbero, idTienda, period, selectedDate],
    queryFn: () => idTienda 
      ? barberoService.getTiendaBookings(idTienda, selectedDate, period)
      : barberoService.getBarberoBookings(idBarbero, selectedDate, period),
    enabled: !!idBarbero || !!idTienda,
  });

  const infoQuery = useQuery({
    queryKey: ['barbero-info', idBarbero],
    queryFn: () => barberoService.getBarberoInfo(idBarbero),
    enabled: !!idBarbero,
  });

  return {
    stats: statsQuery.data,
    bookings: bookingsQuery.data,
    info: infoQuery.data,
    isLoading: statsQuery.isLoading || bookingsQuery.isLoading || infoQuery.isLoading,
    refetch: () => {
      statsQuery.refetch();
      bookingsQuery.refetch();
    }
  };
};
