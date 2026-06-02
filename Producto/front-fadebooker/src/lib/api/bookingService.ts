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
  async cambiarEstadoCita(citaId: number, estado: string): Promise<any> {
    const response = await api.put(`/citas/${citaId}/estado`, { estado });
    return response.data;
  },

  // Cancelar una cita con política de reembolso
  async cancelarCita(id: number, motivo?: string, cancelado_por?: number): Promise<any> {
    const response = await api.post(`/citas/${id}/cancelar`, { motivo, cancelado_por });
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
  },

  // Registrar pago en efectivo (pago completo)
  async registrarPagoEfectivo(citaId: number): Promise<any> {
    const response = await api.post(`/citas/${citaId}/pago-efectivo`);
    return response.data;
  },

  // Obtener mis citas (alias para listCitas sin parámetros, el backend filtra por JWT)
  async getMyBookings(): Promise<Cita[]> {
    const response = await api.get<Cita[]>('/citas');
    return response.data;
  },

  // Dejar una reseña
  async dejarResena(citaId: number, data: { puntuacion: number, comentario: string }): Promise<any> {
    const response = await api.post(`/citas/${citaId}/resena`, data);
    return response.data;
  }
};
