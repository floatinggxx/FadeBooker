/**
 * Tests Unitarios - Reseña Model
 * Valida que el modelo Reseña sincroniza correctamente con la BD
 * (Recientemente actualizado: campos renombrados y agregados)
 */

const Resena = require('../../src/domain/entities/resena.model')

describe('Reseña Model', () => {
  describe('Constructor', () => {
    test('debe crear reseña con todos los campos correctos', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 5,
        comentario: 'Excelente servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      expect(resena.id_resena).toBe(1)
      expect(resena.id_cita).toBe(10)
      expect(resena.id_cliente).toBe(5)
      expect(resena.id_barbero).toBe(3)
      expect(resena.id_tienda).toBe(2)
      expect(resena.puntuacion).toBe(5)
      expect(resena.comentario).toBe('Excelente servicio')
      expect(resena.fecha_resena).toBe('2026-04-14')
    })

    test('debe usar id_cliente en lugar de id_usuario (corrección realizada)', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 5,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      // ✅ Debe tener id_cliente, NO id_usuario
      expect(resena.id_cliente).toBe(5)
      expect(resena).not.toHaveProperty('id_usuario')
    })

    test('debe usar puntuacion en lugar de calificacion (corrección realizada)', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      // ✅ Debe tener puntuacion, NO calificacion
      expect(resena.puntuacion).toBe(4)
      expect(resena).not.toHaveProperty('calificacion')
    })

    test('debe incluir id_barbero (campo agregado)', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      // ✅ Debe tener id_barbero (agregado en corrección)
      expect(resena.id_barbero).toBe(3)
      expect(resena.id_barbero).toBeDefined()
    })

    test('debe incluir id_tienda (campo agregado)', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      // ✅ Debe tener id_tienda (agregado en corrección)
      expect(resena.id_tienda).toBe(2)
      expect(resena.id_tienda).toBeDefined()
    })

    test('debe incluir fecha_resena (campo agregado)', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14T15:30:00Z',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      // ✅ Debe tener fecha_resena (agregado en corrección)
      expect(resena.fecha_resena).toBe('2026-04-14T15:30:00Z')
      expect(resena.fecha_resena).toBeDefined()
    })
  })

  describe('Campos Sincronizados con BD', () => {
    test('debe tener exactamente los 9 campos de la tabla Reseña en BD', () => {
      // Campos esperados según BD:
      // id_resena, id_cita, id_cliente, id_barbero, id_tienda,
      // puntuacion, comentario, fecha_resena, createdAt
      const camposBD = [
        'id_resena', 'id_cita', 'id_cliente', 'id_barbero',
        'id_tienda', 'puntuacion', 'comentario', 'fecha_resena', 'createdAt'
      ]

      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14T15:30:00Z',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      // Verificar que todos los campos de BD están presentes
      camposBD.forEach(campo => {
        expect(resena).toHaveProperty(campo)
      })

      // Verificar que es exactamente el número correcto de campos
      expect(Object.keys(resena).length).toBe(9)
    })

    test('no debe tener propiedades que no existen en BD', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14T15:30:00Z',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      // Propiedades que NO deben existir (las viejas)
      expect(resena).not.toHaveProperty('id_usuario')
      expect(resena).not.toHaveProperty('calificacion')
      expect(resena).not.toHaveProperty('updatedAt') // Reseña NO tiene updatedAt
    })
  })

  describe('Validaciones de Puntuación', () => {
    test('debe aceptar puntuaciones entre 1 y 5', () => {
      const puntuaciones = [1, 2, 3, 4, 5]

      puntuaciones.forEach(puntuacion => {
        const resena = new Resena({
          id_resena: 1,
          id_cita: 10,
          id_cliente: 5,
          id_barbero: 3,
          id_tienda: 2,
          puntuacion: puntuacion,
          comentario: 'Buen servicio',
          fecha_resena: '2026-04-14',
          createdAt: '2026-04-14T00:00:00Z'
        })

        expect(resena.puntuacion).toBe(puntuacion)
        expect(resena.puntuacion).toBeGreaterThanOrEqual(1)
        expect(resena.puntuacion).toBeLessThanOrEqual(5)
      })
    })
  })

  describe('Tipos de Datos', () => {
    test('id_resena debe ser número', () => {
      const resena = new Resena({
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      })

      expect(typeof resena.id_resena).toBe('number')
    })

    test('puntuacion debe ser número', () => {
      const resena = new Resena({
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      })

      expect(typeof resena.puntuacion).toBe('number')
    })

    test('comentario debe ser string', () => {
      const resena = new Resena({
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Excelente trabajo',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      })

      expect(typeof resena.comentario).toBe('string')
    })
  })

  describe('Relaciones de BD', () => {
    test('reseña debe estar ligada a id_cliente y id_barbero', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 5,
        comentario: 'Perfecto',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      // Validar relaciones
      expect(resena.id_cliente).toBeDefined()
      expect(resena.id_barbero).toBeDefined()
      expect(resena.id_tienda).toBeDefined()
      expect(resena.id_cita).toBeDefined()

      // FK type - todos son números
      expect(typeof resena.id_cliente).toBe('number')
      expect(typeof resena.id_barbero).toBe('number')
      expect(typeof resena.id_tienda).toBe('number')
      expect(typeof resena.id_cita).toBe('number')
    })
  })

  describe('Resumen de Cambios Realizados', () => {
    test('✅ CORREGIDO: id_usuario → id_cliente', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5, // ← Corrección
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)
      expect(resena.id_cliente).toBe(5)
    })

    test('✅ CORREGIDO: calificacion → puntuacion', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4, // ← Corrección
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)
      expect(resena.puntuacion).toBe(4)
    })

    test('✅ AGREGADO: id_barbero', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3, // ← Agregado
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)
      expect(resena.id_barbero).toBe(3)
    })

    test('✅ AGREGADO: id_tienda', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2, // ← Agregado
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)
      expect(resena.id_tienda).toBe(2)
    })

    test('✅ AGREGADO: fecha_resena', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Buen servicio',
        fecha_resena: '2026-04-14T15:30:00Z', // ← Agregado
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)
      expect(resena.fecha_resena).toBe('2026-04-14T15:30:00Z')
    })
  })
})
