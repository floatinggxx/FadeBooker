const TiendaService = require('../src/application/usecases/tienda.service')

// Mocks simples
class MockTiendaRepo {
  constructor(tiendas) { this.tiendas = tiendas }
  async findAll() { return this.tiendas }
  async create(data) { return 123 }
}
class MockBarberoRepo {
  constructor(barberosByTienda, barberoByUsuario) { this.byTienda = barberosByTienda; this.byUsuario = barberoByUsuario }
  async findByTienda(id) { return this.byTienda[id] || [] }
  async findByUsuarioId(id_usuario) { return this.byUsuario || null }
  async create(data) { return 55 }
  async update(id_barbero, data) { return true }
}

describe('TiendaService', () => {
  test('obtenerTodasLasTiendas filtra tiendas incompletas y sin barbero', async () => {
    const tiendas = [
      { id_tienda: 1, nombre_tienda:'A', comuna:'Comuna', region:'Reg', dias_laborales:'Lunes' },
      { id_tienda: 2, nombre_tienda:'B', comuna:null, region:'Reg', dias_laborales:'Lunes' },
      { id_tienda: 3, nombre_tienda:'C', comuna:'C', region:'R', dias_laborales:null }
    ]
    const barberos = { 1: [{id_barbero:10}], 2: [], 3: [] }
    const tiendaRepo = new MockTiendaRepo(tiendas)
    const barberoRepo = new MockBarberoRepo(barberos)
    const svc = new TiendaService(tiendaRepo, barberoRepo)

    const res = await svc.obtenerTodasLasTiendas()
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(1)
    expect(res[0].id_tienda).toBe(1)
  })

  test('crearTienda crea barbero si owner no es barbero', async () => {
    const tiendaRepo = new MockTiendaRepo([])
    const barberoRepo = new MockBarberoRepo({}, null)
    const svc = new TiendaService(tiendaRepo, barberoRepo)
    const id = await svc.crearTienda({ id_dueño: 999 })
    expect(id).toBe(123)
  })
})
