export interface BarberoStats {
  ingresos: number;
  totalServicios: number;
  totalDuracionMinutos?: number;
  period: 'day' | 'week' | 'month';
}

export interface BarberoBooking {
  id_cita: number;
  id_cliente: number;
  id_servicio: number;
  fecha_hora_inicio: string;
  duracion_minutos: number;
  estado: string;
  cliente?: {
    nombre: string;
  };
  servicio?: {
    nombre: string;
    precio: number;
  };
}
