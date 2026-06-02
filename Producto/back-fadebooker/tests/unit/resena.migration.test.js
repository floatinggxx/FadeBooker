/**
 * Tests Unitarios - Reseña Model - Migraciones de Azure
 * Valida cambios recientes en la tabla Reseña:
 * - puntuacion: INT -> DECIMAL(3,1) (20260526_AddHalfStarsAndBackfill.sql)
 */

const Resena = require('../../src/domain/entities/resena.model')

describe('Resena Model - Cambios de Migracion', () => {
  describe('Soporte para Media Estrellas (DECIMAL 3,1)', () => {
    test('debe aceptar puntuaciones con decimales - 4.5 estrellas', () => {
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4.5,
        comentario: 'Excelente servicio',
        fecha_resena: '2026-04-14T15:30:00Z',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      expect(resena.puntuacion).toBe(4.5)
      expect(typeof resena.puntuacion).toBe('number')
      expect(Number.isFinite(resena.puntuacion)).toBe(true)
    })

    test('debe validar rango 1.0 a 5.0 con decimales', () => {
      const puntuacionesValidas = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]

      puntuacionesValidas.forEach(puntuacion => {
        const resena = new Resena({
          id_resena: 1,
          id_cita: 10,
          id_cliente: 5,
          id_barbero: 3,
          id_tienda: 2,
          puntuacion: puntuacion,
          comentario: 'Prueba',
          fecha_resena: '2026-04-14',
          createdAt: '2026-04-14T00:00:00Z'
        })

        expect(resena.puntuacion).toBeGreaterThanOrEqual(1.0)
        expect(resena.puntuacion).toBeLessThanOrEqual(5.0)
        expect(resena.puntuacion).toBe(puntuacion)
      })
    })

    test('debe mostrar cambio de tipo: INT -> DECIMAL (migracion 20260526)', () => {
      // Antes (INT): solo valores enteros
      // Despues (DECIMAL 3,1): permite un decimal

      const resenaConEntero = new Resena({
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4,
        comentario: 'Perfecto',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      })

      const resenaConDecimal = new Resena({
        id_resena: 2,
        id_cita: 11,
        id_cliente: 6,
        id_barbero: 4,
        id_tienda: 2,
        puntuacion: 4.5,
        comentario: 'Muy bueno',
        fecha_resena: '2026-04-14',
        createdAt: '2026-04-14T00:00:00Z'
      })

      expect(resenaConEntero.puntuacion).toBe(4)
      expect(resenaConDecimal.puntuacion).toBe(4.5)
      expect(typeof resenaConEntero.puntuacion).toBe('number')
      expect(typeof resenaConDecimal.puntuacion).toBe('number')
    })
  })

  describe('Integracion con cambios de migracion de Azure', () => {
    test('modelo debe estar sincronizado con BD post-migracion', () => {
      // Estructura esperada despues de todas las migraciones
      const resenaData = {
        id_resena: 1,
        id_cita: 10,
        id_cliente: 5,
        id_barbero: 3,
        id_tienda: 2,
        puntuacion: 4.5,
        comentario: 'Excelente',
        fecha_resena: '2026-04-14T15:30:00Z',
        createdAt: '2026-04-14T00:00:00Z'
      }

      const resena = new Resena(resenaData)

      // Campos obligatorios post-migracion
      expect(resena.id_resena).toBeDefined()
      expect(resena.id_cita).toBeDefined()
      expect(resena.id_cliente).toBeDefined()
      expect(resena.id_barbero).toBeDefined()
      expect(resena.id_tienda).toBeDefined()
      expect(resena.puntuacion).toBeDefined()
      expect(resena.comentario).toBeDefined()
      expect(resena.fecha_resena).toBeDefined()
      expect(resena.createdAt).toBeDefined()

      // NO debe tener updatedAt (no existe en tabla Resena)
      expect(resena.updatedAt).toBeUndefined()
    })
  })
})
