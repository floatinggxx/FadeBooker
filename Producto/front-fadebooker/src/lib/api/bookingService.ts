import api from './axios';

export interface Booking {
  id: string;
  clienteId: string;
  barberoId: string;
  servicioId: string;
  fechaHora: string;
  estado: string;
}

export const createBooking = async (payload: any) => {
  const resp = await api.post('/citas', payload);
  return resp.data;
};

export const listMyBookings = async (): Promise<Booking[]> => {
  const resp = await api.get('/citas/mis');
  return resp.data;
};

export default { createBooking, listMyBookings };
import api from '../api';
import { Cita, CreateCitaRequest } from '@/types';

export const bookingService = {
  // Crear una nueva cita
  async crearCita(data: CreateCitaRequest): Promise<Cita> {
    const response = await api.post<Cita>('/citas', data);
    return response.data;
  },

  // Obtener una cita por ID
  async getCitaById(citaId: number): Promise<Cita> {
    const response = await api.get<Cita>(`/citas/${citaId}`);
    return response.data;
  },

  // Listar todas las citas (filtrable por cliente)
  async listCitas(clienteId?: number): Promise<Cita[]> {
    const params = clienteId ? { clienteId } : {};
    const response = await api.get<Cita[]>('/citas', { params });
    return response.data;
  },

  // Listar citas de un cliente específico
  async getCitasByCliente(clienteId: number): Promise<Cita[]> {
    const response = await api.get<Cita[]>('/citas', {
      params: { clienteId }
    });
    return response.data;
  },

  // Listar citas de un barbero específico
  async getCitasByBarbero(barberoId: number): Promise<Cita[]> {
    const response = await api.get<Cita[]>('/citas', {
      params: { barberoId }
    });
    return response.data;
  },

  // Actualizar estado de una cita
  async cambiarEstadoCita(citaId: number, estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada'): Promise<Cita> {
    const response = await api.put<Cita>(`/citas/${citaId}`, { estado });
    return response.data;
  },

  // Cancelar una cita
  async cancelarCita(citaId: number): Promise<Cita> {
    const response = await api.put<Cita>(`/citas/${citaId}`, { estado: 'cancelada' });
    return response.data;
  },

  // Actualizar una cita
  async updateCita(citaId: number, data: Partial<Cita>): Promise<Cita> {
    const response = await api.put<Cita>(`/citas/${citaId}`, data);
    return response.data;
  },

  // Obtener citas próximas de un cliente
  async getCitasProximas(clienteId: number): Promise<Cita[]> {
    const response = await api.get<Cita[]>('/citas', {
      params: { clienteId, estado: 'confirmada' }
    });
    // Filtrar solo citas futuras en el frontend
    const ahora = new Date();
    return response.data.filter(cita => {
      const citaDate = new Date(`${cita.fecha} ${cita.hora}`);
      return citaDate > ahora;
    });
  }
};
