# 🏗️ FadeBooker Codebase Structure & Conventions Guide

**Last Updated:** April 28, 2026  
**Workspace Root:** `c:\Users\SanNi\OneDrive\Escritorio\Barberia\FadeBooker`

---

## 📋 Quick Navigation

1. [Backend (Node.js)](#backend-nodejs)
2. [Frontend (React)](#frontend-react)
3. [Database](#database)
4. [Testing Setup](#testing-setup)
5. [Build & Run Commands](#build--run-commands)

---

## 🔌 Backend (Node.js)

### Entry Point & Main Configuration

| File | Purpose |
|------|---------|
| [Producto/back-fadebooker/src/index.js](Producto/back-fadebooker/src/index.js) | **Main entry point** - Starts Express server on PORT (default: 3000) |
| [Producto/back-fadebooker/src/app.js](Producto/back-fadebooker/src/app.js) | Express app initialization, middleware setup, routes mounting |
| [Producto/back-fadebooker/src/config/knexfile.js](Producto/back-fadebooker/src/config/knexfile.js) | Knex.js database configuration (dev/local environments) |
| [Producto/back-fadebooker/src/db/knex.js](Producto/back-fadebooker/src/db/knex.js) | Knex instance initialization (uses `config.development` by default) |
| [Producto/back-fadebooker/.env](#environment-setup) | **Required env vars**: `DB_SERVER`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT` |

### Architecture Pattern: **Hexagonal (Ports & Adapters)**

```
src/
├── index.js                    # Server startup
├── app.js                      # Express app
├── config/                     # Configuration files
│   ├── knexfile.js            # Database connection config
│   └── cloudinary.config.js    # Image storage config
├── db/                         # Database utilities
│   └── knex.js                # Query builder instance
├── domain/                     # Core business logic (DDD)
│   ├── entities/              # Domain models (10 files)
│   │   ├── usuario.model.js
│   │   ├── barbero.model.js
│   │   ├── cita.model.js
│   │   ├── servicio.model.js
│   │   ├── tienda.model.js
│   │   └── ... (5 more)
│   ├── repositories/          # Data access abstractions (5 files)
│   │   ├── usuario.repository.js
│   │   ├── barbero.repository.js
│   │   ├── cita.repository.js
│   │   ├── servicio.repository.js
│   │   └── cliente.repository.js
│   └── services/              # Domain services (7 files)
│       ├── usuario.service.js
│       ├── barbero.service.js
│       ├── cita.service.js
│       ├── servicio.service.js
│       ├── cliente.service.js
│       ├── hairstyle.service.js
│       └── servicio-barbero.service.js
├── application/               # Use cases/business logic
│   └── usecases/             # Service implementations (7 files)
│       ├── usuario.service.js
│       ├── barbero.service.js
│       ├── cita.service.js
│       └── ... (4 more)
├── interfaces/                # HTTP layer (Ports)
│   └── http/
│       ├── controllers/       # Request handlers (6 files)
│       │   ├── usuario.controller.js
│       │   ├── barbero.controller.js
│       │   ├── cita.controller.js
│       │   └── ... (3 more)
│       └── routes/            # Endpoint definitions (7 files)
│           ├── index.js       # Main router (aggregates all routes)
│           ├── usuario.routes.js
│           ├── barbero.routes.js
│           ├── cita.routes.js
│           └── ... (4 more)
└── infraestructure/           # External integrations (Adapters)
    ├── database/              # DB connection implementations
    ├── payment/               # Payment provider integrations
    └── storage/               # Image storage (Cloudinary, Azure)
```

### Folder Structure Conventions

- **Naming:** All folders use `lowercase-with-hyphens`
- **Files:** Use `camelCase.js` for JavaScript files
- **Models:** `entitiyName.model.js` (domain objects)
- **Repositories:** `entityName.repository.js` (database queries)
- **Services:** `entityName.service.js` (business logic)
- **Controllers:** `entityName.controller.js` (HTTP handlers)
- **Routes:** `entityName.routes.js` (endpoint definitions)

### Service Organization Pattern

Each domain layer follows this flow:

```
Controller → Service → Repository → Database
   (HTTP)  (Logic)   (Access)    (MSSQL)
```

**Example Flow (Usuario/User):**

1. **Controller** [usuario.controller.js](Producto/back-fadebooker/src/interfaces/http/controllers/usuario.controller.js)
   - Receives `POST /api/usuarios/register` with body `{ nombre, email, contrasena }`
   - Calls `UsuarioService.registrar(req.body)`
   - Returns `res.json(user)` or error

2. **Service** [usuario.service.js](Producto/back-fadebooker/src/application/usecases/usuario.service.js)
   - Business logic: hash password, validate email, etc.
   - Calls `UsuarioRepository.crear(userData)`
   - Returns normalized user object

3. **Repository** [usuario.repository.js](Producto/back-fadebooker/src/domain/repositories/usuario.repository.js)
   - Pure database queries using Knex.js
   - Example: `db('Usuario').insert(data)`
   - Handles SQL/ORM layer

### API Routes Structure

**Base URL:** `http://localhost:3000/api`

| Route Group | Base Path | Files |
|-------------|-----------|-------|
| Usuarios | `/api/usuarios` | [routes/usuario.routes.js](Producto/back-fadebooker/src/interfaces/http/routes/usuario.routes.js) |
| Citas | `/api/citas` | [routes/cita.routes.js](Producto/back-fadebooker/src/interfaces/http/routes/cita.routes.js) |
| Clientes | `/api/clientes` | [routes/cliente.routes.js](Producto/back-fadebooker/src/interfaces/http/routes/cliente.routes.js) |
| Barberos | `/api/barberos` | [routes/barbero.routes.js](Producto/back-fadebooker/src/interfaces/http/routes/barbero.routes.js) |
| Servicios | `/api/servicios` | [routes/servicio.routes.js](Producto/back-fadebooker/src/interfaces/http/routes/servicio.routes.js) |
| Peinados | `/api/hairstyle` | [routes/hairstyle.routes.js](Producto/back-fadebooker/src/interfaces/http/routes/hairstyle.routes.js) |

**Route Aggregation:** [routes/index.js](Producto/back-fadebooker/src/interfaces/http/routes/index.js) mounts all sub-routes onto the main Express router.

### Database Connection

- **Driver:** `tedious` (MSSQL native driver)
- **Query Builder:** Knex.js v3.2.9
- **Environment:** Uses `config.development` configuration
- **Connection Details:**
  ```javascript
  {
    server: process.env.DB_SERVER || 'fadebooker-server.database.windows.net',
    user: process.env.DB_USER || 'adminuser',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'FadeBooker_DB',
    options: { encrypt: true, trustServerCertificate: false, connectionTimeout: 30000 }
  }
  ```

---

## ⚛️ Frontend (React)

### Entry Point & Configuration

| File | Purpose |
|------|---------|
| [Producto/front-fadebooker/src/main.tsx](Producto/front-fadebooker/src/main.tsx) | React entry point - renders App to root element |
| [Producto/front-fadebooker/src/App.tsx](Producto/front-fadebooker/src/App.tsx) | Main app component - routing, providers setup |
| [Producto/front-fadebooker/vite.config.ts](Producto/front-fadebooker/vite.config.ts) | Vite build config, path aliases (`@` → `./src`) |
| [Producto/front-fadebooker/tsconfig.json](Producto/front-fadebooker/tsconfig.json) | TypeScript configuration |
| [Producto/front-fadebooker/.env.example](#environment-setup) | **Required env var**: `VITE_API_URL` |

### Folder Structure

```
src/
├── main.tsx                    # React root
├── App.tsx                     # Main component with routing
├── components/                 # Reusable UI components
│   └── ui/                    # Shadcn/Bootstrap UI primitives
├── features/                   # Feature modules (domain-driven)
│   └── auth/                  # Authentication feature
│       └── hooks/
│           └── useAuthContext.tsx    # Auth state management
├── lib/                        # Utilities & helpers
│   └── api.ts                 # Axios instance with interceptors
└── styles/
    └── globals.css            # Tailwind + global styles
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Build Tool** | Vite | 4.5.0 | Fast module bundler |
| **Framework** | React | 18.2.0 | UI library |
| **Styling** | Tailwind CSS | 5.3.2 (via Bootstrap) | Utility CSS framework |
| **UI Components** | Bootstrap + React-Bootstrap | 5.3.2 | Pre-built components |
| **Icon Library** | Lucide React | 0.290.0 | Consistent icons |
| **Routing** | React Router DOM | 6.18.0 | Client-side routing |
| **State Management** | Zustand + React Context | 4.4.0 | Global & local state |
| **API Client** | Axios | 1.6.0 | HTTP requests + auto JWT |
| **Data Fetching** | TanStack React Query | 5.0.0 | Server state management |
| **Forms** | React Hook Form | 7.48.0 | Form state & validation |
| **Validation** | Zod | 3.22.0 | Schema validation (TypeScript) |
| **Language** | TypeScript | 5.2.2 | Type safety |

### State Management & Architecture

#### 1. **Authentication (Context API)**

**Location:** [Producto/front-fadebooker/src/features/auth/hooks/useAuthContext.tsx](Producto/front-fadebooker/src/features/auth/hooks/useAuthContext.tsx)

```typescript
// Usage pattern:
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children })

// Context provides:
interface AuthContextType {
  user: User | null;           // Current user object
  token: string | null;        // JWT token
  login: (userData, token) => void;
  logout: () => void;
  isAuthenticated: boolean;    // !!token
}

// Hook usage in components:
const { user, logout, isAuthenticated } = useAuth();
```

- **Storage:** JWT token + user object in `localStorage`
- **Auto-loading:** On app start, restores user from localStorage
- **Wrapper:** Must wrap entire app in `<AuthProvider>`

#### 2. **HTTP Client with Auto-JWT**

**Location:** [Producto/front-fadebooker/src/lib/api.ts](Producto/front-fadebooker/src/lib/api.ts)

```typescript
// Axios instance with:
// ✅ Base URL: VITE_API_URL || 'http://localhost:3000/api'
// ✅ Auto-JWT: Adds Bearer token to all requests
// ✅ Auto-logout on 401: Clears token & redirects to /login

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

#### 3. **Server State (React Query)**

```typescript
// Automatic caching, refetching, background updates
import { useQuery, useMutation } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['citas'],
  queryFn: () => api.get('/citas')
});
```

#### 4. **Zustand (Optional for Complex Client State)**

Integrated into dependencies but not yet used in current implementation. Can be used for:
- Shopping cart state
- Sidebar toggle state
- Theme preferences

### Routing Pattern

**Location:** [Producto/front-fadebooker/src/App.tsx](Producto/front-fadebooker/src/App.tsx)

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route 
      path="/dashboard" 
      element={<PrivateRoute><Dashboard /></PrivateRoute>} 
    />
    <Route path="/" element={<Navigate to="/dashboard" />} />
  </Routes>
</BrowserRouter>
```

**Current Routes:**
- `/login` - Authentication page
- `/register` - User registration
- `/dashboard` - Protected home page (requires auth)
- `/` - Redirects to `/dashboard`

### Component Organization

- **Components:** Reusable UI building blocks
  - Location: `src/components/`
  - Naming: `PascalCase` folders/files
  - Example: `Button.tsx`, `Modal.tsx`

- **Features:** Domain-specific modules
  - Location: `src/features/`
  - Structure: `featureName/hooks/`, `featureName/components/`, `featureName/pages/`
  - Example: `auth/`, `citas/`, `barberos/`

- **Libs:** Utilities & shared helpers
  - Location: `src/lib/`
  - Example: `api.ts`, `utils.ts`, `validators.ts`

---

## 🗄️ Database

### Connection Details

| Property | Value |
|----------|-------|
| **Server** | `fadebooker-server.database.windows.net` (Azure SQL) |
| **Database** | `FadeBooker_DB` |
| **Authentication** | SQL Server (username/password) |
| **Motor** | SQL Server 2019+ (MSSQL) |
| **Schema Version** | 1.1.0 (3NF normalized) |

### Key Tables (10 Entities)

| Table | Purpose | Key Relations |
|-------|---------|---------------|
| **Usuario** | Auth & base user data | PK: idUsuario |
| **Tienda** | Barbershop locations | FK: idAdmin (Usuario) |
| **Barbero** | Service providers | FK: idTienda (Tienda) |
| **Servicio** | Service catalog | Base prices & durations |
| **ServicioBarbero** | **M2M mapping** (v1.1.0) | FK: idBarbero, idServicio |
| **Cita** | Appointment bookings | FK: idCliente, idBarbero, idServicio, idTienda |
| **Pago** | Payment transactions | FK: idCita (1:1) |
| **Reseña** | Ratings & reviews | FK: idCita, idCliente, idBarbero |
| **AuditoriaSeguridad** | Security audit logs | Tracks logins & sensitive actions |
| (Additional) | Unused/Legacy | May be removed in future |

### Critical Design: ServicioBarbero (v1.1.0)

**What:** Replaces `ServicioTienda` with per-barbero service availability

**Why:** Prevents scheduling services a specific barbero cannot perform

**Structure:**
```sql
ServicioBarbero {
  idServicioBarbero (PK),
  idBarbero (FK),
  idServicio (FK),
  precio_barbero (override base price),
  tiempo_servicio_minutos (override base duration),
  disponible (boolean)
}
```

### Scripts & Initialization

| File | Purpose |
|------|---------|
| [Documentación/Documentos/FadeBooker_ScriptBD.sql](Documentación/Documentos/FadeBooker_ScriptBD.sql) | **Full schema creation** - Tables, indexes, triggers, stored procedures |
| [Documentación/Documentos/FadeBooker_DatosTest.sql](Documentación/Documentos/FadeBooker_DatosTest.sql) | **50+ test records** - Sample users, barbershops, appointments |

### Indexing & Optimization

**13+ indexes implemented:**
- `IX_Cita_FechaHora` - Appointment time lookups
- `IX_ServicioBarbero_Disponible` - Service availability filtering
- `IX_Usuario_Email` - User login queries
- (+ 10 more for common query patterns)

### Security Features

- **Audit Table:** `AuditoriaSeguridad` logs all sensitive operations
- **Triggers:** T-SQL triggers validate appointment scheduling & update ratings
- **Normalization:** 3NF eliminates data redundancy & anomalies

### Migration Approach

Currently **no formal migration system** (no Knex migrations folder yet). 
- All schema changes are manual SQL scripts
- Database is version-controlled via git docs
- Plan: Implement Knex migrations in future phases

---

## 🧪 Testing Setup

### Test Framework & Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Jest** | 29.7.0 | Test runner & assertion library |
| **Supertest** | 6.3.3 | HTTP testing for Express routes |

### Test Configuration

**File:** [Producto/back-fadebooker/jest.config.js](Producto/back-fadebooker/jest.config.js)

```javascript
{
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: { lines: 5, statements: 5 }  // Minimum 5% coverage
}
```

### Test Structure

```
tests/
├── setup.js                    # Global setup (timeouts, env vars, cleanup)
├── unit/                       # Unit tests (5 files)
│   ├── barbero.model.test.js
│   ├── usuario.model.test.js
│   ├── resena.model.test.js
│   ├── barberoRepository.test.js
│   └── servicioBarberoRepository.test.js
└── integration/                # E2E & route tests (7 files)
    ├── app.test.js             # Main app & middleware
    ├── usuario.routes.test.js
    ├── barbero.routes.test.js
    ├── cita.routes.test.js
    ├── cliente.routes.test.js
    ├── servicio.routes.test.js
    └── serviciobarbero.routes.test.js
```

### Test Conventions

- **Naming:** `entityName.test.js` or `entityName.spec.js`
- **Organization:** Unit tests for models/repos, integration tests for routes
- **Pattern:** Supertest for HTTP testing
  ```javascript
  const request = require('supertest');
  const app = require('../src/app');
  
  describe('POST /api/usuarios/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/usuarios/register')
        .send({ nombre: 'John', email: 'john@example.com', contrasena: '123456' });
      expect(response.status).toBe(200);
    });
  });
  ```

### Coverage Goals

- **Current Threshold:** 5% (development phase)
- **Target (Production):** 70%+ coverage
- **Focus Areas:** Services, repositories, critical controllers

---

## 🚀 Build & Run Commands

### Backend (Node.js)

**Package.json Location:** [Producto/back-fadebooker/package.json](Producto/back-fadebooker/package.json)

| Command | Purpose |
|---------|---------|
| `npm start` | Start production server (`node index.js`) |
| `npm run dev` | (Not defined) Start with nodemon or debug mode |
| `npm test` | Run all tests with coverage report |
| `npm run test:watch` | Run tests in watch mode (re-run on file changes) |
| `npm run test:unit` | Run only unit tests |
| `npm run test:integration` | Run only integration tests |

**Starting the backend:**
```bash
cd Producto/back-fadebooker
npm install
npm start
# Server runs on http://localhost:3000
```

### Frontend (React)

**Package.json Location:** [Producto/front-fadebooker/package.json](Producto/front-fadebooker/package.json)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Vite hot reload on `http://localhost:5173`) |
| `npm run build` | Build for production (`dist/` folder) |
| `npm run lint` | Check TypeScript & ESLint rules |
| `npm run preview` | Preview production build locally |

**Starting the frontend:**
```bash
cd Producto/front-fadebooker
npm install
npm run dev
# Dev server runs on http://localhost:5173
```

### Docker Setup

**File:** [Producto/back-fadebooker/src/docker-compose.yml](Producto/back-fadebooker/src/docker-compose.yml)

```yaml
version: '3.8'
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: fadebooker_db
    environment:
      ACCEPT_EULA: Y
      SA_PASSWORD: YourStrong@Pass123
    ports:
      - "1433:1433"
    volumes:
      - sql_data:/var/opt/mssql
```

**Start local SQL Server for development:**
```bash
docker-compose -f Producto/back-fadebooker/src/docker-compose.yml up -d
# Database available at localhost:1433 with SA account
```

---

## ⚙️ Environment Setup

### Backend (.env)

**File location:** `Producto/back-fadebooker/.env` (create manually)

```env
# Database
DB_SERVER=fadebooker-server.database.windows.net
DB_USER=adminuser
DB_PASSWORD=your_secure_password
DB_NAME=FadeBooker_DB

# Server
PORT=3000
NODE_ENV=development

# Cloudinary (Image Storage)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env.local)

**File location:** `Producto/front-fadebooker/.env.local` (create manually)

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=FadeBooker
```

---

## 🔑 Key Conventions Summary

### Backend
- **Architecture:** Hexagonal (Ports & Adapters via DDD)
- **Language:** JavaScript (Node.js 18+)
- **ORM:** Knex.js for SQL Server
- **API Style:** RESTful JSON
- **Security:** JWT tokens + Bcrypt passwords + RBAC roles

### Frontend
- **Language:** TypeScript (React 18)
- **Build:** Vite (fast bundler)
- **Styling:** Tailwind CSS + Bootstrap components
- **State:** React Context (auth) + React Query (server state) + Zustand (optional)
- **Routing:** React Router v6 with protected routes

### Database
- **Motor:** Azure SQL Server (3NF normalized)
- **Queries:** Knex.js query builder (no raw SQL in app code)
- **Migrations:** Manual SQL scripts (future: Knex migrations)
- **Auditing:** Built-in audit table + triggers

### Testing
- **Framework:** Jest + Supertest
- **Structure:** Unit tests + integration tests
- **Coverage:** Minimum 5% (target 70%+)
- **CI/CD:** Not yet configured

---

## 📚 Key Documentation Files

| Document | Location | Purpose |
|----------|----------|---------|
| **Project README** | [README.md](README.md) | High-level project overview |
| **Database Spec** | [Documentación/md-fuente/DATABASE_CONSOLIDADO.md](Documentación/md-fuente/DATABASE_CONSOLIDADO.md) | Complete database schema & design |
| **Backend Guide** | [Documentación/md-fuente/BACKEND_CONSOLIDADO.md](Documentación/md-fuente/BACKEND_CONSOLIDADO.md) | Backend architecture details |
| **Frontend Guide** | [Documentación/md-fuente/FRONTEND_CONSOLIDADO.md](Documentación/md-fuente/FRONTEND_CONSOLIDADO.md) | React integration & components |
| **OpenAPI Spec** | [Producto/back-fadebooker/openapi.yaml](Producto/back-fadebooker/openapi.yaml) | API endpoint documentation |
| **Agent Instructions** | [.github/copilot-instructions.md](.github/copilot-instructions.md) | Copilot agent coordination |

---

## 🎯 Next Steps for Agents

1. **Backend Agent:** Review [usuario.service.js](Producto/back-fadebooker/src/application/usecases/usuario.service.js) for JWT implementation
2. **Frontend Agent:** Expand [useAuthContext.tsx](Producto/front-fadebooker/src/features/auth/hooks/useAuthContext.tsx) with token validation logic
3. **Database Agent:** Review [FadeBooker_ScriptBD.sql](Documentación/Documentos/FadeBooker_ScriptBD.sql) for trigger implementations
4. **Testing Agent:** Create unit test templates for services & repositories
5. **DevOps Agent:** Set up Docker build configs & CI/CD pipelines

---

**Document Version:** 1.0  
**Created:** April 28, 2026  
**Status:** Ready for agent reference
