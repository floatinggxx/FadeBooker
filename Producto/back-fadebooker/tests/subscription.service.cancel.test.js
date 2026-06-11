const SubscriptionService = require('../src/application/usecases/subscription.service');

class MockRepo {
  constructor() { this.nextId = 1; this.created = []; this.store = {} }
  async create(data) { const id = this.nextId++; this.created.push(data); this.store[id] = { id, ...data }; return [id]; }
  async findById(id) { return this.store[id] }
  async cancel(id) { if (this.store[id]) { this.store[id].status = 'cancelled'; this.store[id].cancelled_at = new Date(); return 1 } return 0 }
}

jest.mock('../src/config/mercadopago', () => ({
  client: {},
  Preference: function () {
    this.create = async ({ body }) => ({ body: { init_point: 'https://mp.test/init', id: 'pref_123' } });
  }
}));

describe('SubscriptionService cancel', () => {
  test('cancels an active subscription', async () => {
    const repo = new MockRepo();
    const svc = new SubscriptionService(repo);
    const [id] = await repo.create({ provider_id: 1, tier_id: 1, status: 'pending' });
    const res = await svc.cancelSubscription(id);
    expect(res).toEqual({ id, status: 'cancelled' });
  });

  test('throws when subscription not found', async () => {
    const repo = new MockRepo();
    const svc = new SubscriptionService(repo);
    await expect(svc.cancelSubscription(999)).rejects.toThrow('subscription_not_found');
  });
});
