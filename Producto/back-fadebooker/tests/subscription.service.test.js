const SubscriptionService = require('../src/application/usecases/subscription.service');

// Mock repository that returns incremental ids
class MockRepo {
  constructor() { this.nextId = 1; this.created = [] }
  async create(data) { this.created.push(data); return [this.nextId++]; }
}

// Mock Mercado Pago Preference to avoid network calls
jest.mock('../src/config/mercadopago', () => ({
  client: {},
  Preference: function () {
    this.create = async ({ body }) => ({ body: { init_point: 'https://mp.test/init', id: 'pref_123' } });
  }
}));

describe('SubscriptionService', () => {
  test('creates subscription and returns paymentUrl when MP available', async () => {
    const repo = new MockRepo();
    const svc = new SubscriptionService(repo);
    const result = await svc.createSubscription(42, 2);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('paymentUrl');
    expect(result.paymentUrl).toContain('https://mp.test/init');
  });

  test('persists pending subscription in repository', async () => {
    const repo = new MockRepo();
    const svc = new SubscriptionService(repo);
    const result = await svc.createSubscription(100, 1);
    expect(repo.created.length).toBeGreaterThan(0);
    const created = repo.created[0];
    expect(created.provider_id).toBe(100);
    expect(created.tier_id).toBe(1);
    expect(created.status).toBe('pending');
  });
});
