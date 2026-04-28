# 🤖 AGENTS.md - Registro Central de Agentes FadeBooker

**Última actualización:** 28 de abril de 2026  
**Versión:** 1.1.0  
**Estado:** Fase Implementación

---

## 📋 Descripción General

Este archivo es la **fuente única de verdad** para el registro y estado de los agentes en el ecosistema FadeBooker. Para guías de implementación detalladas, consulte los archivos individuales en `.github/agents/`.

---

## 🎯 Registro de Agentes

| Agente | Propósito Principal | Estado | Instrucciones |
| :--- | :--- | :--- | :--- |
| **Database Agent** | Gestión de esquema SQL Server y migraciones. | ✅ Activo | [Instrucciones](agents/database-agent.md) |
| **Backend Agent** | Desarrollo de API Node.js y lógica de negocio. | ✅ Activo | [Instrucciones](agents/backend-agent.md) |
| **Documentation Agent** | Creación de manuales, READMEs y docs de API. | ✅ Activo | [Instrucciones](agents/documentation-agent.md) |
| **Diagram Agent** | Visualización de arquitectura y flujos (draw.io). | ✅ Activo | [Instrucciones](agents/diagram-agent.md) |
| **Orchestrator Agent** | Coordinación de flujos multi-agente complejos. | ✅ Activo | [Instrucciones](agents/orchestrator-agent.md) |
| **Security Agent** | Auditoría de código y estándares de seguridad. | ✅ Activo | [Instrucciones](agents/security-agent.md) |

---

## 🚀 Estado del Proyecto

- **Fase Actual:** Implementación de Base de Datos y Estructura Backend.
- **Próximo Hito:** Generación de CRUDs base para usuarios y entidades principales.

---

## 🛠️ Responsabilidades de Alto Nivel

Los agentes operan bajo el principio de **Single Responsibility**. Mientras que `copilot-instructions.md` define el "Cómo" (estándares), `AGENTS.md` define el "Quién" y "Qué".

- **Database:** El guardián del esquema. Único autorizado para modificar scripts SQL en `/database`.
- **Backend:** El constructor de servicios. Transforma el esquema en endpoints funcionales en `/backend`.
- **Security:** El auditor. Revisa cada PR y cambio sugerido para garantizar la integridad de los datos.
- **Documentation:** El cronista. Asegura que cada cambio técnico sea reflejado en la documentación del usuario y técnica.
- **Diagram:** El arquitecto visual. Mantiene la representación gráfica del sistema sincronizada.
- **Orchestrator:** El director. Asegura que las piezas encajen perfectamente en tareas complejas.

- Recomendaciones de remediación con código de ejemplo
- Checklists de seguridad por funcionalidad
- Estándares de autenticación y CORS para el proyecto

**Instrucciones:** [`.github/agents/security-agent.md`](.github/agents/security-agent.md)

**Ejemplo de uso:**
```
@security-agent: Audita el backend buscando vulnerabilidades OWASP Top 10.
Revisa autenticación, validaciones de input y manejo de datos sensibles.
```

---

### 7️⃣ **Frontend Agent** 🎨
**Propósito:** Diseñar e implementar el frontend React de FadeBooker con foco en UX/UI

**Responsabilidades:**
- Arquitectura del proyecto React (Vite + TypeScript + Tailwind)
- Componentes reutilizables y sistema de diseño
- Integración con APIs del backend
- Flujos de usuario y UX para la plataforma de barbería
- Routing, manejo de estado, formularios y accesibilidad
- Migración de Power Pages → React

**Inputs:**
- APIs documentadas del backend
- Requerimientos e Historias de Usuario (`Documentación/Documentos/`)
- Diseños o wireframes existentes
- Power Pages actual (`Producto/pages-fadebooker/`)

**Outputs:**
- Proyecto React en `Producto/front-fadebooker/`
- Componentes UI, páginas y hooks
- Sistema de diseño (tokens, paleta, tipografía)
- Configuración de integración con backend

**Instrucciones:** [`.github/agents/frontend-agent.md`](.github/agents/frontend-agent.md)

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + React Query

**Ejemplo de uso:**
```
@frontend-agent: Crea la estructura base del proyecto React con Vite + TypeScript + Tailwind.
Implementa la página de lista de barberos con filtros y BarberoCard components.
```

---

## 📞 Coordinación Entre Agentes

### Database Agent → Backend Agent
- Database Agent crea esquema → Backend Agent usa esquema para generar modelos

### Backend Agent → Documentation Agent
- Backend Agent genera código → Documentation Agent documenta APIs

### Any Agent → Diagram Agent
- Cualquier cambio → Diagram Agent actualiza diagramas correspondientes

### Security Agent → Backend Agent / Frontend Agent
- Security Agent define estándares de auth y CORS → Backend y Frontend los implementan
- Security Agent audita código antes de hacer merge a producción

### Frontend Agent → Backend Agent
- Frontend Agent consulta endpoints disponibles → Backend Agent los implementa/ajusta
- Frontend Agent coordina con Security Agent antes de implementar auth

### Orchestrator Agent
- Coordina todo el flujo anterior

---

## 🚀 Cómo Usar Este Archivo

### Para invocar un agente:
```markdown
@nombre-agent: [descripción de tarea]
```

### Ejemplos:
```
@database-agent: Crear tabla de Users con campos id, email, nombre, createdAt
@backend-agent: Generar CRUD para Users en /users endpoint
@documentation-agent: Documentar endpoints de Users en README
@diagram-agent: Crear diagrama de flujo de autenticación
```

### Para comunicar cambios entre agentes:
- Actualizar este archivo (AGENTS.md)
- Especificar el estado del agente
- Documentar qué cambios afectarán a otros agentes

---

## 📊 Estado del Proyecto

| Agente | Estado | Completado | Próximos Pasos |
|--------|--------|-----------|-----------------|
| **Database Agent** 🗄️ | ✅ **COMPLETADO** | **100%** | ✅ 36 objetos BD creados, 51 registros test poblados, triggers validados |
| **Backend Agent** 🔧 | ✅ **COMPLETADO** | **92%** | Deploy/CI-CD, E2E testing, monitoreo |
| Documentation Agent 📋 | ✅ Listo | 100% | Documentación base completa |
| Diagram Agent 📐 | ✅ Listo | 100% | ER en draw.io disponible |
| Orchestrator Agent 🎛️ | ✅ Activo | — | Coordinación general del proyecto |
| **Security Agent** 🔐 | ✅ **NUEVO** | 0% | Auditar backend, definir estándares JWT/CORS para React |
| **Frontend Agent** 🎨 | ✅ **NUEVO** | 0% | Crear proyecto React, migrar Power Pages → React |

### 📈 Progress Notes (April 14, 2026)

**Database Agent - COMPLETADO ✅**
- ✅ Schema: 10 tablas, 13 índices, 3 vistas, 3 funciones, 3 SPs, 4 triggers (36 objetos totales)
- ✅ Test Data: 51 registros en 8 tablas (Usuario, Tienda, Barbero, Servicio, Cita, Pago, Reseña)
- ✅ Validación: Todas relaciones FK funcionando, triggers disparándose, calificación promedio auto-calculada (4.50⭐)
- ✅ Documentación: FadeBooker_ScriptBD.sql (EJECUTADA Y VALIDADA)
- Cambios realizados: Corrección filtro índice (OR → IN) para SQL Server compatibility

**Backend Agent - INICIANDO FASE 2 ⏳**
- Current Stack: Express.js 5.2.1, Knex.js 3.2.9, tedious 19.2.1, Jest testing
- Architecture: Clean (domain, application, infrastructure, interfaces)
- Location: `Producto/back-fadebooker/`
- Status: Proyecto existente con index.js, package.json, estructura base lista
- Next: Validar/generar Prisma schema, DTOs con Zod, endpoints CRUD

---

## 🔗 Referencias Útiles

- **Instrucciones Globales:** [`copilot-instructions.md`](copilot-instructions.md)
- **Documentación Proyecto:** `Documentación/`
- **Conexión BD:** `fadebooker-server.database.windows.net / FadeBooker_DB`
- **Repositorio:** `c:\Users\Mauricio\Documents\GitHub\FadeBooker`

---

**Última actualización:** 14 de abril de 2026  
**Versión:** 1.0.0 (Inicial)
