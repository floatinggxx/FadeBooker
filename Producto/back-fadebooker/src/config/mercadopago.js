const MP = require('mercadopago');
const accessToken = process.env.MP_ACCESS_TOKEN || '';

let client = null;
if (typeof MP.MercadoPagoConfig === 'function') {
  client = new MP.MercadoPagoConfig({ accessToken });
} else if (typeof MP.MercadoPago === 'function') {
  client = new MP.MercadoPago({ accessToken });
} else if (typeof MP.configure === 'function') {
  MP.configure({ access_token: accessToken });
  client = MP;
} else if (MP.configurations && typeof MP.configurations.setAccessToken === 'function') {
  MP.configurations.setAccessToken(accessToken);
  client = MP;
} else {
  client = MP;
}

class Preference {
  constructor(clientInstance) {
    this.client = clientInstance;
  }

  async create({ body }) {
    if (this.client.preferences && typeof this.client.preferences.create === 'function') {
      return this.client.preferences.create(body);
    }
    if (this.client.preference && typeof this.client.preference.create === 'function') {
      return this.client.preference.create(body);
    }
    if (typeof this.client.post === 'function') {
      return this.client.post('/checkout/preferences', body);
    }
    throw new Error('Mercado Pago no expone preferences.create o equivalente');
  }
}

class Payment {
  constructor(clientInstance) {
    this.client = clientInstance;
  }

  async get({ id }) {
    if (this.client.payment && typeof this.client.payment.get === 'function') {
      return this.client.payment.get(id);
    }
    if (this.client.payments && typeof this.client.payments.get === 'function') {
      return this.client.payments.get(id);
    }
    if (this.client.get && typeof this.client.get === 'function') {
      return this.client.get(`/v1/payments/${id}`);
    }
    throw new Error('Mercado Pago no expone payment.get o equivalente');
  }
}

module.exports = { client, Preference, Payment };
