import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Subir a 20 usuarios
    { duration: '1m', target: 20 },  // Mantener 20 usuarios
    { duration: '20s', target: 0 },  // Bajar a 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de las peticiones deben ser < 500ms
  },
};

export default function () {
  const BASE_URL = __ENV.BACKEND_URL || 'http://localhost:3000';
  
  // 1. Health Check
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    'status is 200': (r) => r.status === 200,
  });

  // 2. Listar Barberos (Simula navegación de usuario)
  const barbersRes = http.get(`${BASE_URL}/api/barberos`);
  check(barbersRes, {
    'get barberos success': (r) => r.status === 200,
  });

  sleep(1);
}
