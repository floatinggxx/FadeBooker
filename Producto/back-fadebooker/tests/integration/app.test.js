/**
 * Tests de Integración - Aplicación Principal
 * Valida que la aplicación Express esté configurada correctamente
 * 
 * ⚠️  SKIPPED: Requieren servidor Express en ejecución + BD disponible
 * TODO: Configurar servidor de test o mockear servicios de BD
 */

const request = require('supertest')
const express = require('express')

describe.skip('Aplicación FadeBooker', () => {
  let app

  beforeAll(() => {
    // Crear una aplicación Express simple para testing
    app = express()

    // Middleware
    app.use(express.json())

    // Rutas
    app.use('/api/usuarios', require('../../src/interfaces/http/routes/usuario.routes'))
    app.use('/api/barberos', require('../../src/interfaces/http/routes/barbero.routes'))
    app.use('/api/citas', require('../../src/interfaces/http/routes/cita.routes'))

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', message: 'FadeBooker API is running' })
    })

    // Timeout global para los tests
    jest.setTimeout(3000)
  })

  describe('Health Check', () => {
    test('debe responder al health check', async () => {
      const response = await request(app)
        .get('/health')
        .timeout(2000)
        .expect(200)

      expect(response.body).toHaveProperty('status')
      expect(response.body.status).toBe('OK')
    })
  })

  describe('Rutas Principales', () => {
    test('POST /api/usuarios/register debe existir', async () => {
      const response = await request(app)
        .post('/api/usuarios/register')
        .timeout(2000)

      // La ruta existe (puede fallar por validación, pero no 404)
      expect(response.status).not.toBe(404)
    })

    test('POST /api/barberos debe existir', async () => {
      const response = await request(app)
        .post('/api/barberos')
        .timeout(2000)

      expect(response.status).not.toBe(404)
    })

    test('POST /api/citas debe existir', async () => {
      const response = await request(app)
        .post('/api/citas')
        .timeout(2000)

      expect(response.status).not.toBe(404)
    })
  })

  describe('404 Handling', () => {
    test('debe retornar 404 para rutas inexistentes', async () => {
      const response = await request(app)
        .get('/api/inexistente')
        .timeout(2000)

      expect(response.status).toBe(404)
    })
  })
})
