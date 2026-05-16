import api from '../api';

export interface CrearPagoRequest {
  id_cita: number;
}

export interface PagoResponse {
  url: string;
  preference_id: string;
}

export const pagoService = {
  // Crear preferencia de pago para una cita
  async crearPago(data: CrearPagoRequest): Promise<PagoResponse> {
    const response = await api.post<PagoResponse>('/pagos/crear', data);
    return response.data;
  },

  // Redirigir a Mercado Pago
  async procesarPago(id_cita: number): Promise<void> {
    const resultado = await this.crearPago({ id_cita });
    window.location.href = resultado.url;
  }
};