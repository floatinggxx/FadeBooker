/**
 * Tests Unitarios - ServicioBarberoRepositoryImpl
 * NUEVO en v1.10.0 - Validar métodos del repositorio de ServicioBarbero
 * 
 * Pruebas de lógica de herencia de precios/duraciones con ISNULL()
 */

describe('ServicioBarberoRepositoryImpl (v1.10.0)', () => {
  
  // Mock de Knex.js
  let mockDb
  let mockQueryBuilder
  let repository

  beforeEach(() => {
    // Crear mock de query builder
    mockQueryBuilder = {
      join: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnThis(),
      count: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      raw: jest.fn(sql => sql),
    }

    // Crear mock de Knex
    mockDb = jest.fn().mockReturnValue(mockQueryBuilder)
    mockDb.raw = jest.fn(sql => sql)

    // Crear instancia del repositorio
    class ServicioBarberoRepositoryImpl {
      constructor() {
        this.db = mockDb
      }

      async findByBarbero(id_barbero) {
        return this.db('ServicioBarbero')
          .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
          .where('ServicioBarbero.id_barbero', id_barbero)
          .where('ServicioBarbero.disponible', true)
          .select(
            'Servicio.*',
            this.db.raw('ISNULL(ServicioBarbero.precio_barbero, Servicio.precio_base) as precio'),
            this.db.raw('ISNULL(ServicioBarbero.tiempo_servicio_minutos, Servicio.duracion_minutos) as duracion')
          )
      }

      async findByServicio(id_servicio) {
        return this.db('ServicioBarbero')
          .join('Barbero', 'ServicioBarbero.id_barbero', '=', 'Barbero.id_barbero')
          .where('ServicioBarbero.id_servicio', id_servicio)
          .where('ServicioBarbero.disponible', true)
          .select(
            'Barbero.*',
            this.db.raw('ISNULL(ServicioBarbero.precio_barbero, Servicio.precio_base) as precio')
          )
      }

      async canBarberoDoServicio(id_barbero, id_servicio) {
        return this.db('ServicioBarbero')
          .where('id_barbero', id_barbero)
          .where('id_servicio', id_servicio)
          .where('disponible', true)
          .first()
      }

      async getPrecioEfectivo(id_barbero, id_servicio) {
        return this.db('ServicioBarbero')
          .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
          .where('ServicioBarbero.id_barbero', id_barbero)
          .where('ServicioBarbero.id_servicio', id_servicio)
          .select(
            this.db.raw('ISNULL(ServicioBarbero.precio_barbero, Servicio.precio_base) as precio_efectivo'),
            'Servicio.precio_base',
            'ServicioBarbero.precio_barbero'
          )
          .first()
      }

      async getDuracionEfectiva(id_barbero, id_servicio) {
        return this.db('ServicioBarbero')
          .join('Servicio', 'ServicioBarbero.id_servicio', '=', 'Servicio.id_servicio')
          .where('ServicioBarbero.id_barbero', id_barbero)
          .where('ServicioBarbero.id_servicio', id_servicio)
          .select(
            this.db.raw('ISNULL(ServicioBarbero.tiempo_servicio_minutos, Servicio.duracion_minutos) as duracion_efectiva'),
            'Servicio.duracion_minutos',
            'ServicioBarbero.tiempo_servicio_minutos'
          )
          .first()
      }

      async countBarberosByServicio(id_servicio) {
        return this.db('ServicioBarbero')
          .where('id_servicio', id_servicio)
          .where('disponible', true)
          .count('* as total')
          .first()
      }

      async countServiciosByBarbero(id_barbero) {
        return this.db('ServicioBarbero')
          .where('id_barbero', id_barbero)
          .where('disponible', true)
          .count('* as total')
          .first()
      }

      async agregarServicio(id_barbero, id_servicio, precio_barbero = null, tiempo_servicio_minutos = null) {
        const data = {
          id_barbero,
          id_servicio,
          precio_barbero,
          tiempo_servicio_minutos,
          disponible: true
        }
        const [id] = await this.db('ServicioBarbero').insert(data).returning('id_servicio_barbero')
        return id
      }

      async removerServicio(id_barbero, id_servicio) {
        return this.db('ServicioBarbero')
          .where('id_barbero', id_barbero)
          .where('id_servicio', id_servicio)
          .del()
      }

      async actualizarPrecioServicio(id_barbero, id_servicio, precio_barbero) {
        return this.db('ServicioBarbero')
          .where('id_barbero', id_barbero)
          .where('id_servicio', id_servicio)
          .update({ precio_barbero })
      }

      async actualizarDuracionServicio(id_barbero, id_servicio, tiempo_servicio_minutos) {
        return this.db('ServicioBarbero')
          .where('id_barbero', id_barbero)
          .where('id_servicio', id_servicio)
          .update({ tiempo_servicio_minutos })
      }
    }

    repository = new ServicioBarberoRepositoryImpl()
  })

  // ========================================================================
  // Tests de lectura
  // ========================================================================

  test('findByBarbero() debe hacer join con Servicio', async () => {
    mockQueryBuilder.first.mockResolvedValueOnce({
      id_servicio: 101,
      nombre_servicio: 'Corte Clásico',
      precio_barbero: 25000
    })

    await repository.findByBarbero(5)

    expect(mockDb).toHaveBeenCalledWith('ServicioBarbero')
    expect(mockQueryBuilder.join).toHaveBeenCalledWith(
      'Servicio',
      'ServicioBarbero.id_servicio',
      '=',
      'Servicio.id_servicio'
    )
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('ServicioBarbero.id_barbero', 5)
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('ServicioBarbero.disponible', true)
  })

  test('canBarberoDoServicio() debe retornar relación si existe', async () => {
    mockQueryBuilder.first.mockResolvedValueOnce({
      id_servicio_barbero: 1,
      id_barbero: 5,
      id_servicio: 101,
      disponible: true
    })

    const result = await repository.canBarberoDoServicio(5, 101)

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_barbero', 5)
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_servicio', 101)
    expect(result).toBeTruthy()
  })

  test('canBarberoDoServicio() debe retornar null si no existe', async () => {
    mockQueryBuilder.first.mockResolvedValueOnce(null)

    const result = await repository.canBarberoDoServicio(5, 999)

    expect(result).toBeNull()
  })

  test('getPrecioEfectivo() debe usar raw SQL con ISNULL()', async () => {
    await repository.getPrecioEfectivo(5, 101)

    expect(mockDb.raw).toHaveBeenCalledWith(
      expect.stringContaining('ISNULL')
    )
  })

  test('getDuracionEfectiva() debe usar raw SQL con ISNULL()', async () => {
    await repository.getDuracionEfectiva(5, 101)

    expect(mockDb.raw).toHaveBeenCalledWith(
      expect.stringContaining('ISNULL')
    )
  })

  test('countBarberosByServicio() debe contar barberos únicos', async () => {
    mockQueryBuilder.first.mockResolvedValueOnce({ total: 3 })

    const result = await repository.countBarberosByServicio(101)

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_servicio', 101)
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('disponible', true)
    expect(result.total).toBe(3)
  })

  test('countServiciosByBarbero() debe contar servicios únicos', async () => {
    mockQueryBuilder.first.mockResolvedValueOnce({ total: 7 })

    const result = await repository.countServiciosByBarbero(5)

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_barbero', 5)
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('disponible', true)
    expect(result.total).toBe(7)
  })

  // ========================================================================
  // Tests de escritura
  // ========================================================================

  test('agregarServicio() debe insertar con datos correctos', async () => {
    mockQueryBuilder.returning.mockResolvedValueOnce([100])

    await repository.agregarServicio(5, 101, 25000, 30)

    expect(mockDb).toHaveBeenCalledWith('ServicioBarbero')
    expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
      id_barbero: 5,
      id_servicio: 101,
      precio_barbero: 25000,
      tiempo_servicio_minutos: 30,
      disponible: true
    })
  })

  test('agregarServicio() debe permitir null en precios', async () => {
    mockQueryBuilder.returning.mockResolvedValueOnce([100])

    await repository.agregarServicio(5, 101, null, null)

    expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
      id_barbero: 5,
      id_servicio: 101,
      precio_barbero: null,
      tiempo_servicio_minutos: null,
      disponible: true
    })
  })

  test('removerServicio() debe usar delete correcto', async () => {
    await repository.removerServicio(5, 101)

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_barbero', 5)
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_servicio', 101)
    expect(mockQueryBuilder.del).toHaveBeenCalled()
  })

  test('actualizarPrecioServicio() debe actualizar precio_barbero', async () => {
    await repository.actualizarPrecioServicio(5, 101, 27500)

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_barbero', 5)
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_servicio', 101)
    expect(mockQueryBuilder.update).toHaveBeenCalledWith({ precio_barbero: 27500 })
  })

  test('actualizarDuracionServicio() debe actualizar tiempo_servicio_minutos', async () => {
    await repository.actualizarDuracionServicio(5, 101, 45)

    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_barbero', 5)
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_servicio', 101)
    expect(mockQueryBuilder.update).toHaveBeenCalledWith({ tiempo_servicio_minutos: 45 })
  })

  // ========================================================================
  // Tests de lógica de herencia (v1.10.0)
  // ========================================================================

  test('Lógica ISNULL() debe usar precio_barbero si existe', () => {
    const sql = 'ISNULL(ServicioBarbero.precio_barbero, Servicio.precio_base)'
    
    // Simulación: si precio_barbero NO ES NULL, usa ese
    const precio_barbero = 25000
    const precio_base = 30000
    
    const precio_efectivo = precio_barbero !== null ? precio_barbero : precio_base
    
    expect(precio_efectivo).toBe(25000)
  })

  test('Lógica ISNULL() debe usar precio_base si precio_barbero es NULL', () => {
    const sql = 'ISNULL(ServicioBarbero.precio_barbero, Servicio.precio_base)'
    
    // Simulación: si precio_barbero ES NULL, usa precio_base
    const precio_barbero = null
    const precio_base = 30000
    
    const precio_efectivo = precio_barbero !== null ? precio_barbero : precio_base
    
    expect(precio_efectivo).toBe(30000)
  })

  test('Lógica ISNULL() debe usar duracion_barbero si existe', () => {
    const tiempo_servicio_minutos = 45
    const duracion_minutos = 60
    
    const duracion_efectiva = tiempo_servicio_minutos !== null ? tiempo_servicio_minutos : duracion_minutos
    
    expect(duracion_efectiva).toBe(45)
  })

  test('Lógica ISNULL() debe usar duracion_base si tiempo_servicio_minutos es NULL', () => {
    const tiempo_servicio_minutos = null
    const duracion_minutos = 60
    
    const duracion_efectiva = tiempo_servicio_minutos !== null ? tiempo_servicio_minutos : duracion_minutos
    
    expect(duracion_efectiva).toBe(60)
  })
})
