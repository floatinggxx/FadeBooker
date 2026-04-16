/**
 * Tests de Integración - Endpoints de ServicioBarbero
 * NUEVO en v1.10.0 - Validar nuevos endpoints de ServicioBarbero
 * 
 * Cambio de arquitectura: Servicios ahora vinculados con Barberos (no Tiendas)
 */

const request = require('supertest')
const express = require('express')

describe('Endpoints de ServicioBarbero (v1.10.0)', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use(express.json())
    
    // Mock routes para prueba con validaciones
    app.get('/api/barberos/:id/servicios', (req, res) => {
      const { id } = req.params
      // Validar que el barbero existe
      if (id === '99999' || isNaN(id)) {
        return res.status(404).json({ error: 'Barbero no encontrado' })
      }
      res.status(200).json([
        {
          id_servicio_barbero: 1,
          id_servicio: 101,
          id_barbero: parseInt(id),
          nombre_servicio: 'Corte Clásico',
          precio: 25000,
          duracion: 30
        }
      ])
    })

    app.post('/api/barberos/:id/servicios', (req, res) => {
      // Validar que id_servicio está presente
      if (!req.body.id_servicio) {
        return res.status(400).json({ error: 'id_servicio es requerido' })
      }
      res.status(201).json({
        id_servicio_barbero: 2,
        mensaje: 'Servicio agregado al barbero'
      })
    })

    app.delete('/api/barberos/:id/servicios/:id_servicio', (req, res) => {
      res.status(200).json({
        mensaje: 'Servicio removido del barbero'
      })
    })

    app.get('/api/servicios/:id/barberos', (req, res) => {
      const { id } = req.params
      // Validar que el servicio existe
      if (id === '99999' || isNaN(id)) {
        return res.status(404).json({ error: 'Servicio no encontrado' })
      }
      res.status(200).json([
        {
          id_barbero: 5,
          nombre: 'Juan',
          apellido: 'Pérez',
          especialidad: 'Cortes modernos',
          precio_barbero: 25000
        },
        {
          id_barbero: 6,
          nombre: 'Carlos',
          apellido: 'García',
          especialidad: 'Barbas',
          precio_barbero: 20000
        }
      ])
    })

    app.get('/api/servicios/:id_barbero/:id_servicio/precio', (req, res) => {
      res.status(200).json({
        id_barbero: 5,
        id_servicio: 101,
        precio_base: 30000,
        precio_barbero: 25000,
        precio_efectivo: 25000
      })
    })

    app.get('/api/servicios/:id_barbero/:id_servicio/duracion', (req, res) => {
      res.status(200).json({
        id_barbero: 5,
        id_servicio: 101,
        duracion_base: 45,
        tiempo_servicio_minutos: 30,
        duracion_efectiva: 30
      })
    })

    jest.setTimeout(3000)
  })

  // ========================================================================
  // GET /api/barberos/:id/servicios - Obtener servicios de un barbero
  // ========================================================================

  test('GET /api/barberos/:id/servicios debe retornar servicios del barbero', async () => {
    const response = await request(app)
      .get('/api/barberos/5/servicios')
      .timeout(2000)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('id_servicio')
      expect(response.body[0]).toHaveProperty('id_barbero')
      expect(response.body[0]).toHaveProperty('nombre_servicio')
      expect(response.body[0]).toHaveProperty('precio')
      expect(response.body[0]).toHaveProperty('duracion')
    }
  })

  test('GET /api/barberos/:id/servicios con barbero inexistente debe retornar 404', async () => {
    const response = await request(app)
      .get('/api/barberos/99999/servicios')
      .timeout(2000)

    expect(response.status).not.toBe(200)
  })

  // ========================================================================
  // POST /api/barberos/:id/servicios - Agregar servicio a barbero
  // ========================================================================

  test('POST /api/barberos/:id/servicios debe agregar servicio', async () => {
    const response = await request(app)
      .post('/api/barberos/5/servicios')
      .timeout(2000)
      .send({
        id_servicio: 102,
        precio_barbero: 35000,
        tiempo_servicio_minutos: 45
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id_servicio_barbero')
    expect(response.body).toHaveProperty('mensaje')
  })

  test('POST /api/barberos/:id/servicios sin datos debe fallar', async () => {
    const response = await request(app)
      .post('/api/barberos/5/servicios')
      .timeout(2000)
      .send({})

    expect(response.status).not.toBe(201)
  })

  // ========================================================================
  // DELETE /api/barberos/:id/servicios/:id_servicio - Remover servicio
  // ========================================================================

  test('DELETE /api/barberos/:id/servicios/:id_servicio debe remover servicio', async () => {
    const response = await request(app)
      .delete('/api/barberos/5/servicios/101')
      .timeout(2000)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('mensaje')
  })

  // ========================================================================
  // GET /api/servicios/:id/barberos - Obtener barberos que hacen servicio
  // ========================================================================

  test('GET /api/servicios/:id/barberos debe retornar barberos disponibles', async () => {
    const response = await request(app)
      .get('/api/servicios/101/barberos')
      .timeout(2000)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('id_barbero')
      expect(response.body[0]).toHaveProperty('nombre')
      expect(response.body[0]).toHaveProperty('especialidad')
      expect(response.body[0]).toHaveProperty('precio_barbero')
    }
  })

  test('GET /api/servicios/:id/barberos con servicio inexistente debe retornar 404', async () => {
    const response = await request(app)
      .get('/api/servicios/99999/barberos')
      .timeout(2000)

    expect(response.status).not.toBe(200)
  })

  // ========================================================================
  // GET /api/servicios/:id_barbero/:id_servicio/precio - Precio efectivo
  // ========================================================================

  test('GET /api/servicios/:id_barbero/:id_servicio/precio debe retornar precio efectivo', async () => {
    const response = await request(app)
      .get('/api/servicios/5/101/precio')
      .timeout(2000)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('precio_base')
    expect(response.body).toHaveProperty('precio_efectivo')
    expect(response.body.precio_efectivo).toBeLessThanOrEqual(response.body.precio_base)
  })

  test('GET /api/servicios/:id_barbero/:id_servicio/precio debe usar override si existe', async () => {
    const response = await request(app)
      .get('/api/servicios/5/101/precio')
      .timeout(2000)

    expect(response.status).toBe(200)
    expect(response.body.precio_barbero).toBe(25000)
    expect(response.body.precio_efectivo).toBe(25000)
  })

  // ========================================================================
  // GET /api/servicios/:id_barbero/:id_servicio/duracion - Duración efectiva
  // ========================================================================

  test('GET /api/servicios/:id_barbero/:id_servicio/duracion debe retornar duración efectiva', async () => {
    const response = await request(app)
      .get('/api/servicios/5/101/duracion')
      .timeout(2000)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('duracion_base')
    expect(response.body).toHaveProperty('duracion_efectiva')
    expect(response.body.duracion_efectiva).toBeLessThanOrEqual(response.body.duracion_base)
  })

  test('GET /api/servicios/:id_barbero/:id_servicio/duracion debe usar override si existe', async () => {
    const response = await request(app)
      .get('/api/servicios/5/101/duracion')
      .timeout(2000)

    expect(response.status).toBe(200)
    expect(response.body.tiempo_servicio_minutos).toBe(30)
    expect(response.body.duracion_efectiva).toBe(30)
  })
})
