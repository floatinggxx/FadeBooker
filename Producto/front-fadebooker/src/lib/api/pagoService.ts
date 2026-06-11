import api from '../api';

export interface CrearPagoRequest {
  id_cita: number;
  tipo_pago?: 'total' | 'abono';
}

export interface PagoResponse {
  url: string;
  preference_id: string;
}

export interface PagoResponseWithCommission extends PagoResponse {
  montoAPagar: number;
  comision?: number;
}

export const pagoService = {
  // Crear preferencia de pago para una cita
  async crearPago(data: CrearPagoRequest): Promise<PagoResponseWithCommission> {
    const response = await api.post<PagoResponseWithCommission>('/pagos/crear', data);
    return response.data;
  },

  // Obtener estado de pagos de una cita
  async obtenerPagosCita(id_cita: number): Promise<any[]> {
    const response = await api.get<any[]>(`/pagos/cita/${id_cita}`);
    return response.data;
  },

  // Redirigir a Mercado Pago
  async procesarPago(id_cita: number): Promise<void> {
    const resultado = await this.crearPago({ id_cita });
    window.location.href = resultado.url;
  }
};