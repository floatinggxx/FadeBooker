# 🗄️ Database Consolidado - FadeBooker

**Motor:** Azure SQL Server (fadebooker-server.database.windows.net)
**Versión Schema:** 1.11.0 (Review Decimals & Points)
**Estado:** ✅ ACTIVA y normalizada (3NF)

---

## 📊 Modelo de Datos (11 Entidades)

| Tabla | Propósito | Relaciones Clave |
|-------|-----------|------------------|
| **Usuario** | Base p/ Auth | Cliente (1:1), Barbero (1:1), Puntos Fidelidad |
| **Tienda** | Ubicaciones | Admin (FK Usuario), Barberos (1:N) |
| **Barbero** | Prestadores | Tienda (FK), Servicios (via ServicioBarbero) |
| **Servicio** | Catálogo | Base para precios y duración |
| **ServicioBarbero** | **(v1.1.0)** | M2M entre Barberos y Servicios con overrides |
| **Cita** | Reservas | Cliente, Barbero, Servicio, Tienda |
| **Pago** | Transacciones | Cita (1:1) |
| **Reseña** | Calidad | Cita, Cliente, Barbero (Puntuación decimal) |
| **AuditoriaSeguridad** | Seguridad | Logs de acciones sensibles (Nueva v1.1.0) |
| **LogErrores** | Monitoreo | Registro de fallos críticos |

---

## 🔄 Refactorización Crítica: ServicioBarbero (v1.1.0)

Se eliminó la tabla `ServicioTienda` en favor de `ServicioBarbero`.
- **Objetivo:** Evitar agendamientos de servicios que un barbero específico no puede realizar.
- **Herencia:** Permite que un barbero tenga un precio o duración distinta a la base del servicio (`precio_barbero`, `tiempo_servicio_minutos`).

---

## 🛡️ Seguridad y Auditoría

- **Logs de Auditoría:** Tabla `AuditoriaSeguridad` para rastrear logins, cambios de roles y borrados.
- **Integridad:** T-SQL Triggers para validar horarios de cita y actualizar promedios de calificación.
- **Optimización:** 13+ índices implementados (`IX_Cita_FechaHora`, `IX_ServicioBarbero_Disponible`, etc.).

---

## 🚀 Inicialización y Datos

- **Script Base:** `Documentación/Documentos/FadeBooker_ScriptBD.sql`
- **Datos de Prueba:** 50+ registros en `Documentación/Documentos/FadeBooker_DatosTest.sql`

---
*Documento unificado y consolidado el 28 de abril de 2026.*
