Subscriptions API

Endpoints

- POST /api/subscriptions
	- Body: `{ provider_id: number, tier_id: number }`
	- Response: `201 { id, paymentUrl? }` — if `paymentUrl` is provided the frontend should redirect the user to the payment portal (Mercado Pago).

- POST /api/subscriptions/:id/cancel
	- Cancela la suscripción. Response: `{ id, status: 'cancelled' }`

- GET /api/subscriptions/provider/:provider_id
	- Lista las suscripciones activas/pendientes para un proveedor.

Database

- Migration: `Documentación/20260611_Create_Subscription_Table.sql`
	- Campos: `id, provider_id, tier_id, status, started_at, ended_at, plan_period_days, cancelled_at, metadata`

Notes

- Billing: Pagos recurrentes son gestionados por Mercado Pago; FadeBooker no almacena datos de tarjetas.
- Privacy: consultas y cancelaciones pueden solicitarse desde el panel del proveedor o vía API y quedarán registradas con `cancelled_at`.

