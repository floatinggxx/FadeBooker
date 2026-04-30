import api from '../api';
import { Cliente } from '@/types';

export const clientService = {
  // Obtener perfil del cliente
  async getClientePerfil(clienteId: number): Promise<Cliente> {
    const response = await api.get<Cliente>(`/clientes/${clienteId}`);
    return response.data;
  },

  // Crear un cliente
  async createCliente(data: Omit<Cliente, 'id'>): Promise<Cliente> {
    const response = await api.post<Cliente>('/clientes', data);
    return response.data;
  },

  // Actualizar perfil del cliente
  async updateCliente(clienteId: number, data: Partial<Cliente>): Promise<Cliente> {
    const response = await api.put<Cliente>(`/clientes/${clienteId}`, data);
    return response.data;
  },

  // Obtener puntos de lealtad
  async getPuntosLealtad(clienteId: number): Promise<{ puntosLealtad: number }> {
    const response = await api.get<Cliente>(`/clientes/${clienteId}`);
    return { puntosLealtad: response.data.puntosLealtad || 0 };
  },

  // Listar todos los clientes (admin)
  async listClientes(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>('/clientes');
    return response.data;
  },

  // Buscar cliente por teléfono
  async buscarPorTelefono(telefono: string): Promise<Cliente | null> {
    const response = await api.get<Cliente[]>('/clientes', {
      params: { telefonoContacto: telefono }
    });
    return response.data?.[0] || null;
  },

  // Eliminar un cliente
  async deleteCliente(clienteId: number): Promise<void> {
    await api.delete(`/clientes/${clienteId}`);
  }
};
