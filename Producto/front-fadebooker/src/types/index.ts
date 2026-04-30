// Usuarios
export interface Usuario {
  id?: string | number;
  nombre: string;
  email: string;
  contrasena?: string;
  rol: 'cliente' | 'barbero' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface LoginResponse {
  id: string;
  nombre: string;
  email: string;
  rol: 'cliente' | 'barbero' | 'admin';
  token?: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  contrasena: string;
  rol: 'cliente' | 'barbero';
}

// Barberos
export interface Barbero {
  id?: string | number;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  calificacion?: number;
  foto?: string;
  bio?: string;
  usuarioId?: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BarberoWithServices extends Barbero {
  servicios?: ServicioBarbero[];
  horarios?: Horario[];
}

// Servicios
export interface Servicio {
  id?: string | number;
  nombre: string;
  descripcion?: string;
  duracion: number; // minutos
  precioBase: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicioBarbero {
  id?: string | number;
  servicioId?: string | number;
  barberoId?: string | number;
  precio?: number;
  duracion?: number;
  servicio?: Servicio;
  barbero?: Barbero;
  createdAt?: string;
  updatedAt?: string;
}

// Citas
export interface Cita {
  id?: string | number;
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
