# 🏗️ Technical Knowledge Consolidation - FadeBooker

This document bridges the gap between the initial project planning in `knowledge/` and the current technical implementation.

## 🔗 Technical Source of Truth
For the most up-to-date technical information, always refer to the **Consolidated MDs** in `Documentación/md-fuente/`:

- [BACKEND_CONSOLIDADO.md](../Documentación/md-fuente/BACKEND_CONSOLIDADO.md): Clean Architecture details, JWT security, and Jest testing coverage.
- [DATABASE_CONSOLIDADO.md](../Documentación/md-fuente/DATABASE_CONSOLIDADO.md): Schema 3NF, Relationship mapping, and the critical migration from `ServicioTienda` to `ServicioBarbero`.
- [FRONTEND_CONSOLIDADO.md](../Documentación/md-fuente/FRONTEND_CONSOLIDADO.md): React + Vite strategy for Power Pages integration and Bootstrap 5 usage.
- [MATRIZ_CARACTERISTICAS.md](../Documentación/md-fuente/MATRIZ_CARACTERISTICAS.md): Mapping of functional requirements to technical endpoints.

## 💡 Key Technical Constraints & Patterns

### 1. Payment & Retention System
- **Provider**: Mercado Pago v2 (SDK Node.js).
- **Logic**: All appointments require a retention (abono) ranging from 30% to 100%. 
- **Webhook**: Payment status must be updated in the `Cita` table upon successful transaction notification.

### 2. Loyalty Points System
- **Rule**: 50 points rewarded per completed appointment.
- **Persistence**: Managed in the `Usuario` table with a log in `PuntosFidelidad`.

### 3. Service Modeling (Critical)
- Historically, services were linked to the shop (`ServicioTienda`). They are now linked directly to the barber (`ServicioBarbero`) to allow for individualized pricing and availability.

### 4. Integration with Power Platform
- **Power Apps**: Used by barbers to manage their daily schedule. Requires Swagger 2.0 (`swagger_powerapps.json`).
- **Power Pages**: Host for the public-facing React frontend. Deployment handled via `PAC CLI`.

### 5. Deployment Info
- **Hosting**: Azure App Service (Backend) and Azure Static Web Apps / Power Pages (Frontend).
- **DB**: Azure SQL Server.
- **Media**: Cloudinary for user profile pictures and AI-assisted "cut simulation".

---
_Last Updated: June 2026_
