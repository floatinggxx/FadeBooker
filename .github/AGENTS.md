# 🤖 AGENTS.md - Registro Central de Agentes FadeBooker

**Última actualización:** 28 de abril de 2026  
**Versión:** 1.2.0  
**Estado:** Fase Implementación - Seguridad y Frontend iniciando

---

## 📋 Descripción General

Este archivo es la **fuente única de verdad** para el registro y estado de los agentes en el ecosistema FadeBooker. Para guías de implementación detalladas, consulte los archivos individuales en [`.github/agents/`](.github/agents/).

Para entender la estructura completa del proyecto, ver: [CODEBASE_STRUCTURE.md](../CODEBASE_STRUCTURE.md)

---

## 🎯 Registro de Agentes

| Agente | Propósito Principal | Estado | Instrucciones |
| :--- | :--- | :--- | :--- |
| **Database Agent** | Gestión de esquema SQL Server y migraciones | ✅ Activo | [Instrucciones](agents/database-agent.md) |
| **Backend Agent** | Desarrollo de API Node.js y lógica de negocio | ✅ Activo | [Instrucciones](agents/backend-agent.md) |
| **Frontend Agent** | Migración Power Pages a React y UX/UI | 🆕 Iniciando | [Instrucciones](agents/frontend-agent.md) |
| **Documentation Agent** | Creación de manuales, READMEs y docs de API | ✅ Activo | [Instrucciones](agents/documentation-agent.md) |
| **Diagram Agent** | Visualización de arquitectura y flujos (draw.io) | ✅ Activo | [Instrucciones](agents/diagram-agent.md) |
| **Security Agent** | Auditoría de código y estándares de seguridad | 🆕 Iniciando | [Instrucciones](agents/security-agent.md) |
| **Orchestrator Agent** | Coordinación de flujos multi-agente complejos | ✅ Activo | [Instrucciones](agents/orchestrator-agent.md) |

---

## 🚀 Estado Actual del Proyecto

| Componente | Estado | Completado | Detalles |
|:-----------|:------:|:----------:|----------|
| **Database** 🗄️ | ✅ Complete | **100%** | 36 objetos BD, 51 registros test, triggers validados |
| **Backend** 🔧 | ✅ Complete | **92%** | APIs CRUD funcionales, falta: E2E tests, CI/CD |
| **Documentation** 📋 | ✅ Complete | **100%** | APIs, procesos, arquitectura documentados |
| **Diagram** 📐 | ✅ Complete | **100%** | ER, arquitectura, flujos en draw.io |
| **Security** 🔐 | 🆕 Starting | **0%** | Auditoría pendiente, estándares JWT/CORS a definir |
| **Frontend** 🎨 | 🆕 Starting | **0%** | Migración Power Pages → React |
| **Orchestrator** 🎛️ | ✅ Active | — | Coordinación en progreso |

**Progreso total:** ~50% (Core backend listo, frontend y seguridad iniciando)

---

## 🛠️ Responsabilidades Principales de Cada Agente

### 1️⃣ **Database Agent** 🗄️
**Status:** ✅ **COMPLETADO**

**Logros:**
- ✅ 10 tablas creadas: Usuario, Tienda, Barbero, Servicio, ServicioBarbero, Cita, Pago, Reseña, AuditoriaSeguridad, etc.
- ✅ 13 índices optimizados para búsquedas frecuentes
- ✅ 3 vistas para consultas complejas
- ✅ 3 funciones SQL (cálculo de ratings, disponibilidad)
- ✅ 3 stored procedures (reportes)
- ✅ 4 triggers para auditoría y validaciones
- ✅ 51 registros de test poblados y validados

**Responsabilidades:**
- Define y mantiene el esquema de BD
- Crea migraciones versionadas
- Optimiza con índices y constraints
- Documenta el diseño 3NF

**Stack:** Azure SQL Server, Knex.js (ORM)  
**Conexión:** `fadebooker-server.database.windows.net / FadeBooker_DB`  
**Scripts:** [`FadeBooker_ScriptBD.sql`](../Documentación/Documentos/FadeBooker_ScriptBD.sql) (EJECUTADO Y VALIDADO)

**Instrucciones completas:** [`.github/agents/database-agent.md`](agents/database-agent.md)

---

### 2️⃣ **Backend Agent** 🔧
**Status:** ✅ **COMPLETADO (92%)**

**Logros:**
- ✅ Estructura hexagonal (domain, application, infrastructure, interfaces)
- ✅ Controllers y routes para CRUD base
- ✅ Services con lógica de negocio
- ✅ DTOs y validaciones con Zod
- ✅ Manejo de errores centralizado
- ✅ Logging y auditoría
- ✅ JWT autenticación integrada
- ✅ Tests unitarios e integración

**Por completar:**
- E2E tests (30% del código)
- CI/CD pipeline
- Documentación de deployment

**Responsabilidades:**
- Implementa endpoints REST basado en Historia Usuario
- Crea servicios con lógica de negocio
- Validaciones de input y seguridad
- Integración con BD y externos (pagos, etc.)

**Stack:** Express.js 5.2.1, Knex.js 3.2.9, tedious 19.2.1, Jest, Supertest  
**Ubicación:** [`Producto/back-fadebooker/`](../Producto/back-fadebooker/)  
**Puerto:** 3000

**Instrucciones completas:** [`.github/agents/backend-agent.md`](agents/backend-agent.md)

---

### 3️⃣ **Frontend Agent** 🎨
**Status:** 🆕 **INICIANDO**

**Responsabilidades:**
- Migrar de Power Pages a React
- Diseñar componentes reutilizables
- Implementar routing y autenticación
- Crear sistema de diseño con Tailwind CSS
- Integrar con APIs del backend
- UX/UI para flujos de barbería

**Stack:** React 18, TypeScript, Vite, Tailwind CSS, React Router v6, React Query, Axios  
**Ubicación:** [`Producto/front-fadebooker/`](../Producto/front-fadebooker/)  
**Puerto:** 5173

**Legacy (Power Pages):** [`Producto/pages-fadebooker/`](../Producto/pages-fadebooker/)

**Instrucciones completas:** [`.github/agents/frontend-agent.md`](agents/frontend-agent.md)

**Ejemplo de uso:**
```
@frontend-agent: Migra la página de búsqueda de barberos de Power Pages a React.
Crea componentes: BarberList, BarberCard, SearchFilters, BarberDetail.
Implementa navegación y carrito de servicios.
```

---

### 4️⃣ **Documentation Agent** 📋
**Status:** ✅ **COMPLETADO**

**Logros:**
- ✅ README.md con overview del proyecto
- ✅ GETTING_STARTED.md con instrucciones de setup
- ✅ API_DOCUMENTATION.md con todos los endpoints
- ✅ BACKEND_CONSOLIDADO.md
- ✅ DATABASE_CONSOLIDADO.md
- ✅ CODEBASE_STRUCTURE.md con rutas y convenciones

**Responsabilidades:**
- Documenta APIs generadas por Backend Agent
- Crea manuales de usuario y guías de instalación
- Mantiene especificaciones del producto
- Documenta procesos (testing, deployment, contribución)
- Mantiene CHANGELOG y versionado

**Ubicación:** [`Documentación/md-fuente/`](../Documentación/md-fuente/)

**Instrucciones completas:** [`.github/agents/documentation-agent.md`](agents/documentation-agent.md)

---

### 5️⃣ **Diagram Agent** 📐
**Status:** ✅ **COMPLETADO**

**Logros:**
- ✅ Diagrama ER convertido a draw.io
- ✅ Diagrama de arquitectura
- ✅ Flujos de procesos principales

**Responsabilidades:**
- Convierte documentos visuales (PDFs, imágenes) a draw.io editable
- Mantiene diagramas actualizados con cambios
- Crea nuevos diagramas (flujos, componentes, secuencias)
- Exporta diagramas a PNG/SVG para documentación

**Ubicación:** [`Documentación/Material complementario/`](../Documentación/Material%20complementario/)

**Instrucciones completas:** [`.github/agents/diagram-agent.md`](agents/diagram-agent.md)

---

### 6️⃣ **Security Agent** 🔐
**Status:** 🆕 **INICIANDO**

**Responsabilidades:**
- Auditoría de código (Backend y Frontend)
- Validación de OWASP Top 10
- Definición de estándares JWT y CORS
- Revisión de dependencias (CVE check)
- Threat modeling y hardening
- Recomendaciones de remediación

**Stack:** OWASP standards, JWT, bcrypt, input validation, rate limiting

**Instrucciones completas:** [`.github/agents/security-agent.md`](agents/security-agent.md)

**Ejemplo de uso:**
```
@security-agent: Audita el backend para vulnerabilidades OWASP Top 10.
Revisa autenticación (JWT), validaciones de input, manejo de datos sensibles.
Genera reporte con recomendaciones.
```

---

### 7️⃣ **Orchestrator Agent** 🎛️
**Status:** ✅ **ACTIVO**

**Responsabilidades:**
- Coordina flujos multi-agente
- Valida coherencia entre dominios (BD ↔ Backend ↔ Docs ↔ Diagramas)
- Reporta estado del proyecto
- Resuelve inconsistencias
- Planifica sprints y fases

**Flujo Coordinado Estándar:**
```
1. Database Agent → Define tablas necesarias
2. Backend Agent → Implementa servicios y endpoints
3. Documentation Agent → Documenta APIs
4. Diagram Agent → Actualiza diagramas
5. Security Agent → Audita
6. Orchestrator Agent → Valida coherencia total
```

**Instrucciones completas:** [`.github/agents/orchestrator-agent.md`](agents/orchestrator-agent.md)

**Ejemplo de uso:**
```
@orchestrator-agent: Implementa Historia Usuario "Crear Sesión Fotográfica".
Coordina DB → Backend → Docs → Diagrams → Security.
Reporta cuando esté completo.
```

---

## 📞 Coordinación Entre Agentes

```mermaid
graph LR
    DA[Database Agent] -->|Esquema creado| BA[Backend Agent]
    BA -->|Endpoints implementados| DOC[Documentation Agent]
    BA -->|Código generado| SEC[Security Agent]
    DOC -->|APIs documentadas| DIA[Diagram Agent]
    SEC -->|Estándares definidos| BA
    BA -->|Cambios en API| DIA
    DA -->|Cambios en BD| DIA
    DIA -->|Diagramas actualizados| DOC
    BA -->|Completado| ORC[Orchestrator Agent]
    DOC -->|Completado| ORC
    SEC -->|Completado| ORC
    DIA -->|Completado| ORC
    ORC -->|Valida coherencia| BA
    ORC -->|Reporta estado| DEV["👨‍💻 Developer"]
```

---

## 🔗 Referencias Útiles

- **Instrucciones Globales:** [`copilot-instructions.md`](copilot-instructions.md)
- **Codebase Structure:** [`CODEBASE_STRUCTURE.md`](../CODEBASE_STRUCTURE.md)
- **Documentación Proyecto:** [`Documentación/`](../Documentación/)
- **Backend:** [`Producto/back-fadebooker/`](../Producto/back-fadebooker/)
- **Frontend:** [`Producto/front-fadebooker/`](../Producto/front-fadebooker/)
- **Conexión BD:** `fadebooker-server.database.windows.net / FadeBooker_DB`
- **Repositorio Local:** `c:\Users\SanNi\OneDrive\Escritorio\Barberia\FadeBooker`

---

## 🚀 Cómo Usar Este Archivo

### Para invocar un agente:
```markdown
@nombre-agent: [descripción de tarea]
```

### Ejemplos completos:
```markdown
@database-agent: Crear tabla ServicioFoto con campos id_sesion, id_fotografo, fecha_sesion, duracion_minutos

@backend-agent: Generar CRUD para SessionFoto en /api/sessions endpoint con validaciones

@frontend-agent: Crear página de sesiones con filtros por fecha y estado

@documentation-agent: Documentar endpoints de sesiones en API_DOCUMENTATION.md

@diagram-agent: Actualizar ER con tabla ServicioFoto y crear flujo "Crear Sesión"

@security-agent: Auditar endpoints de sesiones para validación de permisos

@orchestrator-agent: Coordina implementación completa de "Crear Sesión Fotográfica"
```

---

## ✅ Checklist para Completar Feature

- [ ] Database Agent: Tablas/migraciones creadas
- [ ] Backend Agent: Endpoints CRUD implementados
- [ ] Backend Agent: Validaciones y error handling
- [ ] Security Agent: Auditoría pasada
- [ ] Documentation Agent: APIs documentadas
- [ ] Diagram Agent: Diagramas actualizados
- [ ] Orchestrator Agent: Coherencia validada
- [ ] Git: Cambios commiteados

---

**Para más detalles sobre arquitectura y convenciones:** Ver [`copilot-instructions.md`](copilot-instructions.md)
