const SubscriptionRepositoryImpl = require('../../../infraestructure/database/SubscriptionRepositoryImpl');
const SubscriptionService = require('../../../application/usecases/subscription.service');

const subscriptionRepository = new SubscriptionRepositoryImpl();
const subscriptionService = new SubscriptionService(subscriptionRepository);

const SubscriptionController = {
  async createSubscription(req, res, next) {
    try {
      const { provider_id, tier_id } = req.body;
      if (!provider_id || !tier_id) return res.status(400).json({ error: 'provider_id y tier_id son requeridos' });
      const result = await subscriptionService.createSubscription(provider_id, tier_id);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
,
  async cancelSubscription(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'id requerido' });
      const result = await subscriptionService.cancelSubscription(Number(id));
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  ,
  async listByProvider(req, res, next) {
    try {
      const { provider_id } = req.params;
      if (!provider_id) return res.status(400).json({ error: 'provider_id requerido' });
      const subs = await subscriptionService.listByProvider(Number(provider_id));
      res.json(subs);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = SubscriptionController;
