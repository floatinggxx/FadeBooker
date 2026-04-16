/**
 * Utilities para crear mocks de servicios en tests
 */

const jest = require('jest')

/**
 * Mock de UsuarioService para tests
 */
function createUsuarioServiceMock() {
  return {
    registrar: jest.fn().mockResolvedValue({
      id_usuario: 1,
      email: 'test@example.com',
      nombre: 'Test',
      apellido: 'Usuario',
      rol: 'Cliente',
      estado: true
    }),
    login: jest.fn().mockResolvedValue({
      id_usuario: 1,
      email: 'test@example.com',
      token: 'test-token'
    })
  }
}

/**
 * Mock de BarberoService para tests
 */
function createBarberoServiceMock() {
  return {
    crearBarbero: jest.fn().mockResolvedValue({
      id_barbero: 1,
      id_usuario: 1,
      especialidad: 'Cortes modernos',
      tarifa_base: 25000,
      calificacion_promedio: 4.5,
      activo: true
    }),
    obtenerBarberoPorId: jest.fn().mockResolvedValue({
      id_barbero: 1,
      nombre: 'Juan',
      especialidad: 'Cortes modernos',
      tarifa_base: 25000
    }),
    obtenerTodosLosBarberos: jest.fn().mockResolvedValue([
      {
        id_barbero: 1,
        nombre: 'Juan',
        especialidad: 'Cortes modernos'
      }
    ])
  }
}

/**
 * Mock de CitaService para tests
 */
function createCitaServiceMock() {
  return {
    crearCita: jest.fn().mockResolvedValue({
      id_cita: 1,
      id_cliente: 1,
      id_barbero: 1,
      id_servicio: 1,
      fecha_hora_inicio: '2026-04-25T10:00:00',
      estado: 'confirmada'
    }),
    actualizarEstado: jest.fn().mockResolvedValue({
      id_cita: 1,
      estado: 'cancelada'
    })
  }
}

/**
 * Mock de ClienteService para tests
 */
function createClienteServiceMock() {
  return {
    obtenerTodos: jest.fn().mockResolvedValue([
      {
        id_cliente: 1,
        nombre: 'Cliente Test',
        email: 'cliente@test.com'
      }
    ]),
    crearCliente: jest.fn().mockResolvedValue({
      id_cliente: 1,
      nombre: 'Nuevo Cliente',
      email: 'nuevo@test.com'
    }),
    obtenerPorId: jest.fn().mockResolvedValue({
      id_cliente: 1,
      nombre: 'Cliente Test'
    })
  }
}

/**
 * Mock de ServicioService para tests
 */
function createServicioServiceMock() {
  return {
    crearServicio: jest.fn().mockResolvedValue({
      id_servicio: 1,
      nombre_servicio: 'Corte Clásico',
      duracion_minutos: 30,
      precio_base: 25000
    }),
    obtenerTodosLosServicios: jest.fn().mockResolvedValue([
      {
        id_servicio: 1,
        nombre_servicio: 'Corte Clásico',
        precio_base: 25000
      }
    ]),
    obtenerServicioPorId: jest.fn().mockResolvedValue({
      id_servicio: 1,
      nombre_servicio: 'Corte Clásico'
    })
  }
}

module.exports = {
  createUsuarioServiceMock,
  createBarberoServiceMock,
  createCitaServiceMock,
  createClienteServiceMock,
  createServicioServiceMock
}
