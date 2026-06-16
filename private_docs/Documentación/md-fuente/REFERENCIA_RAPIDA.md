# 📖 FadeBooker Backend - Referencia Rápida de Endpoints

**Version:** 1.10.0 | **Base URL:** `http://localhost:3000/api` | **Última actualización:** 29/04/2026

---

## 📑 Tabla Maestra de Endpoints

| # | Método | Endpoint | Descripción | Parámetros | Estatus |
|---|--------|----------|-------------|------------|---------|
| **USUARIOS** |
| 1 | POST | `/usuarios/register` | Registrar nuevo usuario | body: email, contrasena, nombre, apellido, telefono, rol | ✅ |
| 2 | POST | `/usuarios/login` | Autenticar usuario | body: email, contrasena | ✅ |
| **BARBEROS** |
| 3 | GET | `/barberos` | Listar todos | - | ✅ |
| 4 | GET | `/barberos/:id` | Obtener uno | id (path) | ✅ |
| 5 | GET | `/barberos/email/:email` | Buscar por email | email (path) | ✅ |
| 6 | GET | `/barberos/especialidad/:esp` | Buscar por especialidad | especialidad (path) | ✅ |
| 7 | POST | `/barberos` | Crear barbero | body: id_usuario, id_tienda, nombre, apellido, email, telefono, especialidad, anos_experiencia, tarifa_base | ✅ |
| 8 | PUT | `/barberos/:id` | Actualizar barbero | id (path), body: campos a actualizar | ✅ |
| 9 | PUT | `/barberos/:id/horario` | Actualizar horario | id (path), body: horario (JSON) | ✅ |
| 10 | GET | `/barberos/:id/disponibilidad/:fecha` | Ver disponibilidad | id (path), fecha (path YYYY-MM-DD) | ✅ |
| 11 | GET | `/barberos/:id/servicios` | Servicios del barbero | id (path) | ✅ |
| 12 | POST | `/barberos/:id/servicios` | Agregar servicio | id (path), body: id_servicio, precio_barbero?, tiempo_servicio_minutos? | ✅ |
| 13 | DELETE | `/barberos/:id` | Eliminar barbero | id (path) | ✅ |
| 14 | DELETE | `/barberos/:id/servicios/:id_srv` | Remover servicio | id (path), id_srv (path) | ✅ |
| **CLIENTES** |
| 15 | GET | `/clientes` | Listar todos | - | ✅ |
| 16 | GET | `/clientes/:id` | Obtener uno | id (path) | ✅ |
| 17 | GET | `/clientes/email/:email` | Buscar por email | email (path) | ✅ |
| 18 | GET | `/clientes/telefono/:tel` | Buscar por teléfono | tel (path) | ✅ |
| 19 | GET | `/clientes/buscar` | Buscar por nombre | nombre (query) | ✅ |
| 20 | POST | `/clientes` | Crear cliente | body: id_usuario, nombre, apellido, email, telefono, puntos_acumulados, activo | ✅ |
| 21 | PUT | `/clientes/:id` | Actualizar cliente | id (path), body: campos a actualizar | ✅ |
| 22 | PUT | `/clientes/:id/puntos` | Actualizar puntos | id (path), body: puntos | ✅ |
| 23 | DELETE | `/clientes/:id` | Eliminar cliente | id (path) | ✅ |
| **SERVICIOS** |
| 24 | GET | `/servicios` | Listar todos | - | ✅ |
| 25 | GET | `/servicios/:id` | Obtener uno | id (path) | ✅ |
| 26 | GET | `/servicios/buscar` | Buscar por nombre | nombre (query) | ✅ |
| 27 | POST | `/servicios` | Crear servicio | body: nombre_servicio, descripcion?, duracion_minutos, precio_base | ✅ |
| 28 | PUT | `/servicios/:id` | Actualizar servicio | id (path), body: campos a actualizar | ✅ |
| 29 | DELETE | `/servicios/:id` | Eliminar servicio | id (path) | ✅ |
| 30 | GET | `/servicios/:id/barberos` | Barberos que hacen servicio | id (path) | ✅ |
| 31 | GET | `/servicios/:id_barbero/:id_srv/precio` | Precio efectivo (v1.10.0) | id_barbero (path), id_srv (path) | ✅ |
| 32 | GET | `/servicios/:id_barbero/:id_srv/duracion` | Duración efectiva (v1.10.0) | id_barbero (path), id_srv (path) | ✅ |
| **CITAS** |
| 33 | GET | `/citas/:id` | Obtener cita | id (path) | ✅ |
| 34 | POST | `/citas` | Agendar cita | body: id_cliente, id_barbero, id_servicio, fecha_hora_inicio, pago_abono, metodo_pago, notas? | ✅ |
| 35 | PUT | `/citas/:id/estado` | Cambiar estado | id (path), body: estado (confirmada\|cancelada\|completada\|no_presentado) | ✅ |
| **HAIRSTYLE** |
| 36 | POST | `/hairstyle/signature` | Firma Cloudinary | body: folder? | ✅ |
| 37 | POST | `/hairstyle/simulate` | Simular corte | body: publicId, styleId (degradado\|clasico\|moderno\|mohicano\|buzzcut) | ✅ |

---

## 🎯 Búsqueda Rápida por Operación

### Crear (POST)
| Recurso | Endpoint | Respuesta |
|---------|----------|-----------|
| Usuario | `POST /usuarios/register` | 201 + Usuario con id |
| Barbero | `POST /barberos` | 201 + Barbero con id |
| Cliente | `POST /clientes` | 201 + Cliente con id |
| Servicio | `POST /servicios` | 201 + Servicio con id |
| Cita | `POST /citas` | 201 + Cita con id |
| Servicio→Barbero | `POST /barberos/:id/servicios` | 201 + id_servicio_barbero |

### Obtener (GET)
| Recurso | Endpoint | Respuesta |
|---------|----------|-----------|
| Un Barbero | `GET /barberos/:id` | 200 + Objeto Barbero |
| Todos Barberos | `GET /barberos` | 200 + Array Barberos |
| Barbero por email | `GET /barberos/email/X` | 200 + Objeto Barbero o 404 |
| Disponibilidad | `GET /barberos/:id/disponibilidad/:fecha` | 200 + Slots horarios |
| Servicios Barbero | `GET /barberos/:id/servicios` | 200 + Array ServicioBarbero |
| Un Cliente | `GET /clientes/:id` | 200 + Objeto Cliente |
| Todos Clientes | `GET /clientes` | 200 + Array Clientes |
| Un Servicio | `GET /servicios/:id` | 200 + Objeto Servicio |
| Todos Servicios | `GET /servicios` | 200 + Array Servicios |
| Barberos×Servicio | `GET /servicios/:id/barberos` | 200 + Array Barberos |
| Precio efectivo | `GET /servicios/:id_barb/:id_srv/precio` | 200 + Objeto con precio_efectivo |
| Duración efectiva | `GET /servicios/:id_barb/:id_srv/duracion` | 200 + Objeto con duracion_efectiva |
| Cita | `GET /citas/:id` | 200 + Objeto CitaDetallada |

### Actualizar (PUT)
| Recurso | Endpoint | Campos Actualizables |
|---------|----------|---------------------|
| Barbero | `PUT /barberos/:id` | nombre, apellido, especialidad, anos_experiencia, tarifa_base, activo |
| Barbero Horario | `PUT /barberos/:id/horario` | horario (JSON completo) |
| Cliente | `PUT /clientes/:id` | nombre, apellido, email, telefono, puntos_acumulados, activo |
| Cliente Puntos | `PUT /clientes/:id/puntos` | puntos (número) |
| Servicio | `PUT /servicios/:id` | nombre_servicio, descripcion, duracion_minutos, precio_base, activo |
| Cita Estado | `PUT /citas/:id/estado` | estado (confirmada\|cancelada\|completada\|no_presentado) |

### Eliminar (DELETE)
| Recurso | Endpoint | Respuesta |
|---------|----------|-----------|
| Barbero | `DELETE /barberos/:id` | 200 + { mensaje: "..." } |
| Cliente | `DELETE /clientes/:id` | 200 + { mensaje: "..." } |
| Servicio | `DELETE /servicios/:id` | 200 + { mensaje: "..." } |
| Servicio Barbero | `DELETE /barberos/:id/servicios/:id_srv` | 200 + { mensaje: "..." } |

### Búsqueda (GET con query/path)
| Tipo | Endpoint | Parámetro | Ejemplo |
|------|----------|-----------|---------|
| Nombre Barbero | `GET /barberos` + filtrar cliente-side | - | Cliente filtra array |
| Email Barbero | `GET /barberos/email/:email` | email (path) | `/barberos/email/carlos@x.com` |
| Especialidad | `GET /barberos/especialidad/:esp` | especialidad (path) | `/barberos/especialidad/Degradados` |
| Nombre Cliente | `GET /clientes/buscar?nombre=X` | nombre (query) | `/clientes/buscar?nombre=Juan` |
| Email Cliente | `GET /clientes/email/:email` | email (path) | `/clientes/email/juan@x.com` |
| Teléfono Cliente | `GET /clientes/telefono/:tel` | telefono (path) | `/clientes/telefono/123456789` |
| Nombre Servicio | `GET /servicios/buscar?nombre=X` | nombre (query) | `/servicios/buscar?nombre=Corte` |

---

## 🔐 Autenticación Requerida

| Endpoint | Autenticación | Rol Requerido | Estado |
|----------|---------------|---------------|--------|
| Todos | JWT Token | - | ❌ No implementado |

**Nota:** Actualmente **todos los endpoints son públicos**. JWT será implementado en v1.11.0.

---

## 📊 Respuestas por Código HTTP

```
200 OK                          ← GET exitoso, PUT/DELETE completado
├─ Listados: Array de objetos
├─ Obtener uno: Objeto único
└─ Actualizar: Objeto actualizado

201 Created                     ← POST exitoso
└─ Objeto creado con ID

400 Bad Request                 ← Validación fallida
├─ { "error": "Validación fallida" }
├─ { "error": "Horario no disponible" }
└─ { "error": "El barbero no puede hacer este servicio" }

401 Unauthorized                ← Login fallido
└─ { "error": "Credenciales inválidas" }

404 Not Found                   ← Recurso no existe
└─ { "error": "Barbero no encontrado" }

409 Conflict                    ← Datos duplicados
└─ { "error": "Barbero ya tiene este servicio" }

500 Internal Server Error       ← Error no controlado
└─ { "error": "..." }
```

---

## 📈 Estadísticas Rápidas

```
Total Endpoints:      37
├─ GET:              20
├─ POST:             10
├─ PUT:               7
└─ DELETE:            5

Entidades:            7
├─ Usuarios
├─ Barberos
├─ Clientes
├─ Servicios
├─ Citas
├─ Hairstyle
└─ ServicioBarbero (relación)

Validaciones:         Múltiples por endpoint
Seguridad:            ⚠️ Crítica (sin auth, sin hash)
Status:               ✅ Producción
```

---

## 🔀 Flujos Típicos (Resumen)

### 1️⃣ Usuario Se Registra
```
1. POST /usuarios/register
2. POST /clientes
3. GET /barberos (ver opciones)
4. GET /servicios (ver opciones)
```

### 2️⃣ Agendar Cita
```
1. GET /barberos/:id/disponibilidad/:fecha
2. GET /servicios/:id_barbero/:id_servicio/precio
3. GET /servicios/:id_barbero/:id_servicio/duracion
4. POST /citas (con validaciones)
```

### 3️⃣ Admin Configura Barbero
```
1. POST /barberos
2. POST /servicios (crear servicios)
3. POST /barberos/:id/servicios (asignar con overrides)
4. GET /barberos/:id/servicios (verificar)
```

### 4️⃣ Simular Cortes
```
1. POST /hairstyle/signature
2. (Cliente sube foto a Cloudinary)
3. POST /hairstyle/simulate (con cada estilo)
```

---

## 🎯 Búsqueda por Caso de Uso

### "Quiero listar todos los [recurso]"
- Barberos: `GET /barberos`
- Clientes: `GET /clientes`
- Servicios: `GET /servicios`

### "Quiero encontrar a [recurso] por [criterio]"
- Barbero por email: `GET /barberos/email/:email`
- Barbero por especialidad: `GET /barberos/especialidad/:esp`
- Cliente por nombre: `GET /clientes/buscar?nombre=X`
- Cliente por email: `GET /clientes/email/:email`
- Cliente por teléfono: `GET /clientes/telefono/:tel`
- Servicio por nombre: `GET /servicios/buscar?nombre=X`

### "Quiero crear/registrar [recurso]"
- Usuario: `POST /usuarios/register`
- Barbero: `POST /barberos`
- Cliente: `POST /clientes`
- Servicio: `POST /servicios`
- Cita: `POST /citas`

### "Quiero actualizar [recurso]"
- Barbero: `PUT /barberos/:id`
- Barbero horario: `PUT /barberos/:id/horario`
- Cliente: `PUT /clientes/:id`
- Cliente puntos: `PUT /clientes/:id/puntos`
- Servicio: `PUT /servicios/:id`
- Cita estado: `PUT /citas/:id/estado`

### "Quiero eliminar [recurso]"
- Barbero: `DELETE /barberos/:id`
- Cliente: `DELETE /clientes/:id`
- Servicio: `DELETE /servicios/:id`
- Servicio de Barbero: `DELETE /barberos/:id/servicios/:id_srv`

---

## 💡 Tips de Uso

### 1. Formato de Fechas
Siempre usar ISO 8601: `2026-05-15T14:00:00Z`

### 2. Métodos de Pago
Valores válidos: `efectivo`, `tarjeta`, `transferencia`

### 3. Estados de Cita
Valores válidos: `confirmada`, `cancelada`, `completada`, `no_presentado`

### 4. Estilos de Corte
Valores válidos: `degradado`, `clasico`, `moderno`, `mohicano`, `buzzcut`

### 5. Búsquedas
- Path params (`:id`): Búsqueda exacta
- Query params (`?nombre=`): Búsqueda parcial con LIKE

### 6. Overrides en ServicioBarbero
- `precio_barbero`: Si NULL, usar `precio_base`
- `tiempo_servicio_minutos`: Si NULL, usar `duracion_minutos`

### 7. Validación de Abono
- Mínimo: `20% * monto_total`
- Máximo: `monto_total (pago completo)`

---

## 📱 Integración Frontend

### Headers Recomendados
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>" // v1.11.0+
}
```

### Manejo de Errores
```javascript
fetch(endpoint)
  .then(res => {
    if (!res.ok) {
      return res.json().then(e => Promise.reject(e));
    }
    return res.json();
  })
  .catch(error => {
    console.error(error.error || error.message);
  });
```

### Validaciones Críticas Antes de POST
```
- /usuarios/register: Email no vacío
- /clientes: id_usuario existe
- /barberos: id_tienda existe
- /servicios: precio >= 0, duracion > 0
- /citas: fecha >= ahora, abono >= 20%*total
```

---

**Última actualización:** 29/04/2026 | **Versión:** 1.10.0  
Para documentación completa ver: `ENDPOINTS_DETALLADOS.md`
