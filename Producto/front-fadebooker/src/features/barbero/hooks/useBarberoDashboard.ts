import { useQuery } from '@tanstack/react-query';
import { barberoService } from '../services/barberoService';

export const useBarberoDashboard = (idBarbero: number, period: 'day' | 'week' | 'month' = 'day') => {
  const statsQuery = useQuery({
    queryKey: ['barbero-stats', idBarbero, period],
    queryFn: () => barberoService.getBarberoStats(idBarbero, period),
    enabled: !!idBarbero,
  });

  const bookingsQuery = useQuery({
    queryKey: ['barbero-bookings', idBarbero],
    queryFn: () => barberoService.getBarberoBookings(idBarbero),
    enabled: !!idBarbero,
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
