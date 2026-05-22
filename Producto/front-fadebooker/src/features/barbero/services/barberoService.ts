import api from '../../../lib/api';

export const barberoService = {
  getBarberoInfo: async (idBarbero: number) => {
    const response = await api.get(`/barberos/${idBarbero}`);
    return response.data;
  },

  getBarberoStats: async (idBarbero: number, period: 'day' | 'week' | 'month' = 'day') => {
    const response = await api.get(`/barberos/${idBarbero}/stats`, { params: { period } });
    return response.data;
  },

  getTiendaStats: async (idTienda: number) => {
    const response = await api.get(`/reportes/dashboard-stats`, { 
      params: { tiendaId: idTienda }
    });
    return response.data;
  },

  getBarberoBookings: async (idBarbero: number, date?: string, period: 'day' | 'week' | 'month' = 'day') => {
    const response = await api.get(`/barberos/${idBarbero}/citas`, { params: { date, period } });
    return response.data;
  },

  getTiendaBookings: async (idTienda: number, date?: string, period: 'day' | 'week' | 'month' = 'day') => {
    const response = await api.get(`/citas`, { params: { tiendaId: idTienda, fecha: date, period } });
    return response.data;
  },

  manualBooking: async (data: any) => {
    const response = await api.post(`/citas`, { ...data, origen: 'manual' });
    return response.data;
  }
};
