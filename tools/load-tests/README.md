Load testing resources for FadeBooker

Overview
--------
This folder contains a k6 script to run load tests against the backend and a Node seeder to populate test users in the `Usuario` table.

Files
-----
- `k6/loadtest.js`: k6 script that executes login (using seeded users), public reads (`/api/barberias`) and creates pending registrations.
- `seed_users.js`: Node script to insert many test users directly into the database. Uses bcrypt to hash passwords.

Preparation
-----------
1. Seed users (run from the repo root):

```bash
# install dependencies required by the seeder
cd tools/load-tests
npm install knex mssql bcrypt minimist

# set DB env vars then run
DB_HOST=localhost DB_USER=sa DB_PASSWORD=Your_password123 DB_NAME=FadeBooker node seed_users.js --count=1000
```

2. Run k6 test (install k6 locally):

```bash
# from repo root
# adjust BASE_URL, TARGET_VUS and SEED_COUNT as needed
BASE_URL=https://fadebooker-backend.local TARGET_VUS=200 SEED_COUNT=1000 k6 run tools/load-tests/k6/loadtest.js
```

Notes and limitations
---------------------
- The seeder writes directly to the `Usuario` table. Run only against a test database.
- The k6 script assumes seeded users follow the `loadtest+user{N}@example.com` pattern and password `Secreto123`.
- The register flow in k6 only creates pending registrations (it posts to `/api/usuarios/register`). Confirm tokens are emailed in a real system; to test full confirm flow you need a test-only path to fetch tokens or run the DB queries to read `PendingEmailConfirmation` tokens and call `/usuarios/confirm-email?token=...`.

Observability
-------------
- While running tests monitor:
  - CPU/memory of backend instances
  - DB connection pool usage
  - P95/P99 latency and error rate

Suggested next steps
--------------------
- Add a small worker to read `PendingEmailConfirmation` and auto-confirm test tokens in test environment so load tests can exercise full register->confirm->login flow.
- Integrate k6 with Prometheus/Grafana or k6 cloud for richer reporting.
