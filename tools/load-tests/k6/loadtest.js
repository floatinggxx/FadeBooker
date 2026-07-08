import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const loginTrend = new Trend('login_latency');
const errorRate = new Rate('errors');

// Configuration via env vars
export let options = {
  stages: [
    { duration: __ENV.RAMP_UP || '2m', target: Number(__ENV.TARGET_VUS) || 100 },
    { duration: __ENV.SUSTAIN || '10m', target: Number(__ENV.TARGET_VUS) || 100 },
    { duration: __ENV.RAMP_DOWN || '2m', target: 0 }
  ],
  thresholds: {
    'errors': ['rate<0.02'],
    'http_req_duration': ['p(95)<1000']
  }
};

// Credentials pool - these users should be seeded beforehand by seed_users.js
const USERS_COUNT = Number(__ENV.SEED_COUNT) || 1000;
function pickUser() {
  const id = Math.floor(Math.random() * USERS_COUNT) + 1;
  return { email: `loadtest+user${id}@example.com`, password: 'Secreto123' };
}

export default function () {
  // 1) Login (50% of iterations)
  if (Math.random() < 0.5) {
    const u = pickUser();
    const res = http.post(`${BASE_URL}/api/usuarios/login`, JSON.stringify({ email: u.email, contrasena: u.password }), { headers: { 'Content-Type': 'application/json' } });
    const ok = check(res, { 'login status 200': (r) => r.status === 200 });
    if (!ok) errorRate.add(1);
    loginTrend.add(res.timings.duration);
    sleep(Math.random() * 2);
    return;
  }

  // 2) Public read: barberos listing (correct backend route)
  const res2 = http.get(`${BASE_URL}/api/barberos`);
  check(res2, { 'barberos 200': (r) => r.status === 200 });
  if (res2.status !== 200) errorRate.add(1);
  sleep(Math.random() * 1.5);

  // 3) Optional: create pending registration (10% chance)
  if (Math.random() < 0.1) {
    const idx = Math.floor(Math.random() * 1000000);
    const email = `pending+${Date.now()}+${idx}@example.com`;
    const payload = {
      nombre: 'Load',
      apellido: 'Test',
      email,
      telefono: '999000000',
      contrasena: 'Secreto123',
      rol: 'Cliente'
    };
    const r = http.post(`${BASE_URL}/api/usuarios/register`, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
    check(r, { 'register 201': (res) => res.status === 201 });
    if (r.status !== 201) errorRate.add(1);
    sleep(1);
  }
}
