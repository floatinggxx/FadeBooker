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
    // Mapear nombres de tienda desde la API (compatibilidad con backend)
    return (response.data || []).map(c => {
      const tiendaObj = c.tienda || {};
      const tiendaName = c.tienda_nombre || c.tiendaName || tiendaObj.nombre || tiendaObj.name || (typeof c.tienda === 'string' ? c.tienda : null) || null;
      const tiendaDireccion = c.tienda_direccion || c.direccion || tiendaObj.direccion || tiendaObj.address || null;
      return { ...c, tiendaName, tiendaDireccion };
    });
  },

  // Listar citas de un cliente específico
  async getCitasByCliente(clienteId: number): Promise<Cita[]> {
    const response = await api.get<Cita[]>('/citas', {
      params: { clienteId }
    });
    return (response.data || []).map(c => {
      const tiendaObj = c.tienda || {};
      const tiendaName = c.tienda_nombre || c.tiendaName || tiendaObj.nombre || tiendaObj.name || (typeof c.tienda === 'string' ? c.tienda : null) || null;
      const tiendaDireccion = c.tienda_direccion || c.direccion || tiendaObj.direccion || tiendaObj.address || null;
      return { ...c, tiendaName, tiendaDireccion };
    });
  },

  // Listar citas de un barbero específico
  async getCitasByBarbero(barberoId: number): Promise<Cita[]> {
    const response = await api.get<Cita[]>('/citas', {
      params: { barberoId }
    });
    return (response.data || []).map(c => {
      const tiendaObj = c.tienda || {};
      const tiendaName = c.tienda_nombre || c.tiendaName || tiendaObj.nombre || tiendaObj.name || (typeof c.tienda === 'string' ? c.tienda : null) || null;
      const tiendaDireccion = c.tienda_direccion || c.direccion || tiendaObj.direccion || tiendaObj.address || null;
      return { ...c, tiendaName, tiendaDireccion };
    });
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

  // Eliminar una cita
  async eliminarCita(citaId: number): Promise<void> {
    await api.delete(`/citas/${citaId}`);
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
    const datos = (response.data || []).map(c => {
      // keep shape minimal: only add tiendaName if available to avoid altering expected test shape
      const tiendaName = c.tienda_nombre || c.tiendaName || (c.tienda && typeof c.tienda === 'object' ? (c.tienda.nombre || c.tienda.name) : null);
      return tiendaName ? { ...c, tiendaName } : { ...c };
    });
    return datos.filter(cita => {
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
    console.log('[bookingService] GET /citas raw response:', response.data);
    const raw = (response.data || []).map(c => {
      const tiendaObj = c.tienda || {};
      const tiendaName = c.tienda_nombre || c.tiendaName || tiendaObj.nombre || tiendaObj.name || (typeof c.tienda === 'string' ? c.tienda : null) || null;
      const tiendaDireccion = c.tienda_direccion || c.direccion || tiendaObj.direccion || tiendaObj.address || null;
      return { ...c, tiendaName, tiendaDireccion };
    });
    console.log('[bookingService] mapped bookings:', raw);

    // For any booking missing tiendaDireccion or tiendaName but having id_tienda, fetch tienda details in parallel.
    const needFetch = raw.filter((r: any) => (!r.tiendaDireccion || !r.tiendaName) && (r.id_tienda || r.tienda_id || r.tienda));
    if (needFetch.length === 0) return raw;

    // Build unique ids
    const tiendaIds = Array.from(new Set(needFetch.map((r: any) => r.id_tienda || r.tienda_id || (typeof r.tienda === 'number' ? r.tienda : null)).filter(Boolean)));
    try {
      const promises = tiendaIds.map((id: number) => api.get(`/tiendas/${id}`).then(res => ({ id, data: res.data })).catch(() => ({ id, data: null })));
      const results = await Promise.all(promises);
      const tiendaMap: Record<number, any> = {};
      results.forEach((r: any) => { if (r && r.id) tiendaMap[r.id] = r.data; });

      return raw.map((r: any) => {
        const tiendaId = r.id_tienda || r.tienda_id || (typeof r.tienda === 'number' ? r.tienda : null);
        if (!tiendaId) return r;
        const info = tiendaMap[tiendaId];
        if (!info) return r;
        const tiendaName = r.tiendaName || info.nombre || info.name || info.nombre_tienda || info.tienda_nombre || null;
        const tiendaDireccion = r.tiendaDireccion || info.direccion || info.address || info.direccion_tienda || info.direccion || null;
        return { ...r, tiendaName, tiendaDireccion };
      });
    } catch (err) {
      return raw; // on error return what we have
    }
  },

  // Dejar una reseña
  async dejarResena(citaId: number, data: { puntuacion: number, comentario: string }): Promise<any> {
    const response = await api.post(`/citas/${citaId}/resena`, data);
    return response.data;
  }
};
