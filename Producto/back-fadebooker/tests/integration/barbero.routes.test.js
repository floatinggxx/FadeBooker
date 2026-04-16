/**
 * Tests de Integración - Endpoints de Barbero
 * ⚠️  SKIPPED: Requieren servidor Express en ejecución + BD disponible
 * TODO: Configurar servidor de test o mockear servicios de BD
 */

const request = require('supertest')
const express = require('express')

describe.skip('Endpoints de Barbero', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use('/api/barberos', require('../../src/interfaces/http/routes/barbero.routes'))
    jest.setTimeout(3000)
  })

  test('POST /api/barberos debe existir', async () => {
    const response = await request(app)
      .post('/api/barberos')
      .timeout(2000)
      .send({ email: 'barbero@example.com' })

    expect(response.status).not.toBe(404)
  })

  test('GET /api/barberos debe existir', async () => {
    const response = await request(app)
      .get('/api/barberos')
      .timeout(2000)

    expect(response.status).not.toBe(404)
  })

  test('GET /api/barberos/:id debe existir', async () => {
    const response = await request(app)
      .get('/api/barberos/1')
      .timeout(2000)

    expect(response.status).not.toBe(404)
  })

  test('GET /api/barberos/especialidad/:especialidad debe existir', async () => {
    const response = await request(app)
      .get('/api/barberos/especialidad/Cortes')
      .timeout(2000)

    expect(response.status).not.toBe(404)
  })

  test('PUT /api/barberos/:id debe existir', async () => {
    const response = await request(app)
      .put('/api/barberos/1')
      .timeout(2000)
      .send({ nombre: 'Test' })

    expect(response.status).not.toBe(404)
  })

  test('DELETE /api/barberos/:id debe existir', async () => {
    const response = await request(app)
      .delete('/api/barberos/1')
      .timeout(2000)

    expect(response.status).not.toBe(404)
  })
})
