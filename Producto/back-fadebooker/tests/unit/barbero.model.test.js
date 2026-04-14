/**
 * Tests Unitarios - Barbero Model
 * Valida que el modelo Barbero sincroniza correctamente con la BD
 */

const Barbero = require('../../src/domain/entities/barbero.model')

describe('Barbero Model', () => {
  describe('Constructor', () => {
    test('debe crear barbero con todos los campos', () => {
      const barberoData = {
        id_usuario: 1,
        email: 'barbero@example.com',
        nombre: 'Carlos',
        apellido: 'López',
        telefono: '3009876543',
        rol: 'Barbero',
        estado: true,
        foto_perfil_url: 'https://example.com/barbero.jpg',
        fecha_registro: '2026-04-14',
        ultimo_login: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z',
        id_barbero: 1,
        id_tienda: 1,
        especialidad: 'Cortes de cabello',
        anos_experiencia: 5,
        tarifa_base: 25000,
        calificacion_promedio: 4.8,
        total_resenas: 120,
        activo: true
      }

      const barbero = new Barbero(barberoData)

      expect(barbero.id_barbero).toBe(1)
      expect(barbero.id_tienda).toBe(1)
      expect(barbero.especialidad).toBe('Cortes de cabello')
      expect(barbero.anos_experiencia).toBe(5)
      expect(barbero.tarifa_base).toBe(25000)
    })

    test('debe incluir especialidad en el constructor', () => {
      const barberoData = {
        id_usuario: 1,
        email: 'barbero@example.com',
        nombre: 'Carlos',
        apellido: 'López',
        telefono: '3009876543',
        rol: 'Barbero',
        estado: true,
        foto_perfil_url: 'https://example.com/barbero.jpg',
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z',
        id_barbero: 1,
        id_tienda: 1,
        especialidad: 'Afeitada',
        anos_experiencia: 3,
        tarifa_base: 20000,
        calificacion_promedio: 4.5,
        total_resenas: 80,
        activo: true
      }

      const barbero = new Barbero(barberoData)

      // ✅ Validar que especialidad está definida
      expect(barbero.especialidad).toBe('Afeitada')
      expect(barbero.especialidad).toBeDefined()
      expect(typeof barbero.especialidad).toBe('string')
    })

    test('debe extender Usuario e incluir todo sus campos', () => {
      const barberoData = {
        id_usuario: 1,
        email: 'barbero@example.com',
        nombre: 'Carlos',
        apellido: 'López',
        telefono: '3009876543',
        rol: 'Barbero',
        estado: true,
        foto_perfil_url: 'https://example.com/barbero.jpg',
        fecha_registro: '2026-04-14',
        ultimo_login: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z',
        id_barbero: 1,
        id_tienda: 1,
        especialidad: 'Cortes de cabello',
        anos_experiencia: 5,
        tarifa_base: 25000,
        calificacion_promedio: 4.8,
        total_resenas: 120,
        activo: true
      }

      const barbero = new Barbero(barberoData)

      // Campos heredados de Usuario
      expect(barbero.id_usuario).toBe(1)
      expect(barbero.email).toBe('barbero@example.com')
      expect(barbero.nombre).toBe('Carlos')
      expect(barbero.apellido).toBe('López')
      expect(barbero.telefono).toBe('3009876543')
      expect(barbero.rol).toBe('Barbero')
      expect(barbero.estado).toBe(true)
      expect(barbero.foto_perfil_url).toBe('https://example.com/barbero.jpg')
    })
  })

  describe('Campos Específicos de Barbero', () => {
    test('debe tener todos los campos de tabla Barbero en BD', () => {
      // Campos esperados según BD: 
      // id_barbero, id_usuario, id_tienda, especialidad, anos_experiencia,
      // tarifa_base, foto_perfil_url, calificacion_promedio, total_resenas,
      // activo, createdAt, updatedAt
      const camposBarbero = [
        'id_barbero', 'id_tienda', 'especialidad', 'anos_experiencia',
        'tarifa_base', 'calificacion_promedio', 'total_resenas', 'activo'
      ]

      const barberoData = {
        id_usuario: 1,
        email: 'barbero@example.com',
        nombre: 'Carlos',
        apellido: 'López',
        telefono: '3009876543',
        rol: 'Barbero',
        estado: true,
        foto_perfil_url: 'https://example.com/barbero.jpg',
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z',
        id_barbero: 1,
        id_tienda: 1,
        especialidad: 'Cortes de cabello',
        anos_experiencia: 5,
        tarifa_base: 25000,
        calificacion_promedio: 4.8,
        total_resenas: 120,
        activo: true
      }

      const barbero = new Barbero(barberoData)

      // Verificar que todos los campos de Barbero están presentes
      camposBarbero.forEach(campo => {
        expect(barbero).toHaveProperty(campo)
      })
    })

    test('debe validar que no tiene campos que no existen en BD', () => {
      const barberoData = {
        id_usuario: 1,
        email: 'barbero@example.com',
        nombre: 'Carlos',
        apellido: 'López',
        telefono: '3009876543',
        rol: 'Barbero',
        estado: true,
        foto_perfil_url: 'https://example.com/barbero.jpg',
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z',
        id_barbero: 1,
        id_tienda: 1,
        especialidad: 'Cortes de cabello',
        anos_experiencia: 5,
        tarifa_base: 25000,
        calificacion_promedio: 4.8,
        total_resenas: 120,
        activo: true
      }

      const barbero = new Barbero(barberoData)

      // Propiedades que NO deben existir
      expect(barbero).not.toHaveProperty('puntos_acumulados') // ← SOLO en Cliente
      expect(barbero).not.toHaveProperty('horario_apertura') // ← SOLO en Tienda
    })
  })

  describe('Validaciones de Especialidad', () => {
    test('debe aceptar especialidades válidas', () => {
      const especialidades = [
        'Cortes de cabello',
        'Afeitada',
        'Corte y barba',
        'Diseño de cejas',
        'Colorimetrista'
      ]

      especialidades.forEach(especialidad => {
        const barbero = new Barbero({
          id_usuario: 1,
          email: 'barbero@example.com',
          nombre: 'Carlos',
          apellido: 'López',
          telefono: '3009876543',
          rol: 'Barbero',
          estado: true,
          foto_perfil_url: 'https://example.com/barbero.jpg',
          createdAt: '2026-04-14T00:00:00Z',
          updatedAt: '2026-04-14T00:00:00Z',
          id_barbero: 1,
          id_tienda: 1,
          especialidad: especialidad,
          anos_experiencia: 5,
          tarifa_base: 25000,
          calificacion_promedio: 4.5,
          total_resenas: 100,
          activo: true
        })

        expect(barbero.especialidad).toBe(especialidad)
      })
    })
  })

  describe('Tipos de Datos', () => {
    test('tarifa_base debe ser número', () => {
      const barbero = new Barbero({
        id_usuario: 1,
        email: 'barbero@example.com',
        nombre: 'Carlos',
        apellido: 'López',
        telefono: '3009876543',
        rol: 'Barbero',
        estado: true,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z',
        id_barbero: 1,
        id_tienda: 1,
        especialidad: 'Cortes de cabello',
        anos_experiencia: 5,
        tarifa_base: 25000,
        calificacion_promedio: 4.8,
        total_resenas: 120,
        activo: true
      })

      expect(typeof barbero.tarifa_base).toBe('number')
      expect(barbero.tarifa_base).toBe(25000)
    })

    test('calificacion_promedio debe ser número', () => {
      const barbero = new Barbero({
        id_usuario: 1,
        email: 'barbero@example.com',
        nombre: 'Carlos',
        apellido: 'López',
        telefono: '3009876543',
        rol: 'Barbero',
        estado: true,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z',
        id_barbero: 1,
        id_tienda: 1,
        especialidad: 'Cortes de cabello',
        anos_experiencia: 5,
        tarifa_base: 25000,
        calificacion_promedio: 4.8,
        total_resenas: 120,
        activo: true
      })

      expect(typeof barbero.calificacion_promedio).toBe('number')
      expect(barbero.calificacion_promedio).toBeGreaterThanOrEqual(0)
      expect(barbero.calificacion_promedio).toBeLessThanOrEqual(5)
    })

    test('activo debe ser booleano', () => {
      const barbero = new Barbero({
        id_usuario: 1,
        email: 'barbero@example.com',
        nombre: 'Carlos',
        apellido: 'López',
        telefono: '3009876543',
        rol: 'Barbero',
        estado: true,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z',
        id_barbero: 1,
        id_tienda: 1,
        especialidad: 'Cortes de cabello',
        anos_experiencia: 5,
        tarifa_base: 25000,
        calificacion_promedio: 4.8,
        total_resenas: 120,
        activo: true
      })

      expect(typeof barbero.activo).toBe('boolean')
    })
  })

  describe('Sincronización con BD', () => {
    test('debe heredar todos los 12 campos de Usuario plus 8 de Barbero', () => {
      const barberoData = {
        id_usuario: 1,
        email: 'barbero@example.com',
        nombre: 'Carlos',
        apellido: 'López',
        telefono: '3009876543',
        rol: 'Barbero',
        estado: true,
        foto_perfil_url: 'https://example.com/barbero.jpg',
        fecha_registro: '2026-04-14',
        ultimo_login: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z',
        id_barbero: 1,
        id_tienda: 1,
        especialidad: 'Cortes de cabello',
        anos_experiencia: 5,
        tarifa_base: 25000,
        calificacion_promedio: 4.8,
        total_resenas: 120,
        activo: true
      }

      const barbero = new Barbero(barberoData)

      // 12 de Usuario + 8 específicos de Barbero = 20 total
      expect(Object.keys(barbero).length).toBeGreaterThanOrEqual(20)
    })
  })
})
