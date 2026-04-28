# 🎭 FadeBooker - Instrucciones Globales para Copilot Agents

## 📌 Visión General del Proyecto

**FadeBooker** es una plataforma de gestión de citas para servicios de barbería y fotografía relacional.

- **Stack:** Node.js (Backend), React (Frontend), Azure SQL Server (BD).
- **BD:** `fadebooker-server.database.windows.net` / `FadeBooker_DB`
- **Estado:** Fase Implementación (Consolidación de esquema y lógica central).

---

## 🎯 Convenciones Globales

### Nomenclatura
- **Carpetas:** `lowercase-with-hyphens`
- **Archivos:** `PascalCase.sql`, `camelCase.ts`, `snake_case.json`
- **Tablas BD:** `PascalCase` (plural)
- **Columnas BD:** `camelCase`
- **Variables código:** `camelCase`
- **Constantes código:** `UPPER_SNAKE_CASE`

### Git & Flujo Trabajo
- **Branches:** `main` (prod), `develop` (int), `feature/*`.
- **Commits:** Mensajes claros, imperativos (ej: "Fix email validation").
- **Versionado:** SemVer `MAJOR.MINOR.PATCH`.
- **Integración:** Cada cambio debe documentarse en `CHANGELOG.md`.

---

## 🤖 Estrategia de Coordinación

Los agentes funcionan de forma **independiente pero coordinada** mediante el registro en `AGENTS.md`.

1. **Database Agent:** Define el contrato de datos.
2. **Backend Agent:** Implementa el contrato en lógica de negocio.
3. **Security Agent:** Valida la integridad y blindaje del código.
4. **Frontend Agent:** Materializa la experiencia de usuario.
5. **Documentation Agent:** Asegura que el conocimiento sea persistente y claro.
6. **Diagram Agent:** Sincroniza la arquitectura visual.

---

## 🛡️ Principios de Desarrollo

- ✅ **DRY (Don't Repeat Yourself):** No duplicar lógica en backend ni en documentación.
- ✅ **Single Responsibility:** Cada agente y cada módulo de código tiene un único propósito.
- ✅ **Infrastructure as Code (Scripts):** Toda modificación de BD debe ser vía script (migraciones).
- ✅ **Documentation First:** Documentar los contratos de API y esquema antes de la implementación extensiva.

---

## 📝 Canales de Comunicación

- **Instrucciones por Agente:** Localizadas en `.github/agents/`.
- **Fuente de Verdad:** `AGENTS.md` para el registro de agentes y estado de hitos.
- **Prompts:** Deben referenciar específicamente al agente (ej: `@database-agent`).

---

## 🚀 Próximos Pasos Prioritarios

1. **Esquema Final:** Validar tablas core (Usuarios, Servicios, Citas).
2. **Lógica de Autenticación:** Implementar JWT y roles en backend.
3. **Documentación Base:** Completar README global y Guía de Inicio.


- **Repositorio:** `c:\Users\Mauricio\Documents\GitHub\FadeBooker`
- **Conexión BD:** ID `8db9ecf2-0e44-49d4-aaf3-8b00fe86a57b` (MSSQL)
- **Documento Base:** Este archivo (`copilot-instructions.md`)

---

**Última actualización:** 14 de abril de 2026
**Versión:** 1.0.0
