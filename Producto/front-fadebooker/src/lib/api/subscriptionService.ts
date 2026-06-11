import api from '../api';

export interface CreateSubscriptionRequest {
  provider_id: number;
  tier_id: number;
}

export const subscriptionService = {
  async createSubscription(payload: CreateSubscriptionRequest) {
    const response = await api.post('/subscriptions', payload);
    return response.data;
  }
}
