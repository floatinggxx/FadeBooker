// Usuarios
export interface Usuario {
  id?: string | number;
  id_usuario?: string | number; // Alineado con BD
  nombre: string;
  apellido?: string; // Agregado
  email: string;
  telefono?: string; // Agregado
  contrasena?: string;
  rol: 'Cliente' | 'Barbero' | 'Admin';
  id_tienda?: number; // Agregado para barberos
  id_barbero?: number; // Agregado para barberos
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
  rol: 'Cliente' | 'Barbero' | 'Admin';
  token?: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido?: string; // Agregado
  email: string;
  telefono?: string; // Agregado
  contrasena: string;
  rol: 'Cliente' | 'Barbero';
}

// Barberos
export interface Barbero {
  id?: string | number;
  id_barbero?: string | number; // Alineado con BD
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  calificacion?: number;
  foto?: string;
  bio?: string;
  usuarioId?: string | number;
  id_tienda?: number; // Agregado para vinculación
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
  id_servicio?: string | number; // Alineado con BD
  nombre: string;
  descripcion?: string;
  duracion: number; // minutos
  precioBase: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicioBarbero {
  id?: string | number;
  id_servicio_barbero?: string | number; // Alineado con BD
  servicioId?: string | number;
  barberoId?: string | number;
  precio?: number;
  duracion?: number;
  servicio?: Servicio;
  barbero?: Barbero;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tienda {
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
  createdAt?: string;
  updatedAt?: string;
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
