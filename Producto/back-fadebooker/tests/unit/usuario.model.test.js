/**
 * Tests Unitarios - Usuario Model
 * Valida que el modelo Usuario sincroniza correctamente con la BD
 */

const Usuario = require('../../src/domain/entities/usuario.model')

describe('Usuario Model', () => {
  describe('Constructor', () => {
    test('debe crear usuario con todos los campos', () => {
      const usuarioData = {
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        foto_perfil_url: 'https://example.com/photo.jpg',
        fecha_registro: '2026-04-14',
        ultimo_login: '2026-04-14',
        puntos_acumulados: 0,  // Agregado en migración 20260526
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      }

      const usuario = new Usuario(usuarioData)

      expect(usuario.id_usuario).toBe(1)
      expect(usuario.email).toBe('test@example.com')
      expect(usuario.nombre).toBe('Juan')
      expect(usuario.apellido).toBe('Pérez')
      expect(usuario.telefono).toBe('3001234567')
      expect(usuario.rol).toBe('Cliente')
      expect(usuario.estado).toBe(true)
      expect(usuario.puntos_acumulados).toBe(0)
    })

    test('debe asignar foto_perfil_url correctamente (sin typo)', () => {
      const usuarioData = {
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        foto_perfil_url: 'https://example.com/photo.jpg',
        fecha_registro: '2026-04-14',
        ultimo_login: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      }

      const usuario = new Usuario(usuarioData)

      // ✅ Validar que foto_perfil_url está correctamente asignado (NO foto_profil_url)
      expect(usuario.foto_perfil_url).toBe('https://example.com/photo.jpg')
      expect(usuario.foto_perfil_url).toBeDefined()
      expect(typeof usuario.foto_perfil_url).toBe('string')
    })

    test('debe manejar campos opcionales como undefined', () => {
      const usuarioData = {
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      }

      const usuario = new Usuario(usuarioData)

      expect(usuario.foto_perfil_url).toBeUndefined()
      expect(usuario.fecha_registro).toBeUndefined()
      expect(usuario.ultimo_login).toBeUndefined()
    })
  })

  describe('Validaciones de Campos', () => {
    test('debe validar estructura de email', () => {
      const usuarioData = {
        id_usuario: 1,
        email: 'invalido@email',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      }

      const usuario = new Usuario(usuarioData)
      expect(usuario.email).toBe('invalido@email')
    })

    test('debe aceptar roles válidos', () => {
      const roles = ['Cliente', 'Barbero', 'Dueño', 'Admin']

      roles.forEach(rol => {
        const usuario = new Usuario({
          id_usuario: 1,
          email: 'test@example.com',
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '3001234567',
          rol: rol,
          estado: true,
          createdAt: '2026-04-14T00:00:00Z',
          updatedAt: '2026-04-14T00:00:00Z'
        })

        expect(usuario.rol).toBe(rol)
      })
    })

    test('debe validar sincronización con campos de BD', () => {
      // Campos esperados en BD según ESPECIFICACION_BD.md + migraciones
      const camposBD = [
        'id_usuario', 'email', 'nombre', 'apellido', 'telefono',
        'rol', 'estado', 'foto_perfil_url', 'fecha_registro',
        'ultimo_login', 'puntos_acumulados', 'createdAt', 'updatedAt'  // puntos_acumulados añadido en migración 20260526
      ]

      const usuarioData = {
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        foto_perfil_url: 'https://example.com/photo.jpg',
        fecha_registro: '2026-04-14',
        ultimo_login: '2026-04-14',
        puntos_acumulados: 0,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      }

      const usuario = new Usuario(usuarioData)

      // Verificar que todos los campos de BD están en el modelo
      camposBD.forEach(campo => {
        expect(usuario).toHaveProperty(campo, usuarioData[campo])
      })
    })
  })

  describe('Sincronización con BD', () => {
    test('debe tener exactamente los campos de la tabla Usuario en BD', () => {
      const usuarioData = {
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        foto_perfil_url: 'https://example.com/photo.jpg',
        fecha_registro: '2026-04-14',
        ultimo_login: '2026-04-14',
        puntos_acumulados: 0,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      }

      const usuario = new Usuario(usuarioData)

      // Campos según BD: id_usuario, email, nombre, apellido, telefono, rol, estado, 
      // foto_perfil_url, fecha_registro, ultimo_login, puntos_acumulados, createdAt, updatedAt (13 campos después de migración 20260526)
      expect(Object.keys(usuario)).toHaveLength(13)
    })

    test('debe no tener propiedades que no existan en BD', () => {
      const usuarioData = {
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        foto_perfil_url: 'https://example.com/photo.jpg',
        fecha_registro: '2026-04-14',
        ultimo_login: '2026-04-14',
        puntos_acumulados: 0,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      }

      const usuario = new Usuario(usuarioData)

      // Propiedades que NO deben existir (no están en BD)
      expect(usuario).toHaveProperty('puntos_acumulados') // ← AHORA lo tiene después de migración 20260526
      expect(usuario).not.toHaveProperty('especialidad') // ← Barbero lo tiene, pero Usuario NO
      expect(usuario).not.toHaveProperty('password') // No debe guardar contraseña aquí
    })
  })

  describe('Tipos de Datos', () => {
    test('id_usuario debe ser número', () => {
      const usuario = new Usuario({
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      })

      expect(typeof usuario.id_usuario).toBe('number')
    })

    test('email debe ser string', () => {
      const usuario = new Usuario({
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      })

      expect(typeof usuario.email).toBe('string')
    })

    test('estado debe ser booleano', () => {
      const usuario = new Usuario({
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      })

      expect(typeof usuario.estado).toBe('boolean')
    })

    test('puntos_acumulados debe ser número (agregado en migración 20260526)', () => {
      const usuario = new Usuario({
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        puntos_acumulados: 50,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      })

      expect(typeof usuario.puntos_acumulados).toBe('number')
      expect(usuario.puntos_acumulados).toBe(50)
    })

    test('puntos_acumulados debe tener valor por defecto de 0', () => {
      const usuario = new Usuario({
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        rol: 'Cliente',
        estado: true,
        createdAt: '2026-04-14T00:00:00Z',
        updatedAt: '2026-04-14T00:00:00Z'
      })

      expect(usuario.puntos_acumulados).toBe(0)
    })
  })
})
