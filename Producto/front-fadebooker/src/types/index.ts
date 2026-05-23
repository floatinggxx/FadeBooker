// Usuarios
export interface Usuario {
  id?: string | number;
  id_usuario?: string | number; // Alineado con BD
  nombre: string;
  apellido?: string; // Agregado
  email: string;
  telefono?: string; // Agregado
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
  precio_base: number;
  activo: boolean;
}

export interface ServicioBarbero {
  id_servicio_barbero: number;
  id_barbero: number;
  id_servicio: number;
  precio_barbero?: number;
  tiempo_servicio_minutos?: number;
  disponible: boolean;
  servicio?: Servicio;
}

// Citas
export interface Cita {
  id?: string | number;
  id_cita?: string | number; // Alineado con BD
  clienteId: string | number;
  barberoId: string | number;
  servicioBarberoId: string | number;
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
  clienteId: number;
  barberoId: number;
  servicioBarberoId: number;
  fecha: string;
  hora: string;
  notas?: string;
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
