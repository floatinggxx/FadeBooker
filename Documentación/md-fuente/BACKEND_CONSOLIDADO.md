# 🚀 Backend Consolidado - FadeBooker

**Versión Actual:** 2.2 (Producción Lista - 95% Completado)
**Estado:** ✅ Estable - Sincronizado con PowerApps (Swagger 2.0)
**Tecnologías:** Node.js (Express 5.2.1), Knex.js 3.2.9, Azure SQL Server (T-SQL), Jest 29.7.0.

---

## 🏗️ Arquitectura y Estructura

El sistema implementa **Clean Architecture** para asegurar la separación de responsabilidades:

- **Domain Layer:** Entidades de negocio (9 modelos) e interfaces de repositorios.
- **Application Layer:** Casos de uso y servicios de aplicación.
- **Infrastructure Layer:** Implementaciones de bases de datos (Knex Repositories), almacenamiento (Cloudinary), pagos (Stripe) y reportes (exceljs).
- **Interface Layer:** Controladores HTTP y rutas (33+ endpoints).

### 📁 Estructura de Carpetas (src/)
- `application/usecases/`: Lógica de aplicación (Servicios y Casos de Uso).
- `config/`: Configuraciones (Knex, Cloudinary).
- `db/`: Conectores, migraciones y seeds.
- `domain/`: Entidades y definiciones de interfaz de repositorio.
- `infraestructure/`: Implementaciones externas (Database, Storage, Payment).
- `interfaces/http/`: Controllers, Routes y Middlewares.

---

## 🔌 API Endpoints (33+ operacionales)

### Usuarios & Autenticación
- `POST /api/usuarios/register`: Registro de nuevos usuarios.
- `POST /api/usuarios/login`: Autenticación con JWT.
- `GET /api/usuarios/:id`: Perfil de usuario.

### Barberos & Tiendas
- `GET /api/barberos`: Listado completo con filtros por especialidad.
- `GET /api/barberos/:id/servicios`: Servicios específicos que ofrece un barbero.
- `POST /api/barberos/:id/servicios`: Vinculación de nuevos servicios.

### Citas (Agendamiento)
- `POST /api/citas`: Agendamiento con validación de disponibilidad del barbero y tienda.
- `PUT /api/citas/:id/estado`: Cambio de estado (Confirmada, Cancelada, Completada).

### Simulación de Estilos (Cloudinary)
- `POST /api/upload/signature`: Firma segura para subida de fotos.
- `POST /api/hairstyles/simulate`: Simulación de 5 tipos de cortes (Degradado, Buzzcut, etc.).

---

## 🧪 Estrategia de Testing

- **Tests Unitarios (52+):** Validación de modelos y lógica de negocio (Jest).
- **Tests de Integración (35+):** Validación de rutas y conectividad (Supertest).
- **Cobertura:** 42.32% (Pass Rate 100%).

---

## 🚧 Roadmap y Próximos Pasos (8% restante)
1. **Deploy & CI/CD (15%):** Configuración de Docker, GitHub Actions y Azure App Service.
2. **Monitoreo:** Integración con Winston/Pino y Application Insights.
3. **Seguridad:** Implementación de encriptación AES-256 para datos PII y auditoría OWASP.

---
*Documento unificado y consolidado el 28 de abril de 2026.*
