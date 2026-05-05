# 🎭 FadeBooker - Plataforma de Gestión de Citas para Barberías

**Versión:** 1.0.0  
**Fecha:** 28 de abril de 2026  
**Estado:** 🚀 Desarrollo (Integración React + Backend Node.js)

---

## 📌 Visión General

FadeBooker es una plataforma "Marketplace" diseñada para modernizar el agendamiento de servicios de barbería. Conecta a clientes con barberos y barberías locales, permitiendo una gestión fluida de citas, pagos y reseñas.

### 🏗️ Arquitectura del Sistema

- **Frontend:** React.js / Vite (Integrado en Power Pages)
- **Backend:** Node.js + Express (Arquitectura Hexagonal)
- **Base de Datos:** Azure SQL Server (Esquema 3NF)
- **Infraestructura:** Azure Storage / Cloudinary / Docker

---

## 📂 Estructura del Proyecto

```
FadeBooker/
├── .github/                 # Configuración de Agentes Copilot
├── Documentación/           # Especificaciones, Diccionario, Diagramas ER
├── Gestión/                 # Planificación, EDT, Matriz de Riesgos
├── Producto/
│   ├── back-fadebooker/     # Backend (API REST)
│   └── pages-fadebooker/    # Frontend (React + Power Pages)
├── CONFIGURACION_ENTORNOS.md
├── DOCUMENTACION_INDICE.md
├── QUICK_START_REACT.md
└── RESUMEN_EJECUTIVO_REACT.md
```

---

## 🤖 Sistema de Agentes

El desarrollo de FadeBooker está coordinado por un equipo de agentes especializados para garantizar calidad y consistencia:

- **Frontend Agent:** Implementación de UI/UX en React y componentes de integración.
- **Backend Agent:** Desarrollo de lógica de negocio, APIs y servicios externos.
- **Database Agent:** Diseño y optimización del esquema SQL Server.
- **Security Agent:** Auditoría de código, estándares de OWASP y seguridad de datos.
- **Documentation Agent:** Mantenimiento de especificaciones y guías técnicas.
- **Diagram Agent:** Visualización de arquitectura y flujos de procesos.
- **Orchestrator Agent:** Coordinación global y validación de alineación entre módulos.

---

## 🛠️ Tecnologías Principales

- **Runtime:** Node.js 18+ (Express 5.2.1)
- **Frontend:** React 18, Tailwind CSS, Lucide React
- **ORM/Query Builder:** Knex.js (SQL Server via `tedious`)
- **Document Processing:** xlsx, docx, mammoth, pdf-parse
- **API:** RESTful (OpenAPI 3.0)
- **Seguridad:** JWT, Bcrypt, RBAC
- **Almacenamiento:** Cloudinary (Imágenes y simulación)

---

## 🚀 Quick Start

1. **Requisitos:** Git, Node.js v18+, Docker (opcional).
2. **Configuración:** Ver [CONFIGURACION_ENTORNOS.md](./CONFIGURACION_ENTORNOS.md)
3. **Frontend:** [QUICK_START_REACT.md](./QUICK_START_REACT.md)
4. **Backend:** [Producto/back-fadebooker/SETUP.md](./Producto/back-fadebooker/SETUP.md)

---

## 📚 Documentación

Para una guía detallada de todos los documentos disponibles, consulta el [Índice de Documentación](./DOCUMENTACION_INDICE.md).

- [Especificación de BD](./Documentación/ESPECIFICACION_BD.md)
- [Guía de Integración React](./Producto/pages-fadebooker/REACT_INTEGRATION_GUIDE.md)
- [Manual de Backend](./Producto/back-fadebooker/BACKEND.md)

---

## 📄 Licencia

Este proyecto es propiedad de la organización FadeBooker. Todos los derechos reservados.
