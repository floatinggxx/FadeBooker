import api from './axios';

export interface Barber {
  id: string;
  nombre: string;
  descripcion?: string;
  especialidad?: string;
  fotoUrl?: string;
}

export const listBarbers = async (): Promise<Barber[]> => {
  const resp = await api.get('/barberos');
  return resp.data;
};

export const getBarberById = async (id: string): Promise<Barber> => {
  const resp = await api.get(`/barberos/${id}`);
  return resp.data;
};

export const getBarberServices = async (id: string): Promise<any[]> => {
  const resp = await api.get(`/barberos/${id}/servicios`);
  return resp.data;
};

export default { listBarbers, getBarberById, getBarberServices };
import api from '../api';
import { Barbero, BarberoWithServices, Disponibilidad, ServicioBarbero, Horario } from '@/types';

export const barberService = {
  // Listar todos los barberos
  async listBarberos(): Promise<Barbero[]> {
    const response = await api.get<Barbero[]>('/barberos');
    return response.data;
  },

  // Obtener un barbero por ID con sus servicios
  async getBarberoById(barberoId: number): Promise<BarberoWithServices> {
    const response = await api.get<BarberoWithServices>(`/barberos/${barberoId}`);
    return response.data;
  },

  // Crear un barbero
  async createBarbero(data: Barbero): Promise<Barbero> {
    const response = await api.post<Barbero>('/barberos', data);
    return response.data;
  },

  // Actualizar un barbero
  async updateBarbero(barberoId: number, data: Partial<Barbero>): Promise<Barbero> {
    const response = await api.put<Barbero>(`/barberos/${barberoId}`, data);
    return response.data;
  },

  // Eliminar un barbero
  async deleteBarbero(barberoId: number): Promise<void> {
    await api.delete(`/barberos/${barberoId}`);
  },

  // Buscar barberos por especialidad
  async buscarPorEspecialidad(especialidad: string): Promise<Barbero[]> {
    const response = await api.get<Barbero[]>('/barberos', {
      params: { especialidad }
    });
    return response.data;
  },

  // Buscar barberos por email
  async buscarPorEmail(email: string): Promise<Barbero | null> {
    const response = await api.get<Barbero>('/barberos', {
      params: { email }
    });
    return response.data || null;
  },

  // Obtener horarios de un barbero
  async getHorarios(barberoId: number): Promise<Horario[]> {
    const response = await api.get<Horario[]>(`/barberos/${barberoId}/horarios`);
    return response.data;
  },

  // Crear horario para un barbero
  async createHorario(barberoId: number, horario: Omit<Horario, 'id'>): Promise<Horario> {
    const response = await api.post<Horario>(`/barberos/${barberoId}/horarios`, horario);
    return response.data;
  },

  // Actualizar horario
  async updateHorario(barberoId: number, horarioId: number, data: Partial<Horario>): Promise<Horario> {
    const response = await api.put<Horario>(`/barberos/${barberoId}/horarios/${horarioId}`, data);
    return response.data;
  },

  // Obtener disponibilidad (por fecha)
  async getDisponibilidad(barberoId: number, fecha: string): Promise<Disponibilidad[]> {
    const response = await api.get<Disponibilidad[]>(`/barberos/${barberoId}/disponibilidad`, {
      params: { fecha }
    });
    return response.data;
  },

  // Obtener servicios de un barbero
  async getServicios(barberoId: number): Promise<ServicioBarbero[]> {
    const response = await api.get<ServicioBarbero[]>(`/barberos/${barberoId}/servicios`);
    return response.data;
  },

  // Agregar un servicio a un barbero
  async agregarServicio(barberoId: number, servicioId: number, precio?: number, duracion?: number): Promise<ServicioBarbero> {
    const response = await api.post<ServicioBarbero>(`/barberos/${barberoId}/servicios`, {
      servicioId,
      precio,
      duracion
    });
    return response.data;
  },

  // Remover un servicio de un barbero
  async removerServicio(barberoId: number, servicioId: number): Promise<void> {
    await api.delete(`/barberos/${barberoId}/servicios/${servicioId}`);
  }
};
