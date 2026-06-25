// Usuarios
export interface Usuario {
  id?: string | number;
  id_usuario?: string | number; // Alineado con BD
  nombre: string;
  apellido?: string; // Agregado
  email: string;
  telefono?: string; // Agregado
  fotoUrl?: string;
  contrasena?: string;
  rol: 'Cliente' | 'Barbero' | 'Dueño' | 'Admin';
  id_tienda?: number; // Agregado para barberos
  id_barbero?: number; // Agregado para barberos
  createdAt?: string;
  updatedAt?: string;
}

export interface Promocion {
  id: string;
  empresa: string;
  tipoProducto: string;
  url: string;
  descripcion?: string;
  creadoEn: string;
}

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface LoginResponse {
  id: string;
  nombre: string;
  email: string;
  rol: 'Cliente' | 'Barbero' | 'Dueño' | 'Admin';
  id_tienda?: number;
  id_barbero?: number;
  token?: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido?: string;
  email: string;
  telefono?: string;
  contrasena: string;
  rol: 'Cliente' | 'Barbero' | 'Dueño';
  especialidad?: string;
  anos_experiencia?: number;
  id_tienda?: number;
  servicios?: number[];
  tienda_nueva?: {
    nombre_tienda: string;
    direccion: string;
    ciudad: string;
    comuna?: string;
  };
}

export interface Tienda {
  id?: string | number;
  id_tienda?: string | number;
  id_dueño?: string | number;
  nombre_tienda: string;
  direccion: string;
  ciudad: string;
  codigo_postal?: string;
  telefono_tienda?: string;
  email_tienda?: string;
  horario_apertura?: string;
  horario_cierre?: string;
  dias_laborales?: string;
  comision_porcentaje?: number;
  foto_portada_url?: string;
  calificacion_promedio?: number;
  este_activa?: boolean | number;
  galeria?: string;
  horarios_json?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Servicios
export interface Servicio {
  id_servicio: number;
  nombre: string;
  nombre_servicio?: string; // Alineado con BD
  descripcion?: string;
  duracion_minutos: number;
  duracion?: number;
  precio_base: number;
  precioBase?: number; // alias
  precio?: number; // alias used in some components
  activo: boolean;
}

export interface ServicioBarbero {
  id_servicio_barbero: number;
  id_barbero: number;
  id_servicio: number;
  servicioBarberoId?: number;
  // compatibility aliases used across the codebase
  id?: number;
  precio_barbero?: number;
  precio?: number;
  tiempo_servicio_minutos?: number;
  duracion?: number;
  disponible: boolean;
  servicio?: Servicio;
  nombre_servicio?: string;
  descripcion?: string;
}

// Citas
export interface Cita {
  id?: string | number;
  id_cita?: string | number; // Alineado con BD
  clienteId?: string | number;
  id_cliente?: string | number;
  barberoId?: string | number;
  id_barbero?: string | number;
  servicioBarberoId?: string | number;
  id_servicio?: string | number;
  fecha: string; // formato: YYYY-MM-DD
  hora: string; // formato: HH:mm
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
  barbero?: Barbero;
  cliente?: Cliente;
  servicio?: ServicioBarbero;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCitaRequest {
  // Support both backend (snake_case) and frontend (camelCase) keys
  id_cliente?: number;
  clienteId?: number;
  id_barbero?: number;
  barberoId?: number;
  id_servicio?: number;
  servicioId?: number;
  id_tienda?: number;
  tiendaId?: number;
  fecha_hora_inicio: string;
  duracion_minutos: number;
  duracionMinutos?: number;
  duracion?: number;
  servicioBarberoId?: number;
  fecha?: string;
  hora?: string;
  monto_total: number;
  montoBase?: number;
  comision?: number;
  comision_porcentaje?: number;
  metodo_pago?: string;
  pago_abono?: number;
  notas?: string;
  origen?: string;
}

// Barbero type (compatibility) — many components expect this named export
export interface Barbero {
  id?: number;
  id_barbero?: number;
  nombre: string;
  apellido?: string;
  descripcion?: string;
  especialidad?: string;
  foto_perfil_url?: string;
  fotoUrl?: string;
  activo?: boolean | number;
  anos_experiencia?: number;
  calificacion_promedio?: number;
  id_tienda?: number;
  comision_porcentaje?: number;
}

export interface BarberoWithServices extends Barbero {
  servicios?: ServicioBarbero[];
}

// Clientes
export interface Cliente {
  id?: string | number;
  usuarioId: string | number;
  telefonoContacto?: string;
  puntosLealtad?: number;
  usuario?: Usuario;
  createdAt?: string;
  updatedAt?: string;
}

// Horarios
export interface Horario {
  id?: string | number;
  id_horario?: string | number; // Alineado con BD
  barberoId: string | number;
  diaSemana: number; // 0-6 (lunes-domingo)
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  fotoUrl?: string;
  disponible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Disponibilidad
export interface Disponibilidad {
  fecha: string;
  hora: string;
  disponible: boolean;
}

// Respuestas API
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Búsqueda
export interface SearchFilters {
  especialidad?: string;
  calificacionMinima?: number;
  zona?: string;
  nombre?: string;
  [key: string]: any;
}
