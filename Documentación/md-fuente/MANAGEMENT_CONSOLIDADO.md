# 📋 Management Consolidado - FadeBooker

**Versión Global:** 2.1
**Fecha:** 28 de Abril de 2026
**Responsable:** Orchestrator & Documentation Agents

---

## 🚀 Guía de Configuración (Setup)

### Backend
1. `npm install`
2. Configurar `.env` (Basado en `.env.example`).
3. `npm start` (Puerto 3000).

### Frontend (Power Pages)
1. Instalar PAC CLI: `npm install -g @microsoft/powerplatform-cli`.
2. Auth: `pac auth create --environment [ID-ENTORNO]`.
3. Sincronización: `pac pages download` / `pac pages upload`.

---

## 📈 Resumen de Versiones (Changelog)

- **v2.1 (Actual):** Centralización de documentación, actualización a React 18 + Bootstrap 5, implementación de seguridad OWASP avanzada.
- **v2.0:** Implementación de 67+ tests (Unitarios e Integración), Cloudinary funcional, documentación OpenAPI 3.0.0.
- **v1.10.0:** Refactor de la base de datos (ServicioBarbero), mejora de la integridad referencial.
- **v1.0.0:** Inicialización del proyecto, arquitectura Clean y bases de datos Azure SQL.

---

## 🎯 Alineación y Requerimientos Técnica

El proyecto se mantiene alineado con las especificaciones de negocio (Requerimientos, Historias de Usuario y Diccionario de Datos) que residen en `Documentación/Documentos/`.

### Puentes de Información
- `ACTUALIZACION_ESPECIFICACIONES_v1.1.0.md`: Sirve como nexo para actualizar los Excels y Words con los nuevos requerimientos como `RF-SEC-01` (Auditoría de Seguridad) y `RF-FE-01` (Integración React).

---

## 👥 Roles y Agentes Activos
1. **Database Agent:** Esquema y T-SQL.
2. **Backend Agent:** Node.js y lógica de negocio.
3. **Frontend Agent:** React y Power Pages.
4. **Security Agent:** Auditoría y estándares OWASP.
5. **Documentation Agent:** Centralización y manuales.
6. **Diagram Agent:** Visualización arquitectónica.
7. **Orchestrator Agent:** Coordinación global.

---
*Documento unificado y consolidado el 28 de abril de 2026.*
