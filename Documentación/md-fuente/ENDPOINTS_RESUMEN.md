# 📋 FadeBooker Backend - Resumen Rápido de Endpoints

**Versión:** 1.10.0 | **Base URL:** `http://localhost:3000/api` | **Actualizado:** 29/04/2026

---

## 🚀 Endpoints por Entidad

### 👤 USUARIOS (2 endpoints)

```
POST   /usuarios/register              → Registrar nuevo usuario
POST   /usuarios/login                 → Autenticar usuario
```

**Body Register:**
```json
{ "email", "contrasena", "nombre", "apellido", "telefono", "rol" }
```

**Body Login:**
```json
{ "email", "contrasena" }
```

---

### 💈 BARBEROS (13 endpoints)

**CRUD Básico:**
```
GET    /barberos                       → Listar todos
GET    /barberos/:id                   → Obtener uno
GET    /barberos/email/:email          → Buscar por email
GET    /barberos/especialidad/:esp     → Buscar por especialidad
POST   /barberos                       → Crear
PUT    /barberos/:id                   → Actualizar
DELETE /barberos/:id                   → Eliminar
```

**Horario y Disponibilidad:**
```
PUT    /barberos/:id/horario           → Actualizar horario
GET    /barberos/:id/disponibilidad/:fecha  → Ver slots libres
```

**Servicios (v1.10.0):**
```
GET    /barberos/:id/servicios         → Listar servicios
POST   /barberos/:id/servicios         → Agregar servicio
DELETE /barberos/:id/servicios/:id_srv → Remover servicio
```

---

### 👥 CLIENTES (9 endpoints)

**CRUD Básico:**
```
GET    /clientes                       → Listar todos
GET    /clientes/:id                   → Obtener uno
GET    /clientes/email/:email          → Buscar por email
GET    /clientes/telefono/:tel         → Buscar por teléfono
GET    /clientes/buscar?nombre=X       → Buscar por nombre
POST   /clientes                       → Crear
PUT    /clientes/:id                   → Actualizar
DELETE /clientes/:id                   → Eliminar
```

**Puntos de Lealtad:**
```
PUT    /clientes/:id/puntos            → Actualizar puntos
```

---

### 🗂️ SERVICIOS (8 endpoints)

**CRUD Básico:**
```
GET    /servicios                      → Listar todos
GET    /servicios/:id                  → Obtener uno
GET    /servicios/buscar?nombre=X      → Buscar por nombre
POST   /servicios                      → Crear
PUT    /servicios/:id                  → Actualizar
DELETE /servicios/:id                  → Eliminar
```

**Nuevo (v1.10.0):**
```
GET    /servicios/:id/barberos         → Barberos que hacen servicio
GET    /servicios/:id_barbero/:id_srv/precio   → Precio efectivo
GET    /servicios/:id_barbero/:id_srv/duracion → Duración efectiva
```

---

### 📅 CITAS (3 endpoints)

```
POST   /citas                          → Agendar cita
GET    /citas/:id                      → Obtener detalles
PUT    /citas/:id/estado               → Cambiar estado (confirmada|cancelada|completada|no_presentado)
```

**Body POST:**
```json
{ 
  "id_cliente", "id_barbero", "id_servicio", 
  "fecha_hora_inicio", "pago_abono", "metodo_pago", 
  "notas" (opcional)
}
```

**Validaciones:**
- ✅ Cliente, Barbero, Servicio existen
- ✅ **NUEVO:** Barbero puede hacer el servicio
- ✅ Fecha en futuro
- ✅ Barbero disponible
- ✅ Abono >= 20% del total

---

### ✂️ HAIRSTYLE - Simulador de Cortes (2 endpoints)

```
POST   /hairstyle/signature            → Firma para subida a Cloudinary
POST   /hairstyle/simulate             → Simular corte sobre foto
```

**Signature Response:**
```json
{
  "success": true,
  "signature": "...",
  "timestamp": 1234567890,
  "cloudName": "...",
  "apiKey": "...",
  "uploadPreset": "...",
  "folder": "user_photos"
}
```

**Simulate Body:**
```json
{
  "publicId": "user_photos/photo_123",
  "styleId": "degradado" 
}
```

**Estilos:** `degradado | clasico | moderno | mohicano | buzzcut`

**Response:**
```json
{
  "success": true,
  "simulatedImageUrl": "https://res.cloudinary.com/...",
  "styleId": "degradado",
  "publicId": "user_photos/photo_123",
  "overlay": "cortes/degradado"
}
```

---

## 🔐 Autenticación

⚠️ **ESTADO:** No implementada (pendiente)
- Todos los endpoints son públicos
- Próxima versión: JWT Token en header `Authorization: Bearer <token>`

---

## 📊 Estadísticas

| Método | Cantidad |
|--------|----------|
| GET    | 20       |
| POST   | 10       |
| PUT    | 7        |
| DELETE | 5        |
| **TOTAL** | **42** |

**Entidades:** 7 (Usuarios, Barberos, Clientes, Servicios, Citas, Hairstyle, ServicioBarbero)

---

## ❌ Códigos de Error

| Código | Significado |
|--------|-------------|
| **200** | ✅ OK |
| **201** | ✅ Creado |
| **400** | ❌ Datos inválidos |
| **401** | ❌ No autenticado |
| **404** | ❌ No encontrado |
| **409** | ❌ Conflicto (ej: duplicado) |
| **500** | ❌ Error servidor |

### Errores Frecuentes

```json
{ "error": "Credenciales inválidas" }
{ "error": "Barbero no encontrado" }
{ "error": "Horario no disponible" }
{ "error": "El barbero no puede hacer este servicio" }
{ "error": "Validación fallida" }
```

---

## 🔄 Flujo Típico

1. **Usuario se registra**
   ```
   POST /usuarios/register → POST /clientes
   ```

2. **Barbero se registra**
   ```
   POST /usuarios/register → POST /barberos
   ```

3. **Admin configura servicios**
   ```
   POST /servicios → POST /barberos/:id/servicios
   ```

4. **Cliente agenda cita**
   ```
   GET /barberos (listar)
   GET /servicios (ver)
   GET /barberos/:id/disponibilidad/:fecha (slots)
   POST /citas (agendar)
   ```

5. **Cliente prueba cortes**
   ```
   POST /hairstyle/signature (obtener firma)
   POST /hairstyle/simulate (ver simulación)
   ```

---

## 📝 Cambios v1.10.0

- ✅ ServicioBarbero refactor (Servicio ↔ Barbero, no Tienda)
- ✅ Validación de que barbero puede hacer servicio
- ✅ Precio/duración efectiva con overrides
- ✅ Nuevos endpoints: GET /barberos/:id/servicios, POST /servicios/:id/barberos, etc.

---

## 📚 Documentación Completa

Para detalles completos de cada endpoint (parámetros, ejemplos, validaciones):
→ Ver `ENDPOINTS_DETALLADOS.md`

---

**Última actualización:** 29/04/2026 | **Versión API:** 1.10.0
