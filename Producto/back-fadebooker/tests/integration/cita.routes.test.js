/**
 * Tests de Integración - Endpoints de Cita
 * Valida que los endpoints estén disponibles
 */

const request = require('supertest')
const express = require('express')

describe('Endpoints de Cita', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use('/api/citas', require('../../src/interfaces/http/routes/cita.routes'))
    jest.setTimeout(3000)
  })

  test('POST /api/citas debe existir', async () => {
    const response = await request(app)
      .post('/api/citas')
      .timeout(2000)
      .send({ id_cliente: 1, id_barbero: 1 })

    expect(response.status).not.toBe(404)
  })

  test('PUT /api/citas/:id/estado debe existir', async () => {
    const response = await request(app)
      .put('/api/citas/1/estado')
      .timeout(2000)
      .send({ estado: 'confirmada' })

    expect(response.status).not.toBe(404)
  })

  test('GET /api/citas debe retornar 404 (ruta no definida)', async () => {
    const response = await request(app)
      .get('/api/citas')
      .timeout(2000)

    expect(response.status).toBe(404)
  })
})
