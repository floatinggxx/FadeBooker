const { MercadoPagoConfig, Preference, Payment, Refund } = require('mercadopago');
const accessToken = process.env.MP_ACCESS_TOKEN || '';

const client = new MercadoPagoConfig({ accessToken });

module.exports = { client, Preference, Payment, Refund };

