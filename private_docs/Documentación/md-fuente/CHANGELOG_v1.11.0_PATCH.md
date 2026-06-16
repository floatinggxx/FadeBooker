# 🔧 Correcciones y Mejoras - 20 Mayo 2026

**Estado:** 🛠️ **Fase de Estabilización v1.11.0**
**Versión:** 1.11.0
**Cambios:** Backend (Lógica de Puntos, Roles, Reseñas), Frontend (Versión, Tests)

---

## 🎯 Cambios Implementados

### 1. Sistema de Fidelización (Puntos)
- **CitaService:** Se ha implementado la lógica para otorgar **50 puntos** automáticamente cuando una cita pasa a estado `completada` o se registra un pago.
- **Validación Automática:** El sistema detecta transiciones de estado y pagos parciales/totales para asignar puntos al cliente.

### 2. Soporte para Reseñas con Media Estrella
- **Base de Datos:** Migración para cambiar el tipo de dato de `puntuacion` de `INT` a `DECIMAL(3,1)`.
- **Backend:** Actualización de `ResenaRepositoryImpl` para manejar promediado decimal.
- **Frontend:** Verificado que `ReviewModal` soporta la selección de media estrella mediante gestos táctiles/ratón.
- **API:** El endpoint `POST /citas/:id/resena` ahora devuelve el `id_resena` correctamente.

### 3. Registro de Proveedores
- **Base de Datos:** Actualización de la restricción `CHK_Rol` para permitir el valor `'Proveedor'`.
- **Lógica de Negocio:** El rol `Proveedor` ahora se trata como un perfil de empresa, similar al de `Dueño`, permitiendo futuras integraciones de catálogo de insumos.

### 4. Estabilización de Tests Unitarios
- **Backend:** 
  - Corregido `resena.repository.test.js`: Se implementó el patrón `.then()` en el mock de Knex para soportar llamadas asíncronas (`await`).
  - Corregido `cita.service.test.js`: Se actualizó el mock del repositorio para exportar correctamente las funciones cuando se requiere el singleton.
- **Frontend:**
  - Corregido `bookingService.test.ts`: Sincronizado el mock de `api` con la definición real en `src/lib/api.ts`, solucionando errores de conexión `ECONNREFUSED`.

### 5. Seguridad y Recuperación de Contraseña
- **Validación de Email:** Se ha añadido una validación explícita en `UsuarioService` que lanza un error claro si el usuario intenta recuperar contraseña con un email no registrado.
- **Consistency:** Preparado el sistema para el envío de tokens JWT seguros de 1 hora.

---

## 📁 Archivos Modificados

**Backend:**
- `src/application/usecases/cita.service.js`
- `src/infraestructure/database/ResenaRepositoryImpl.js`
- `src/infraestructure/database/UsuarioRepositoryImpl.js`
- `src/application/usecases/usuario.service.js`
- `src/interfaces/http/controllers/resena.controller.js`
- `openapi.yaml`
- `Documentación/Documentos/Migrations/20260520_UpdateResenaPuntuacionDecimal.sql`
- `Documentación/Documentos/Migrations/20260520_AllowProveedorRole.sql`

**Frontend:**
- `package.json` (Versión 1.11.0)
- `src/tests/bookingService.test.ts`

**Tests Backend:**
- `tests/unit/resena.repository.test.js`
- `tests/unit/cita.service.test.js`
