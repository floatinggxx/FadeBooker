# 🎭 FadeBooker - Instrucciones Globales para Copilot Agents

**Versión:** 1.2.0  
**Última actualización:** 28 de abril de 2026  
**Estado:** Fase Implementación (Consolidación de esquema, backend y seguridad)

## 📌 Visión General del Proyecto

**FadeBooker** es una plataforma de gestión de citas para servicios de barbería y fotografía relacional.

- **Stack:** Node.js (Backend), React (Frontend), Azure SQL Server (BD).
- **BD:** `fadebooker-server.database.windows.net` / `FadeBooker_DB`
- **Repositorio Local:** `c:\Users\SanNi\OneDrive\Escritorio\Barberia\FadeBooker`
- **Estado:** Backend 92% completo, Frontend iniciando, Security audit pendiente

---

## 🤖 Coordinación de Agentes

**IMPORTANTE:** Para invocaciones de agentes, ver [`.github/AGENTS.md`](.github/AGENTS.md) - la **fuente única de verdad** para registro y estado de agentes.

**Estructura:**
- `.github/AGENTS.md` - Registry central con status actual
- `.github/agents/*.md` - Instrucciones detalladas por agente
- `.github/README.md` - Arquitectura del sistema de agentes

**Agents disponibles:**
```
@database-agent      # SQL Server y migraciones
@backend-agent       # APIs Node.js y lógica de negocio
@frontend-agent      # React y UX/UI
@documentation-agent # READMEs y API docs
@diagram-agent       # Visualización draw.io
@security-agent      # Auditoría y estándares
@orchestrator-agent  # Coordinación multi-agente
```

---

## 🎯 Convenciones Globales

### Nomenclatura
- **Carpetas:** `lowercase-with-hyphens` (ej: `src/application/usecases/`)
- **Archivos SQL:** `PascalCase.sql` (ej: `Users_Migration_001.sql`)
- **Archivos código:** `camelCase.ts` (ej: `getUserById.ts`)
- **Archivos config:** `snake_case.json` (ej: `database_config.json`)
- **Tablas BD:** `PascalCase` plural (ej: `Usuarios`, `Barberos`)
- **Columnas BD:** `camelCase` (ej: `id_usuario`, `nombreBarbero`)
- **Variables código:** `camelCase` (ej: `userCount`)
- **Constantes código:** `UPPER_SNAKE_CASE` (ej: `MAX_LOGIN_ATTEMPTS`)

### Directorios Clave
```
Producto/
├── back-fadebooker/          # Backend (Entry: src/index.js, Puerto 3000)
│   ├── src/
│   │   ├── domain/           # Entities & repositories
│   │   ├── application/      # UseCases & services
│   │   ├── infrastructure/   # DB, adapters
│   │   └── interfaces/       # Controllers & routes
│   └── tests/
│
├── front-fadebooker/         # Frontend React (Vite, Puerto 5173)
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── lib/
│   │   └── styles/
│   └── package.json
│
└── pages-fadebooker/         # Legacy Power Pages (deprecado)

Documentación/
├── Documentos/               # Fuentes: SQL scripts, diseño
└── md-fuente/                # Documentación en Markdown
```

### Git & Flujo Trabajo
- **Branches:** `main` (prod), `develop` (int), `feature/*` (features)
- **Commits:** Imperativos, claros (ej: "Add JWT authentication", "Fix user validation")
- **Versionado:** SemVer `MAJOR.MINOR.PATCH`
- **Integración:** Cambios documentados en `CHANGELOG.md`

### Stack Technology

**Backend:**
- Framework: Express.js 5.2.1
- Query Builder: Knex.js 3.2.9
- Driver: tedious 19.2.1 (MSSQL)
- Auth: JWT (jsonwebtoken)
- Validation: Zod
- Testing: Jest + Supertest
- Architecture: Hexagonal (Clean)

**Frontend:**
- Framework: React 18
- Build: Vite
- Language: TypeScript
- Styling: Tailwind CSS
- HTTP: Axios
- Router: React Router v6
- State: Context API + React Query
- Testing: Vitest

**Database:**
- Server: Azure SQL Server
- Design: 3NF Relational
- Tables: 10 core entities
- Indexes: 13 optimizados
- Procedures/Triggers: 4 triggers para auditoría

---

## 🛡️ Principios de Desarrollo

✅ **DRY (Don't Repeat Yourself)**
- No duplicar lógica entre backend y documentación
- Usar servicios/utilities compartidas

✅ **Single Responsibility**
- Cada agente tiene un único propósito
- Cada módulo de código es independiente y testeable

✅ **Infrastructure as Code**
- Toda modificación de BD vía scripts SQL versionados
- Migraciones ejecutables y reversibles

✅ **Documentation First**
- Documentar APIs antes de implementación extensiva
- Mantener docs sincronizadas con código

✅ **Security by Design**
- Validación de inputs en todas las capas
- Autenticación y autorización obligatorias
- Auditoría de cambios sensibles

---

## 📞 Canales de Comunicación

### Entre Agentes
- **Source of Truth:** [`.github/AGENTS.md`](.github/AGENTS.md)
- **Instrucciones:** [`.github/agents/`](./agents/)
- **Codebase Structure:** [`CODEBASE_STRUCTURE.md`](../CODEBASE_STRUCTURE.md)

### Con Desarrolladores
- **Issues:** GitHub Issues para features/bugs
- **Documentation:** Markdown en `Documentación/md-fuente/`
- **Comments:** Código comentado en lugares críticos

---

## 🚀 Próximos Pasos Prioritarios

1. **✅ Schema & Backend:** Completado y validado (92%)
2. **✅ Cloud Deployment:** Backend desplegado en Azure Functions/App Service (Node 24 + Docker)
3. **Frontend Migration:** Power Pages → React (iniciando)
4. **Security Audit:** OWASP + JWT standards (iniciando)
5. **E2E Testing & CI/CD:** Falta backend completo
6. **Production Deployment:** Azure + monitoring

## 🌐 Endpoints de Verificación
- **Health Check:** `/api/health` (Útil para validar despliegue en Azure)
- **Base API:** `/api`
- **Auth:** `/api/usuarios/login`, `/api/usuarios/register`

---

## ⚡ Consejos de Productividad Inmediata

1. **Backend routing:** Todas las rutas agregadas en `src/interfaces/http/routes/index.js`
2. **Configuración BD:** Verificar `src/config/knexfile.js` (requiere variable DB_PASSWORD)
3. **Estado frontend:** React Query (estado servidor) + Zustand (estado cliente)
4. **Autenticación frontend:** Hook `useAuthContext` provee user, login, logout, isAuthenticated
5. **Tests ejecutan:** `npm test` incluye reporte de cobertura
6. **Conflictos de puerto:** Asegurar puertos 3000 (backend) y 5173 (frontend) libres

---

## 🚨 Posibles Problemas Comunes

- ⚠️ Variable `DB_PASSWORD` faltante = falla de conexión silenciosa
- ⚠️ Lógica de precios ServicioBarbero v1.1.0 requiere verificar overrides
- ⚠️ Modo estricto TypeScript + ESLint estricto (TODAS las advertencias = errores)
- ⚠️ Timeout de tests en 5000ms (incrementar para tests pesados de BD)
- ⚠️ CORS no configurado (agregar middleware si frontend desplegado separado)
- ⚠️ Solo clases Bootstrap 5 (no utilidades Tailwind)

---

## 📚 Documentación Relacionada

- **Estado Agentes:** [`.github/AGENTS.md`](.github/AGENTS.md)
- **Arquitectura Agentes:** [`.github/README.md`](.github/README.md)
- **Codebase Structure:** [`CODEBASE_STRUCTURE.md`](../CODEBASE_STRUCTURE.md)
- **BD Design:** [`Documentación/Documentos/BD_Diseño_3NF.txt`](../Documentación/Documentos/BD_Diseño_3NF.txt)
- **Scripts BD:** [`Documentación/Documentos/FadeBooter_ScriptBD.sql`](../Documentación/Documentos/FadeBooker_ScriptBD.sql)

---

## 🔧 Primeros Pasos para Agentes Nuevos

### Database Agent
1. Lee [`.github/agents/database-agent.md`](./agents/database-agent.md)
2. Consulta [`BD_Diseño_3NF.txt`](../Documentación/Documentos/BD_Diseño_3NF.txt)
3. Ejecuta [`FadeBooter_ScriptBD.sql`](../Documentación/Documentos/FadeBooker_ScriptBD.sql) en Azure SQL

### Backend Agent
1. Lee [`.github/agents/backend-agent.md`](./agents/backend-agent.md)
2. Navega a `Producto/back-fadebooker/`
3. `npm install && npm start` (Puerto 3000)
4. Ver endpoints en `src/interfaces/http/routes/`

### Frontend Agent
1. Lee [`.github/agents/frontend-agent.md`](./agents/frontend-agent.md)
2. Navega a `Producto/front-fadebooker/`
3. `npm install && npm run dev` (Puerto 5173)
4. Consulta componentes existentes en `src/components/`

### Security Agent
1. Lee [`.github/agents/security-agent.md`](./agents/security-agent.md)
2. Revisa endpoints backend en `Producto/back-fadebooker/src/`
3. Audita autenticación JWT y validaciones

### Documentation Agent
1. Lee [`.github/agents/documentation-agent.md`](./agents/documentation-agent.md)
2. Consulta archivos en `Documentación/md-fuente/`
3. Sincroniza con cambios de código y BD

---

**Para detalles de coordinación multi-agente:** Ver [`.github/AGENTS.md`](.github/AGENTS.md)
