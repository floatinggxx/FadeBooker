class SubscriptionService {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async createSubscription(provider_id, tier_id) {
    // Persistir como pending para luego procesar el pago
    const data = {
      provider_id,
      tier_id,
      started_at: new Date(),
      status: 'pending'
    };

    const [id] = await this.subscriptionRepository.create(data);

    // Intentar crear preferencia Mercado Pago si está configurado
    try {
      const { client, Preference } = require('../../config/mercadopago');
      const preference = new Preference(client);
      const body = {
        items: [{ title: `Suscripción FadeBooker - plan ${tier_id}`, quantity: 1, unit_price: Number(29.99) }],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pago-exitoso`,
          failure: `${process.env.FRONTEND_URL}/pago-fallido`,
          pending: `${process.env.FRONTEND_URL}/pago-pendiente`
        },
        external_reference: `subscription_${id}`,
        expires: true,
        expiration_date_to: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      };

      const resp = await preference.create({ body });
      const pref = resp?.body || resp;

      return { id, paymentUrl: pref.init_point };
    } catch (e) {
      console.warn('Mercado Pago no disponible para suscripciones:', e.message || e);
      return { id };
    }
  }

  async cancelSubscription(id) {
    const sub = await this.subscriptionRepository.findById(id);
    if (!sub) throw new Error('subscription_not_found');
    if (sub.status === 'cancelled') throw new Error('subscription_already_cancelled');
    await this.subscriptionRepository.cancel(id);
    return { id, status: 'cancelled' };
  }

  async listByProvider(provider_id) {
    return this.subscriptionRepository.findByProvider(provider_id);
  }
}

module.exports = SubscriptionService;
