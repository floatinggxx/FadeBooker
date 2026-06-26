import api from '../api';
import { Barbero, BarberoWithServices, Disponibilidad, ServicioBarbero, Horario } from '@/types';

export const barberService = {
  // Listar todos los barberos
  async listBarberos(): Promise<Barbero[]> {
    const response = await api.get<Barbero[]>('/barberos');
    return response.data.map(b => ({
      ...b,
      id: b.id_barbero || b.id
    }));
  },

  // Listar barberos por tienda
  async listBarberosByTienda(tiendaId: number): Promise<Barbero[]> {
    const response = await api.get<Barbero[]>('/barberos', {
      params: { id_tienda: tiendaId }
    });
    return response.data.map(b => ({
      ...b,
      id: b.id_barbero || b.id
    }));
  },

  // Obtener un barbero por ID con sus servicios
  async getBarberoById(barberoId: number): Promise<BarberoWithServices> {
    const response = await api.get<BarberoWithServices>(`/barberos/${barberoId}`);
    const b = response.data;
    return {
      ...b,
      id: b.id_barbero || b.id
    };
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
    const response = await api.get<Disponibilidad[]>(`/barberos/${barberoId}/disponibilidad/${fecha}`);
    return response.data;
  },

  // Obtener estadísticas del barbero (mes, semana, día)
  async getBarberoStats(barberoId: number, period: 'day' | 'week' | 'month' = 'month'): Promise<{ ingresos: number; totalServicios: number; totalDuracionMinutos?: number; period: string; }> {
    const response = await api.get(`/barberos/${barberoId}/stats`, { params: { period } });
    return response.data;
  },

  // Obtener servicios de un barbero
  async getServicios(barberoId: number): Promise<ServicioBarbero[]> {
    const response = await api.get<any[]>(`/barberos/${barberoId}/servicios`);
    return response.data.map(sb => ({
        id: sb.id_servicio_barbero,
        id_barbero: sb.id_barbero || null,
        id_servicio_barbero: sb.id_servicio_barbero || sb.id,
        id_servicio: sb.id_servicio,
        precio: sb.precio || sb.precio_barbero || sb.precio_base,
        duracion: sb.duracion || sb.tiempo_servicio_minutos || sb.duracion_minutos,
        disponible: typeof sb.disponible === 'undefined' ? true : sb.disponible,
        servicio: sb.servicio ? {
          id: sb.servicio.id || sb.servicio.id_servicio,
          id_servicio: sb.servicio.id_servicio,
          nombre: sb.servicio.nombre || sb.servicio.nombre_servicio || 'Servicio',
          descripcion: sb.servicio.descripcion,
          duracion: sb.servicio.duracion || sb.servicio.duracion_minutos,
          duracion_minutos: sb.servicio.duracion_minutos || sb.servicio.duracion || null,
          precioBase: sb.servicio.precioBase || sb.servicio.precio_base || null,
          precio_base: sb.servicio.precio_base || sb.servicio.precioBase || null,
          activo: typeof sb.servicio.activo === 'undefined' ? true : sb.servicio.activo
        } : undefined
    }));
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
  },

  // Actualizar foto del barbero
  async actualizarFoto(barberoId: number, image: string): Promise<{ fotoUrl: string }> {
    const response = await api.post<{ fotoUrl: string }>(`/barberos/${barberoId}/foto`, { image });
    return response.data;
  }
};
