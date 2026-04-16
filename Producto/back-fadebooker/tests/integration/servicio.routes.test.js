/**
 * Tests de Integración - Endpoints de Servicio
 * ⚠️  SKIPPED: Requieren servidor Express en ejecución + BD disponible
 * TODO: Configurar servidor de test o mockear servicios de BD
 */

const request = require('supertest')
const express = require('express')

describe.skip('Endpoints de Servicio', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use('/api/servicios', require('../../src/interfaces/http/routes/servicio.routes'))
    jest.setTimeout(3000)
  })

  test('GET /api/servicios debe existir', async () => {
    const response = await request(app)
      .get('/api/servicios')
      .timeout(2000)

    expect(response.status).not.toBe(404)
  })

  test('POST /api/servicios debe existir', async () => {
    const response = await request(app)
      .post('/api/servicios')
      .timeout(2000)
      .send({ nombre: 'Servicio Test' })

    expect(response.status).not.toBe(404)
  })

  test('GET /api/servicios/:id debe existir', async () => {
    const response = await request(app)
      .get('/api/servicios/1')
      .timeout(2000)

    expect(response.status).not.toBe(404)
  })

  test('PUT /api/servicios/:id debe existir', async () => {
    const response = await request(app)
      .put('/api/servicios/1')
      .timeout(2000)
      .send({ precio: 30000 })

    expect(response.status).not.toBe(404)
  })

  test('DELETE /api/servicios/:id debe existir', async () => {
    const response = await request(app)
      .delete('/api/servicios/1')
      .timeout(2000)

    expect(response.status).not.toBe(404)
  })
})
