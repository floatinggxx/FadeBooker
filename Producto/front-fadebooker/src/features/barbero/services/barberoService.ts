import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const barberoService = {
  getBarberoInfo: async (idBarbero: number) => {
    const response = await axios.get(`${API_URL}/barberos/${idBarbero}`);
    return response.data;
  },

  getBarberoStats: async (idBarbero: number, period: 'day' | 'week' | 'month' = 'day') => {
    const response = await axios.get(`${API_URL}/barberos/${idBarbero}/stats`, { params: { period } });
    return response.data;
  },

  getBarberoBookings: async (idBarbero: number, date?: string) => {
    const response = await axios.get(`${API_URL}/barberos/${idBarbero}/citas`, { params: { date } });
    return response.data;
  },

  manualBooking: async (data: any) => {
    const response = await axios.post(`${API_URL}/citas`, { ...data, origen: 'manual' });
    return response.data;
  }
};
