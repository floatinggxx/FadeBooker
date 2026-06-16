const PagoService = require('../../../src/application/usecases/pago.service');

describe('PagoService.crearPreferenciaPago - comisión y montos', () => {
  let mockPagoRepo;
  let mockCitaRepo;
  let service;

  beforeEach(() => {
    mockPagoRepo = {
      db: jest.fn(() => ({ where: () => ({ first: async () => null }), whereNull: () => ({ andWhere: () => ({ first: async () => null }) }) })),
      create: jest.fn(async () => ({})),
      findByReferencia: jest.fn(async () => null),
      findByCitaId: jest.fn(async () => []),
      update: jest.fn(async () => ({}))
    };

    mockCitaRepo = {
      findById: jest.fn(async (id) => ({
        id_cita: id,
        monto_total: 10000,
        pago_abono: 0,
        createdAt: new Date().toISOString(),
        id_tienda: 1
      })),
      update: jest.fn(async () => ({})),
      findByIdConDetalles: jest.fn(async () => null)
    };

    // Minimal mock of Preference class used by pago.service: return object with init_point and id
    const MockPreference = function () {
      this.create = async ({ body }) => ({ body: { init_point: 'https://mp.fake/init', id: 'pref_123', items: body.items } });
    };

    // Inject mock Preference into module by temporarily requiring the service and replacing Preference
    jest.resetModules();
    const modulePath = '../../../src/application/usecases/pago.service';
    const svcModule = require(modulePath);

    // Monkeypatch the Preference used inside the module
    svcModule.Preference = MockPreference;

    // Re-require PagoService constructor after patching
    const Reqd = require(modulePath);
    service = new Reqd(mockPagoRepo, mockCitaRepo);
  });

  test('sin Commission -> aplica 5% y lo suma al monto', async () => {
    // Ensure db returns no commission rows
    mockPagoRepo.db = jest.fn(() => ({ where: () => ({ first: async () => null }), whereNull: () => ({ andWhere: () => ({ first: async () => null }) }) }));

    const res = await service.crearPreferenciaPago(1, 'total');

    expect(res).toHaveProperty('montoBase');
    expect(res).toHaveProperty('comision');
    expect(res).toHaveProperty('montoConComision');
    // code rounds comision to integer CLP
    const expectedCom = Math.round(res.montoBase * 0.05);
    expect(res.comision).toBe(expectedCom);
    expect(res.montoConComision).toBe(Number((res.montoBase + expectedCom)));
  });

  test('con Commission configurada -> suma 5% + configurada', async () => {
    // commission row: porcentaje 10%, fijo 500
    mockPagoRepo.db = jest.fn(() => ({ where: (q) => ({ first: async () => ({ porcentaje: 10, fijo: 500 }) }), whereNull: () => ({ andWhere: () => ({ first: async () => null }) }) }));

    const res = await service.crearPreferenciaPago(1, 'total');

    const base = res.montoBase;
    // commission row replaces default rate; expected = porcentaje(10%) * base + fijo(500)
    const configured = Math.round(((base * 10) / 100) + 500);
    expect(res.comision).toBe(configured);
    expect(res.montoConComision).toBe(Number((base + res.comision)));
  });

  test('tienda VIP -> comision 0 y montoConComision == montoBase', async () => {
    // commission row could exist but tienda.suscripcion = 'vip'
    mockPagoRepo.db = jest.fn((table) => {
      if (table === 'Commission') return { where: () => ({ first: async () => ({ porcentaje: 10, fijo: 500 }) }), whereNull: () => ({ andWhere: () => ({ first: async () => null }) }) };
      if (table === 'Tienda') return { where: () => ({ first: async () => ({ id_tienda: 1, suscripcion: 'vip' }) }) };
      return { where: () => ({ first: async () => null }) };
    });

    const res = await service.crearPreferenciaPago(1, 'total');
    expect(res.comision).toBe(0);
    expect(res.montoConComision).toBeCloseTo(res.montoBase);
  });
});
