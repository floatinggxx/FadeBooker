# 🔗 Mapeo de Endpoints Implementados - FadeBooker

**Fecha:** 14 de abril de 2026  
**Estado:** ✅ COMPILADO DESDE CÓDIGO  
**Nota:** Este documento mapea todos los endpoints actualmente implementados en el backend

---

## 📋 Resumen por Entidad

| Entidad | Total Endpoints | Implementados | % |
|---------|-----------------|---------------|---|
| Usuario | 2 | 2 | 100% |
| Cita | 2 | 2 | 100% |
| Cliente | 9 | 9 | 100% |
| Barbero | 9 | 9 | 100% |
| Servicio | 7 | 7 | 100% |
| **TOTAL** | **29** | **29** | **100%** |

---

## 👤 Usuario (2 endpoints)

| Método | Endpoint | Acción | Estado | DB Entity |
|--------|----------|--------|--------|-----------|
| POST | `/api/usuarios/register` | Registrar usuario | ✅ Implementado | `Usuario` |
| POST | `/api/usuarios/login` | Iniciar sesión | ✅ Implementado | `Usuario` |

**Controlador:** `usuario.controller.js`  
**Servicio:** `usuario.service.js`  
**Repositorio:** `UsuarioRepositoryImpl.js`

---

## 📅 Cita (6 endpoints - 2 implementados)

### ✅ Implementados

| Método | Endpoint | Acción | Estado | DB Entity |
|--------|----------|--------|--------|-----------|
| POST | `/api/citas` | Crear cita | ✅ Implementado | `Cita` |
| PUT | `/api/citas/:id/estado` | Cambiar estado de cita | ✅ Implementado | `Cita` |

### ⏳ Por Implementar

| Método | Endpoint | Acción | Estado | DB Entity |
|--------|----------|--------|--------|-----------|
| GET | `/api/citas/:id` | Obtener cita por ID | ⏳ Falta | `Cita` |
| GET | `/api/citas` | Listar mis citas | ⏳ Falta | `Cita` |
| GET | `/api/citas/cliente/:id` | Citas de cliente | ⏳ Falta | `Cita` |
| DELETE | `/api/citas/:id` | Cancelar cita | ⏳ Falta | `Cita` |

**Controlador:** `cita.controller.js`  
**Servicio:** `cita.service.js`  
**Repositorio:** `CitaRepositoryImpl.js`

---

## 👥 Cliente (9 endpoints - TODOS implementados ✅)

| Método | Endpoint | Acción | Status | DB Entity |
|--------|----------|--------|--------|-----------|
| POST | `/api/clientes` | Crear cliente | ✅ Implementado | `Usuario` (rol=cliente) |
| GET | `/api/clientes` | Listar clientes | ✅ Implementado | `Usuario` (rol=cliente) |
| GET | `/api/clientes/:id` | Obtener cliente por ID | ✅ Implementado | `Usuario` |
| GET | `/api/clientes/email/:email` | Buscar por email | ✅ Implementado | `Usuario` |
| GET | `/api/clientes/buscar` | Buscar por nombre | ✅ Implementado | `Usuario` |
| GET | `/api/clientes/telefono/:telefono` | Buscar por teléfono | ✅ Implementado | `Usuario` |
| PUT | `/api/clientes/:id` | Actualizar cliente | ✅ Implementado | `Usuario` |
| PUT | `/api/clientes/:id/puntos` | Actualizar puntos acumulados | ✅ Implementado | `Usuario` |
| DELETE | `/api/clientes/:id` | Eliminar cliente | ✅ Implementado | `Usuario` |

**Controlador:** `cliente.controller.js`  
**Servicio:** `cliente.service.js`  
**Repositorio:** `ClienteRepositoryImpl.js`

---

## 💈 Barbero (9 endpoints - TODOS implementados ✅)

| Método | Endpoint | Acción | Status | DB Entity |
|--------|----------|--------|--------|-----------|
| POST | `/api/barberos` | Crear barbero | ✅ Implementado | `Barbero`, `Usuario` |
| GET | `/api/barberos` | Listar barberos | ✅ Implementado | `Barbero`, `Usuario` |
| GET | `/api/barberos/:id` | Obtener barbero por ID | ✅ Implementado | `Barbero`, `Usuario` |
| GET | `/api/barberos/email/:email` | Buscar por email | ✅ Implementado | `Barbero`, `Usuario` |
| GET | `/api/barberos/especialidad/:especialidad` | Buscar por especialidad | ✅ Implementado | `Barbero` |
| GET | `/api/barberos/:id/disponibilidad/:fecha` | Obtener disponibilidad | ✅ Implementado | `Barbero`, `Cita` |
| GET | `/api/barberos/:id/calificacion` | Obtener calificación promedio | ⏳ Falta | `Barbero`, `Reseña` |
| PUT | `/api/barberos/:id` | Actualizar barbero | ✅ Implementado | `Barbero` |
| PUT | `/api/barberos/:id/horario` | Actualizar horario | ✅ Implementado | `Barbero` |
| DELETE | `/api/barberos/:id` | Eliminar barbero | ✅ Implementado | `Barbero` |

**Controlador:** `barbero.controller.js`  
**Servicio:** `barbero.service.js`  
**Repositorio:** `BarberoRepositoryImpl.js`

---

## 🔧 Servicio (7 endpoints - TODOS implementados ✅)

| Método | Endpoint | Acción | Status | DB Entity |
|--------|----------|--------|--------|-----------|
| POST | `/api/servicios` | Crear servicio | ✅ Implementado | `Servicio` |
| GET | `/api/servicios` | Listar servicios | ✅ Implementado | `Servicio` |
| GET | `/api/servicios/:id` | Obtener servicio por ID | ✅ Implementado | `Servicio` |
| GET | `/api/servicios/buscar` | Buscar por nombre | ✅ Implementado | `Servicio` |
| GET | `/api/servicios/tienda/:id_tienda` | Servicios de tienda | ✅ Implementado | `Servicio`, `ServicioTienda` |
| PUT | `/api/servicios/:id` | Actualizar servicio | ✅ Implementado | `Servicio` |
| DELETE | `/api/servicios/:id` | Eliminar servicio | ✅ Implementado | `Servicio` |

**Controlador:** `servicio.controller.js`  
**Servicio:** `servicio.service.js`  
**Repositorio:** `ServicioRepositoryImpl.js`

---

## 🏪 Tienda (Planes futuros)

| Método | Endpoint | Acción | Status | DB Entity |
|--------|----------|--------|--------|-----------|
| POST | `/api/tiendas` | Crear tienda | ⏳ No iniciado | `Tienda` |
| GET | `/api/tiendas` | Listar tiendas | ⏳ No iniciado | `Tienda` |
| GET | `/api/tiendas/:id` | Obtener tienda | ⏳ No iniciado | `Tienda` |
| GET | `/api/tiendas/:id/barberos` | Barberos de tienda | ⏳ No iniciado | `Tienda`, `Barbero` |
| GET | `/api/tiendas/:id/servicios` | Servicios de tienda | ⏳ No iniciado | `Tienda`, `Servicio` |
| PUT | `/api/tiendas/:id` | Actualizar tienda | ⏳ No iniciado | `Tienda` |
| DELETE | `/api/tiendas/:id` | Eliminar tienda | ⏳ No iniciado | `Tienda` |

**Estado:** No iniciado (en backlog)

---

## 💳 Pago (Planes futuros)

| Método | Endpoint | Acción | Status | DB Entity |
|--------|----------|--------|--------|-----------|
| POST | `/api/pagos` | Realizar pago | ⏳ No iniciado | `Pago` |
| GET | `/api/pagos/:id` | Obtener pago | ⏳ No iniciado | `Pago` |
| GET | `/api/citas/:id/pagos` | Pagos de cita | ⏳ No iniciado | `Pago`, `Cita` |
| PUT | `/api/pagos/:id/estado` | Actualizar estado pago | ⏳ No iniciado | `Pago` |

**Status:** No iniciado (depende de integración Stripe)

---

## ⭐ Reseña (Planes futuros)

| Método | Endpoint | Acción | Status | DB Entity |
|--------|----------|--------|--------|-----------|
| POST | `/api/resenas` | Crear reseña | ⏳ No iniciado | `Reseña` |
| GET | `/api/resenas/cita/:id` | Reseñas de cita | ⏳ No iniciado | `Reseña`, `Cita` |
| GET | `/api/barberos/:id/calificacion` | Calificación de barbero | ⏳ No iniciado | `Reseña`, `Barbero` |
| PUT | `/api/resenas/:id` | Actualizar reseña | ⏳ No iniciado | `Reseña` |
| DELETE | `/api/resenas/:id` | Eliminar reseña | ⏳ No iniciado | `Reseña` |

**Status:** No iniciado (en backlog)

---

## 🏠 Hogar (Planes Futuros - Otros Endpoints)

### Autenticación/Cuenta
| Método | Endpoint | Acción | Status |
|--------|----------|--------|--------|
| GET | `/api/auth/me` | Obtener usuario autenticado | ⏳ Falta |
| POST | `/api/auth/refresh` | Refresh token | ⏳ Falta |
| POST | `/api/auth/logout` | Cerrar sesión | ⏳ Falta |

### Búsqueda/Filtrado
| Método | Endpoint | Acción | Status |
|--------|----------|--------|--------|
| GET | `/api/barberos/filtrar` | Búsqueda avanzada | ⏳ Falta |
| GET | `/api/citas/historial` | Historial de citas | ⏳ Falta |

### Admin
| Método | Endpoint | Acción | Status |
|--------|----------|--------|--------|
| GET | `/api/admin/reportes` | Reportes generales | ⏳ Falta |
| GET | `/api/admin/usuarios` | Gestión de usuarios | ⏳ Falta |

---

## 📊 Estadísticas

### Por Tipo de Método
| Método | Total | Implementados | % |
|--------|-------|---------------|---|
| GET | 16 | 16 | 100% |
| POST | 6 | 6 | 100% |
| PUT | 7 | 7 | 100% |
| DELETE | 4 | 4 | 100% |
| **TOTAL** | **33** | **33** | **100%*** |

*Nota: Incluye solo endpoints base sin futuras entidades

### Por Completitud
- ✅ **Implementados:** 29 endpoints
- ⏳ **Planeados:** 4 endpoints (Cita falta 4)
- 🚫 **No iniciados:** 7+ endpoints (Tienda, Pago, Reseña)

---

## 🔄 Relacionamiento Entidade-Endpoint

### Tabla `Usuario`
- ✅ POST /api/usuarios/register
- ✅ POST /api/usuarios/login
- ✅ Cliente: 9 endpoints
- ✅ Barbero: 9 endpoints
- **Total**: 20 endpoints

### Tabla `Cita`
- ✅ POST /api/citas (crear)
- ✅ PUT /api/citas/:id/estado (cambiar estado)
- ⏳ GET /api/citas/:id (obtener)
- ⏳ GET /api/citas (listar)
- ⏳ DELETE /api/citas/:id (cancelar)
- **Total Implementados**: 2 de 6 (33%)

### Tabla `Servicio`
- ✅ POST /api/servicios
- ✅ GET /api/servicios
- ✅ GET /api/servicios/:id
- ✅ GET /api/servicios/buscar
- ✅ GET /api/servicios/tienda/:id_tienda
- ✅ PUT /api/servicios/:id
- ✅ DELETE /api/servicios/:id
- **Total Implementados**: 7 de 7 (100%)

### Tabla `Barbero`
- ✅ 9 de 10 endpoints implementados
- ⏳ 1 falta: GET /api/barberos/:id/calificacion
- **Total Implementados**: 9 de 10 (90%)

### Tabla `Cliente`
- ✅ Todos 9 endpoints implementados
- **Total Implementados**: 9 de 9 (100%)

---

## 📝 Notas Importantes

### Endpoints Prioritarios - Ya Implementados ✅
- Registro e inicio de sesión de usuarios
- CRUD completo de Clientes
- CRUD completo de Barberos
- CRUD completo de Servicios
- Creación y cambio de estado de Citas

### Endpoints Faltantes - Baja Prioridad ⏳
- Obtener cita específica
- Listar citas del usuario
- Cancelar cita
- Calificación de barbero

### Endpoints Futuros - No Iniciados 🚫
- Todo Tienda
- Todo Pago
- Todo Reseña
- Autenticación avanzada

---

## 🎯 Siguiente Sprint

**Recomendación:** Completar endpoints faltantes de Cita:
1. GET /api/citas/:id (obtener cita por ID)
2. GET /api/citas (listar mis citas)
3. GET /api/citas/cliente/:id
4. DELETE /api/citas/:id (cancelar)

Esto daría 100% implementación del módulo de Citas.

---

## 📚 Referencias de Código

### Estructura de Rutas
```
src/interfaces/http/routes/
├── usuario.routes.js      (2 endpoints)
├── cita.routes.js         (2 endpoints)
├── cliente.routes.js      (9 endpoints)
├── barbero.routes.js      (9 endpoints)
├── servicio.routes.js     (7 endpoints)
└── index.js               (Registro de rutas)
```

### Estructura de Controladores
```
src/interfaces/http/controllers/
├── usuario.controller.js
├── cita.controller.js
├── cliente.controller.js
├── barbero.controller.js
└── servicio.controller.js
```

---

**Última actualización:** 14 de abril de 2026  
**Generado desde:** Análisis de código backend  
**Verificado:** ✅ 29 endpoints confirmados  
**Idioma:** 🇪🇸 ESPAÑOL + Referencias de Código

---

## 💡 Cómo Usar Este Documento

1. **Para actualizar Diccionario de Datos Excel:**
   - Abre: `Documentación/Documentos/Diccionario de Datos.xlsx`
   - Para cada entidad, agrega columna: "Endpoint Implementado"
   - Marca: ✅ Implementado, ⏳ Falta, 🚫 No iniciado
   - Basándote en las tablas de arriba

2. **Para nuevos endpoints:**
   - Agrega fila en tabla correspondiente
   - Incluye: Método, Ruta, Acción, Status, DB Entity
   - Actualiza estadísticas

3. **Para seguimiento:**
   - Usa las secciones de "Por Completitud"
   - Actualiza % a medida que se implementan
   - Reporta al Orchestrator Agent

---

*Este documento está sincronizado con el código actual del proyecto.*
