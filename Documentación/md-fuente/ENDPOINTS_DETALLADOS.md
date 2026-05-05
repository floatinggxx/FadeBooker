# 📋 FadeBooker Backend - Documentación Detallada de Endpoints

**Versión:** 1.10.0  
**Última actualización:** 29 de Abril de 2026  
**Base URL:** `http://localhost:3000/api`

---

## 📍 Índice General

- [🔐 Autenticación y Seguridad](#-autenticación-y-seguridad)
- [👤 Usuarios](#-usuarios)
- [💈 Barberos](#-barberos)
- [👥 Clientes](#-clientes)
- [🗂️ Servicios](#-servicios)
- [📅 Citas](#-citas)
- [✂️ Estilos de Corte (Hairstyle)](#-estilos-de-corte-hairstyle)
- [❌ Códigos de Error](#-códigos-de-error)

---

## 🔐 Autenticación y Seguridad

### Estado Actual
✅ **IMPLEMENTADO:** La autenticación JWT está activa. Los endpoints protegidos requieren el header: `Authorization: Bearer <token>`.

### Algoritmo y Secretos
- **JWT:** Uso de `jsonwebtoken` para firma y validación.
- **Bcrypt:** Uso de `bcryptjs` para hashing de contraseñas.
- **Configuración:** `JWT_SECRET` debe estar definido en el archivo `.env`.
- **Estructura del Payload:**
```json
{
  "id_usuario": "integer",
  "rol": "string",
  "email": "string"
}
```

---

## 👤 Usuarios

### 1️⃣ Registro de Usuario

**Endpoint:** `POST /api/usuarios/register`

```
POST http://localhost:3000/api/usuarios/register
```

**Descripción:** Registra un nuevo usuario en el sistema

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Requerido):**
```json
{
  "email": "string (email válido)",
  "contrasena": "string (mínimo 8 caracteres recomendado)",
  "nombre": "string",
  "apellido": "string",
  "telefono": "string",
  "rol": "string (Cliente|Barbero|Dueño|Administrador)"
}
```

**Response (201 Created):**
```json
{
  "id_usuario": 1,
  "email": "usuario@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "123456789",
  "rol": "Cliente",
  "estado": true,
  "createdAt": "2026-04-29T10:30:00Z"
}
```

**Errores (400 Bad Request):**
```json
{
  "error": "El email ya está registrado"
}
```
O
```json
{
  "error": "Los campos requeridos no fueron proporcionados"
}
```

---

### 2️⃣ Login de Usuario

**Endpoint:** `POST /api/usuarios/login`

```
POST http://localhost:3000/api/usuarios/login
```

**Descripción:** Autentica un usuario y retorna sus datos

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Requerido):**
```json
{
  "email": "usuario@example.com",
  "contrasena": "password123"
}
```

**Response (200 OK):**
```json
{
  "id_usuario": 1,
  "email": "usuario@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "123456789",
  "rol": "Cliente",
  "estado": true,
  "token": null
}
```

**Validaciones:**
- ✅ Email debe existir en la BD
- ✅ Contraseña debe coincidir exactamente

**Errores (401 Unauthorized):**
```json
{
  "error": "Credenciales inválidas"
}
```

---

## 💈 Barberos

### 1️⃣ Crear Barbero

**Endpoint:** `POST /api/barberos`

```
POST http://localhost:3000/api/barberos
```

**Descripción:** Registra un nuevo barbero en el sistema

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Requerido):**
```json
{
  "id_usuario": 2,
  "id_tienda": 1,
  "nombre": "Carlos",
  "apellido": "García",
  "email": "carlos@barberia.com",
  "telefono": "987654321",
  "especialidad": "Degradados",
  "anos_experiencia": 5,
  "tarifa_base": 50.00,
  "activo": true
}
```

**Response (201 Created):**
```json
{
  "id_barbero": 1,
  "id_usuario": 2,
  "id_tienda": 1,
  "nombre": "Carlos",
  "apellido": "García",
  "email": "carlos@barberia.com",
  "telefono": "987654321",
  "especialidad": "Degradados",
  "anos_experiencia": 5,
  "tarifa_base": 50.00,
  "calificacion_promedio": 0,
  "total_resenas": 0,
  "activo": true
}
```

**Errores (400 Bad Request):**
```json
{
  "error": "Email ya registrado"
}
```

---

### 2️⃣ Obtener Todos los Barberos

**Endpoint:** `GET /api/barberos`

```
GET http://localhost:3000/api/barberos
```

**Descripción:** Obtiene la lista completa de barberos activos

**Parameters:** Ninguno

**Response (200 OK):**
```json
[
  {
    "id_barbero": 1,
    "id_usuario": 2,
    "id_tienda": 1,
    "nombre": "Carlos",
    "apellido": "García",
    "email": "carlos@barberia.com",
    "telefono": "987654321",
    "especialidad": "Degradados",
    "anos_experiencia": 5,
    "tarifa_base": 50.00,
    "calificacion_promedio": 4.5,
    "total_resenas": 12,
    "activo": true
  },
  {
    "id_barbero": 2,
    "id_usuario": 3,
    "id_tienda": 1,
    "nombre": "Miguel",
    "apellido": "López",
    "email": "miguel@barberia.com",
    "telefono": "987654322",
    "especialidad": "Clasico",
    "anos_experiencia": 8,
    "tarifa_base": 45.00,
    "calificacion_promedio": 4.8,
    "total_resenas": 25,
    "activo": true
  }
]
```

---

### 3️⃣ Obtener Barbero por ID

**Endpoint:** `GET /api/barberos/:id`

```
GET http://localhost:3000/api/barberos/1
```

**Descripción:** Obtiene los detalles de un barbero específico

**Parameters:**
- `id` (path): ID del barbero

**Response (200 OK):**
```json
{
  "id_barbero": 1,
  "id_usuario": 2,
  "id_tienda": 1,
  "nombre": "Carlos",
  "apellido": "García",
  "email": "carlos@barberia.com",
  "telefono": "987654321",
  "especialidad": "Degradados",
  "anos_experiencia": 5,
  "tarifa_base": 50.00,
  "calificacion_promedio": 4.5,
  "total_resenas": 12,
  "activo": true
}
```

**Errores (404 Not Found):**
```json
{
  "error": "Barbero no encontrado"
}
```

---

### 4️⃣ Obtener Barbero por Email

**Endpoint:** `GET /api/barberos/email/:email`

```
GET http://localhost:3000/api/barberos/email/carlos@barberia.com
```

**Descripción:** Busca un barbero por su email

**Parameters:**
- `email` (path): Email del barbero

**Response (200 OK):** Objeto Barbero completo

**Errores (404 Not Found):**
```json
{
  "error": "Barbero no encontrado"
}
```

---

### 5️⃣ Buscar Barberos por Especialidad

**Endpoint:** `GET /api/barberos/especialidad/:especialidad`

```
GET http://localhost:3000/api/barberos/especialidad/Degradados
```

**Descripción:** Obtiene todos los barberos con una especialidad específica

**Parameters:**
- `especialidad` (path): Nombre de la especialidad

**Response (200 OK):**
```json
[
  {
    "id_barbero": 1,
    "nombre": "Carlos",
    "apellido": "García",
    "email": "carlos@barberia.com",
    "especialidad": "Degradados",
    "calificacion_promedio": 4.5,
    "activo": true
  }
]
```

---

### 6️⃣ Actualizar Barbero

**Endpoint:** `PUT /api/barberos/:id`

```
PUT http://localhost:3000/api/barberos/1
```

**Descripción:** Actualiza los datos de un barbero

**Parameters:**
- `id` (path): ID del barbero

**Body (Parcial - Solo los campos a actualizar):**
```json
{
  "nombre": "Carlos Miguel",
  "especialidad": "Degradados y Clásico",
  "anos_experiencia": 6,
  "tarifa_base": 55.00,
  "activo": true
}
```

**Response (200 OK):**
```json
{
  "id_barbero": 1,
  "nombre": "Carlos Miguel",
  "especialidad": "Degradados y Clásico",
  "anos_experiencia": 6,
  "tarifa_base": 55.00,
  "activo": true
}
```

---

### 7️⃣ Actualizar Horario del Barbero

**Endpoint:** `PUT /api/barberos/:id/horario`

```
PUT http://localhost:3000/api/barberos/1/horario
```

**Descripción:** Actualiza el horario de atención del barbero

**Parameters:**
- `id` (path): ID del barbero

**Body (Requerido):**
```json
{
  "horario": {
    "lunes": { "inicio": "09:00", "fin": "18:00" },
    "martes": { "inicio": "09:00", "fin": "18:00" },
    "miercoles": { "inicio": "09:00", "fin": "18:00" },
    "jueves": { "inicio": "09:00", "fin": "18:00" },
    "viernes": { "inicio": "09:00", "fin": "20:00" },
    "sabado": { "inicio": "10:00", "fin": "16:00" },
    "domingo": null
  }
}
```

**Response (200 OK):**
```json
{
  "mensaje": "Horario actualizado"
}
```

---

### 8️⃣ Obtener Disponibilidad del Barbero

**Endpoint:** `GET /api/barberos/:id/disponibilidad/:fecha`

```
GET http://localhost:3000/api/barberos/1/disponibilidad/2026-05-15
```

**Descripción:** Obtiene los horarios disponibles de un barbero para una fecha específica

**Parameters:**
- `id` (path): ID del barbero
- `fecha` (path): Fecha en formato YYYY-MM-DD

**Response (200 OK):**
```json
{
  "id_barbero": 1,
  "fecha": "2026-05-15",
  "disponibilidad": [
    { "inicio": "09:00", "fin": "10:00" },
    { "inicio": "10:30", "fin": "11:30" },
    { "inicio": "14:00", "fin": "15:00" },
    { "inicio": "15:30", "fin": "16:30" }
  ]
}
```

---

### 9️⃣ Obtener Servicios de un Barbero

**Endpoint:** `GET /api/barberos/:id/servicios`

```
GET http://localhost:3000/api/barberos/1/servicios
```

**Descripción:** Obtiene todos los servicios que ofrece un barbero (v1.10.0)

**Parameters:**
- `id` (path): ID del barbero

**Response (200 OK):**
```json
[
  {
    "id_servicio_barbero": 1,
    "id_servicio": 1,
    "id_barbero": 1,
    "nombre_servicio": "Corte Degradado",
    "descripcion": "Corte moderno con degradado de lados",
    "duracion_minutos": 30,
    "precio_base": 50.00,
    "precio_barbero": 55.00,
    "tiempo_servicio_minutos": 35,
    "precio": 55.00,
    "duracion": 35
  },
  {
    "id_servicio_barbero": 2,
    "id_servicio": 2,
    "id_barbero": 1,
    "nombre_servicio": "Afeitado",
    "descripcion": "Afeitado completo",
    "duracion_minutos": 15,
    "precio_base": 30.00,
    "precio_barbero": null,
    "tiempo_servicio_minutos": null,
    "precio": 30.00,
    "duracion": 15
  }
]
```

---

### 🔟 Agregar Servicio a Barbero

**Endpoint:** `POST /api/barberos/:id/servicios`

**Descripción:** Asigna un servicio a un barbero con opción de override de precio/duración (v1.10.0)

```
POST http://localhost:3000/api/barberos/1/servicios
```

**Parameters:**
- `id` (path): ID del barbero

**Body (Requerido):**
```json
{
  "id_servicio": 3,
  "precio_barbero": 60.00,
  "tiempo_servicio_minutos": 40
}
```

**Response (201 Created):**
```json
{
  "id_servicio_barbero": 3,
  "mensaje": "Servicio agregado exitosamente"
}
```

**Errores (409 Conflict):**
```json
{
  "error": "Barbero ya tiene este servicio"
}
```

---

### 1️⃣1️⃣ Eliminar Barbero

**Endpoint:** `DELETE /api/barberos/:id`

```
DELETE http://localhost:3000/api/barberos/1
```

**Descripción:** Elimina un barbero del sistema

**Parameters:**
- `id` (path): ID del barbero

**Response (200 OK):**
```json
{
  "mensaje": "Barbero eliminado"
}
```

---

### 1️⃣2️⃣ Remover Servicio de Barbero

**Endpoint:** `DELETE /api/barberos/:id/servicios/:id_servicio`

**Descripción:** Elimina la relación entre un servicio y un barbero (v1.10.0)

```
DELETE http://localhost:3000/api/barberos/1/servicios/3
```

**Parameters:**
- `id` (path): ID del barbero
- `id_servicio` (path): ID del servicio

**Response (200 OK):**
```json
{
  "mensaje": "Servicio removido"
}
```

---

## 👥 Clientes

### 1️⃣ Crear Cliente

**Endpoint:** `POST /api/clientes`

```
POST http://localhost:3000/api/clientes
```

**Descripción:** Registra un nuevo cliente

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Requerido):**
```json
{
  "id_usuario": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "123456789",
  "puntos_acumulados": 0,
  "activo": true
}
```

**Response (201 Created):**
```json
{
  "id_cliente": 1,
  "id_usuario": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "123456789",
  "puntos_acumulados": 0,
  "activo": true,
  "createdAt": "2026-04-29T10:30:00Z"
}
```

---

### 2️⃣ Obtener Todos los Clientes

**Endpoint:** `GET /api/clientes`

```
GET http://localhost:3000/api/clientes
```

**Descripción:** Obtiene la lista completa de clientes

**Response (200 OK):**
```json
[
  {
    "id_cliente": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "123456789",
    "puntos_acumulados": 150,
    "activo": true
  }
]
```

---

### 3️⃣ Obtener Cliente por ID

**Endpoint:** `GET /api/clientes/:id`

```
GET http://localhost:3000/api/clientes/1
```

**Descripción:** Obtiene los detalles de un cliente específico

**Parameters:**
- `id` (path): ID del cliente

**Response (200 OK):**
```json
{
  "id_cliente": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "123456789",
  "puntos_acumulados": 150,
  "activo": true
}
```

**Errores (404 Not Found):**
```json
{
  "error": "Cliente no encontrado"
}
```

---

### 4️⃣ Obtener Cliente por Email

**Endpoint:** `GET /api/clientes/email/:email`

```
GET http://localhost:3000/api/clientes/email/juan@example.com
```

**Descripción:** Busca un cliente por su email

**Parameters:**
- `email` (path): Email del cliente

**Response (200 OK):** Objeto Cliente completo

---

### 5️⃣ Buscar Cliente por Nombre

**Endpoint:** `GET /api/clientes/buscar?nombre=Juan`

```
GET http://localhost:3000/api/clientes/buscar?nombre=Juan
```

**Descripción:** Busca clientes por nombre (búsqueda parcial)

**Parameters:**
- `nombre` (query): Nombre o parte del nombre a buscar

**Response (200 OK):**
```json
[
  {
    "id_cliente": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com"
  }
]
```

---

### 6️⃣ Buscar Cliente por Teléfono

**Endpoint:** `GET /api/clientes/telefono/:telefono`

```
GET http://localhost:3000/api/clientes/telefono/123456789
```

**Descripción:** Busca un cliente por su teléfono

**Parameters:**
- `telefono` (path): Número telefónico

**Response (200 OK):** Objeto Cliente completo

---

### 7️⃣ Actualizar Cliente

**Endpoint:** `PUT /api/clientes/:id`

```
PUT http://localhost:3000/api/clientes/1
```

**Descripción:** Actualiza los datos de un cliente

**Parameters:**
- `id` (path): ID del cliente

**Body (Parcial):**
```json
{
  "nombre": "Juan Carlos",
  "telefono": "987654321",
  "activo": true
}
```

**Response (200 OK):**
```json
{
  "id_cliente": 1,
  "nombre": "Juan Carlos",
  "telefono": "987654321",
  "activo": true
}
```

---

### 8️⃣ Actualizar Puntos del Cliente

**Endpoint:** `PUT /api/clientes/:id/puntos`

```
PUT http://localhost:3000/api/clientes/1/puntos
```

**Descripción:** Actualiza los puntos acumulados de un cliente

**Parameters:**
- `id` (path): ID del cliente

**Body (Requerido):**
```json
{
  "puntos": 200
}
```

**Response (200 OK):**
```json
{
  "mensaje": "Puntos actualizados"
}
```

---

### 9️⃣ Eliminar Cliente

**Endpoint:** `DELETE /api/clientes/:id`

```
DELETE http://localhost:3000/api/clientes/1
```

**Descripción:** Elimina un cliente del sistema

**Parameters:**
- `id` (path): ID del cliente

**Response (200 OK):**
```json
{
  "mensaje": "Cliente eliminado"
}
```

---

## 🗂️ Servicios

### 1️⃣ Crear Servicio

**Endpoint:** `POST /api/servicios`

```
POST http://localhost:3000/api/servicios
```

**Descripción:** Crea un nuevo servicio (solo administradores)

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Requerido):**
```json
{
  "nombre_servicio": "Corte Degradado Premium",
  "descripcion": "Corte moderno con degradado y detalles premium",
  "duracion_minutos": 45,
  "precio_base": 60.00,
  "activo": true
}
```

**Validaciones:**
- ✅ `nombre_servicio`: String requerido
- ✅ `duracion_minutos`: Entero > 0
- ✅ `precio_base`: Decimal >= 0

**Response (201 Created):**
```json
{
  "id_servicio": 5,
  "nombre_servicio": "Corte Degradado Premium",
  "descripcion": "Corte moderno con degradado y detalles premium",
  "duracion_minutos": 45,
  "precio_base": 60.00,
  "activo": true,
  "createdAt": "2026-04-29T10:30:00Z",
  "updatedAt": "2026-04-29T10:30:00Z"
}
```

---

### 2️⃣ Obtener Todos los Servicios

**Endpoint:** `GET /api/servicios`

```
GET http://localhost:3000/api/servicios
```

**Descripción:** Obtiene la lista completa de servicios disponibles

**Response (200 OK):**
```json
[
  {
    "id_servicio": 1,
    "nombre_servicio": "Corte Clásico",
    "descripcion": "Corte clásico tradicional",
    "duracion_minutos": 30,
    "precio_base": 50.00,
    "activo": true,
    "createdAt": "2026-04-28T15:00:00Z",
    "updatedAt": "2026-04-28T15:00:00Z"
  },
  {
    "id_servicio": 2,
    "nombre_servicio": "Afeitado",
    "descripcion": "Afeitado completo con navaja",
    "duracion_minutos": 15,
    "precio_base": 30.00,
    "activo": true,
    "createdAt": "2026-04-28T15:00:00Z",
    "updatedAt": "2026-04-28T15:00:00Z"
  }
]
```

---

### 3️⃣ Obtener Servicio por ID

**Endpoint:** `GET /api/servicios/:id`

```
GET http://localhost:3000/api/servicios/1
```

**Descripción:** Obtiene los detalles de un servicio específico

**Parameters:**
- `id` (path): ID del servicio

**Response (200 OK):**
```json
{
  "id_servicio": 1,
  "nombre_servicio": "Corte Clásico",
  "descripcion": "Corte clásico tradicional",
  "duracion_minutos": 30,
  "precio_base": 50.00,
  "activo": true,
  "createdAt": "2026-04-28T15:00:00Z",
  "updatedAt": "2026-04-28T15:00:00Z"
}
```

**Errores (404 Not Found):**
```json
{
  "error": "Servicio no encontrado"
}
```

---

### 4️⃣ Buscar Servicio por Nombre

**Endpoint:** `GET /api/servicios/buscar?nombre=Corte`

```
GET http://localhost:3000/api/servicios/buscar?nombre=Corte
```

**Descripción:** Busca servicios por nombre (búsqueda parcial)

**Parameters:**
- `nombre` (query): Nombre o parte del nombre a buscar

**Response (200 OK):**
```json
[
  {
    "id_servicio": 1,
    "nombre_servicio": "Corte Clásico",
    "precio_base": 50.00
  },
  {
    "id_servicio": 5,
    "nombre_servicio": "Corte Degradado Premium",
    "precio_base": 60.00
  }
]
```

---

### 5️⃣ Obtener Servicios por Tienda (Deprecated → v1.10.0)

**Endpoint:** `GET /api/servicios/tienda/:id_tienda`

⚠️ **DEPRECADO EN v1.10.0:** Usar `/api/barberos/:id/servicios` en su lugar

---

### 6️⃣ Actualizar Servicio

**Endpoint:** `PUT /api/servicios/:id`

```
PUT http://localhost:3000/api/servicios/1
```

**Descripción:** Actualiza los datos de un servicio

**Parameters:**
- `id` (path): ID del servicio

**Body (Parcial):**
```json
{
  "nombre_servicio": "Corte Clásico Deluxe",
  "duracion_minutos": 35,
  "precio_base": 55.00
}
```

**Response (200 OK):**
```json
{
  "id_servicio": 1,
  "nombre_servicio": "Corte Clásico Deluxe",
  "duracion_minutos": 35,
  "precio_base": 55.00,
  "activo": true,
  "updatedAt": "2026-04-29T11:00:00Z"
}
```

---

### 7️⃣ Eliminar Servicio

**Endpoint:** `DELETE /api/servicios/:id`

```
DELETE http://localhost:3000/api/servicios/1
```

**Descripción:** Elimina un servicio del catálogo

**Parameters:**
- `id` (path): ID del servicio

**Response (200 OK):**
```json
{
  "mensaje": "Servicio eliminado"
}
```

---

### 8️⃣ Obtener Barberos que Hacen un Servicio (v1.10.0)

**Endpoint:** `GET /api/servicios/:id/barberos`

```
GET http://localhost:3000/api/servicios/1/barberos
```

**Descripción:** Obtiene todos los barberos que pueden ofrecer un servicio específico

**Parameters:**
- `id` (path): ID del servicio

**Response (200 OK):**
```json
[
  {
    "id_barbero": 1,
    "nombre": "Carlos",
    "apellido": "García",
    "email": "carlos@barberia.com",
    "especialidad": "Degradados",
    "calificacion_promedio": 4.5,
    "precio_barbero": 55.00,
    "tiempo_servicio_minutos": 35
  },
  {
    "id_barbero": 2,
    "nombre": "Miguel",
    "apellido": "López",
    "email": "miguel@barberia.com",
    "especialidad": "Clásico",
    "calificacion_promedio": 4.8,
    "precio_barbero": null,
    "tiempo_servicio_minutos": null
  }
]
```

---

### 9️⃣ Obtener Precio Efectivo de Servicio para Barbero (v1.10.0)

**Endpoint:** `GET /api/servicios/:id_barbero/:id_servicio/precio`

```
GET http://localhost:3000/api/servicios/1/1/precio
```

**Descripción:** Retorna el precio efectivo considerando overrides por barbero

**Parameters:**
- `id_barbero` (path): ID del barbero
- `id_servicio` (path): ID del servicio

**Lógica:**
```
IF ServicioBarbero.precio_barbero IS NOT NULL
  THEN precio_efectivo = ServicioBarbero.precio_barbero
ELSE
  precio_efectivo = Servicio.precio_base
```

**Response (200 OK):**
```json
{
  "id_barbero": 1,
  "id_servicio": 1,
  "precio_base": 50.00,
  "precio_barbero": 55.00,
  "precio_efectivo": 55.00
}
```

---

### 🔟 Obtener Duración Efectiva de Servicio para Barbero (v1.10.0)

**Endpoint:** `GET /api/servicios/:id_barbero/:id_servicio/duracion`

```
GET http://localhost:3000/api/servicios/1/1/duracion
```

**Descripción:** Retorna la duración efectiva considerando overrides por barbero

**Parameters:**
- `id_barbero` (path): ID del barbero
- `id_servicio` (path): ID del servicio

**Lógica:**
```
IF ServicioBarbero.tiempo_servicio_minutos IS NOT NULL
  THEN duracion_efectiva = ServicioBarbero.tiempo_servicio_minutos
ELSE
  duracion_efectiva = Servicio.duracion_minutos
```

**Response (200 OK):**
```json
{
  "id_barbero": 1,
  "id_servicio": 1,
  "duracion_base": 30,
  "tiempo_servicio_minutos": 35,
  "duracion_efectiva": 35
}
```

---

## 📅 Citas

### 1️⃣ Agendar Cita

**Endpoint:** `POST /api/citas`

```
POST http://localhost:3000/api/citas
```

**Descripción:** Crea una nueva cita con validaciones completas

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Requerido):**
```json
{
  "id_cliente": 1,
  "id_barbero": 1,
  "id_servicio": 1,
  "fecha_hora_inicio": "2026-05-15T14:00:00Z",
  "pago_abono": 15.00,
  "metodo_pago": "tarjeta",
  "notas": "Preferencia: línea recta en detalles"
}
```

**Validaciones (v1.10.0):**
- ✅ Cliente existe y está activo
- ✅ Barbero existe y está activo
- ✅ Servicio existe y está activo
- ✅ **NUEVO:** Barbero PUEDE HACER el servicio (existe en ServicioBarbero)
- ✅ Fecha está en el futuro
- ✅ Barbero disponible (sin solapamientos)
- ✅ `pago_abono` >= 20% del total

**Response (201 Created):**
```json
{
  "id_cita": 5,
  "id_cliente": 1,
  "id_barbero": 1,
  "id_servicio": 1,
  "fecha_hora_inicio": "2026-05-15T14:00:00Z",
  "duracion_minutos": 35,
  "monto_total": 55.00,
  "pago_abono": 15.00,
  "estado": "confirmada",
  "createdAt": "2026-04-29T10:30:00Z"
}
```

**Errores (400 Bad Request):**
```json
{
  "error": "Horario no disponible"
}
```
O
```json
{
  "error": "El barbero no puede hacer este servicio"
}
```
O
```json
{
  "error": "Validación fallida"
}
```

---

### 2️⃣ Cambiar Estado de Cita

**Endpoint:** `PUT /api/citas/:id/estado`

```
PUT http://localhost:3000/api/citas/5/estado
```

**Descripción:** Actualiza el estado de una cita (confirmada, cancelada, completada, no_presentado)

**Parameters:**
- `id` (path): ID de la cita

**Body (Requerido):**
```json
{
  "estado": "completada"
}
```

**Estados válidos:**
- `confirmada` - Cita confirmada
- `cancelada` - Cita cancelada
- `completada` - Cita realizada
- `no_presentado` - Cliente no se presentó

**Response (200 OK):**
```json
{
  "mensaje": "Estado actualizado"
}
```

---

### 3️⃣ Obtener Detalles de Cita

**Endpoint:** `GET /api/citas/:id`

```
GET http://localhost:3000/api/citas/5
```

**Descripción:** Obtiene información completa de una cita incluyendo datos del cliente, barbero, servicio y tienda

**Parameters:**
- `id` (path): ID de la cita

**Response (200 OK):**
```json
{
  "id_cita": 5,
  "id_cliente": 1,
  "cliente_nombre": "Juan",
  "cliente_email": "juan@example.com",
  "id_barbero": 1,
  "barbero_nombre": "Carlos",
  "barbero_email": "carlos@barberia.com",
  "id_servicio": 1,
  "nombre_servicio": "Corte Clásico",
  "fecha_hora_inicio": "2026-05-15T14:00:00Z",
  "duracion_minutos": 35,
  "estado": "confirmada",
  "monto_total": 55.00,
  "pago_abono": 15.00,
  "id_tienda": 1,
  "nombre_tienda": "Barbería Premium"
}
```

**Errores (404 Not Found):**
```json
{
  "error": "Cita no encontrada"
}
```

---

## ✂️ Estilos de Corte (Hairstyle)

### 1️⃣ Generar Firma para Subida a Cloudinary

**Endpoint:** `POST /api/hairstyle/signature`

```
POST http://localhost:3000/api/hairstyle/signature
```

**Descripción:** Genera una firma segura para permitir que el frontend suba fotos a Cloudinary sin exponer el API Secret

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Opcional):**
```json
{
  "folder": "user_photos"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
  "timestamp": 1714385400,
  "cloudName": "dtu7xxxxx",
  "apiKey": "123456789012345",
  "uploadPreset": "fade_booker",
  "folder": "user_photos"
}
```

**Errores (400 Bad Request):**
```json
{
  "success": false,
  "error": "Cloudinary no está configurado"
}
```

---

### 2️⃣ Generar Simulación de Corte de Pelo

**Endpoint:** `POST /api/hairstyle/simulate`

```
POST http://localhost:3000/api/hairstyle/simulate
```

**Descripción:** Genera una URL transformada que simula un corte de pelo usando overlays en Cloudinary

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Requerido):**
```json
{
  "publicId": "user_photos/photo_123",
  "styleId": "degradado"
}
```

**Estilos disponibles:**
- `degradado` - Corte con degradado de lados
- `clasico` - Corte clásico tradicional
- `moderno` - Corte moderno contemporáneo
- `mohicano` - Corte mohicano
- `buzzcut` - Corte rapado corto

**Response (200 OK):**
```json
{
  "success": true,
  "simulatedImageUrl": "https://res.cloudinary.com/dtu7xxxxx/image/upload/c_fill/h_400/w_400/g_faces/q_auto/f_auto/l_cortes:degradado/fl_layer_apply/g_gravity,x_0,y_0/user_photos/photo_123.jpg",
  "styleId": "degradado",
  "publicId": "user_photos/photo_123",
  "overlay": "cortes/degradado",
  "message": "Simulación de corte generada exitosamente"
}
```

**Validaciones:**
- ✅ `publicId` es requerido
- ✅ `styleId` es requerido
- ✅ `styleId` debe ser uno de los estilos válidos

**Errores (400 Bad Request):**
```json
{
  "success": false,
  "error": "Los parámetros publicId y styleId son requeridos"
}
```
O
```json
{
  "success": false,
  "error": "Estilo de corte no válido: unknown. Estilos válidos: degradado, clasico, moderno, mohicano, buzzcut"
}
```
O
```json
{
  "success": false,
  "error": "Cloudinary no está configurado"
}
```

---

## ❌ Códigos de Error

### Códigos HTTP Utilizados

| Código | Significado | Ejemplo |
|--------|------------|---------|
| **200** | OK - Solicitud exitosa | GET exitoso, PUT/DELETE completado |
| **201** | Created - Recurso creado | POST exitoso creando nuevo recurso |
| **400** | Bad Request - Datos inválidos | Validación fallida, parámetros incorrectos |
| **401** | Unauthorized - Credenciales inválidas | Login fallido, token expirado |
| **404** | Not Found - Recurso no existe | ID no encontrado |
| **409** | Conflict - Conflicto de datos | Intento de crear duplicado |
| **500** | Server Error - Error interno | Error no controlado en servidor |

### Estructura de Errores

Todos los errores siguen este formato:

```json
{
  "error": "Mensaje descriptivo del error"
}
```

O para Hairstyle:

```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

### Errores Comunes por Endpoint

#### Usuario (Login)
- `401`: "Credenciales inválidas"

#### Barbero
- `404`: "Barbero no encontrado"
- `400`: "Email ya registrado"

#### Cliente
- `404`: "Cliente no encontrado"
- `400`: "Datos inválidos"

#### Servicio
- `404`: "Servicio no encontrado"
- `400`: "Nombre de servicio requerido"

#### Cita
- `400`: "Horario no disponible"
- `400`: "El barbero no puede hacer este servicio" (v1.10.0)
- `400`: "Validación fallida"
- `404`: "Cita no encontrada"

#### Hairstyle
- `400`: "Los parámetros publicId y styleId son requeridos"
- `400`: "Estilo de corte no válido"
- `400`: "Cloudinary no está configurado"

---

## 📊 Resumen de Endpoints

### Total de Endpoints: **45**

| Entidad | GET | POST | PUT | DELETE | Total |
|---------|-----|------|-----|--------|-------|
| **Usuarios** | 0 | 2 | 0 | 0 | 2 |
| **Barberos** | 6 | 2 | 3 | 2 | 13 |
| **Clientes** | 5 | 1 | 2 | 1 | 9 |
| **Servicios** | 5 | 1 | 1 | 1 | 8 |
| **Citas** | 1 | 1 | 1 | 0 | 3 |
| **Hairstyle** | 0 | 2 | 0 | 0 | 2 |
| **ServicioBarbero** | 3 | 1 | 0 | 1 | 5 |
| **TOTAL** | **20** | **10** | **7** | **5** | **42** |

---

## 🔄 Flujo Típico de Uso

### 1. Cliente se registra
```
POST /api/usuarios/register → POST /api/clientes
```

### 2. Barbero se registra
```
POST /api/usuarios/register → POST /api/barberos
```

### 3. Admin crea un servicio
```
POST /api/servicios
```

### 4. Admin asigna servicios a barbero
```
POST /api/barberos/:id/servicios
```

### 5. Cliente agenda cita
```
GET /api/barberos (listar disponibles)
GET /api/servicios (ver servicios)
POST /api/citas (agendar)
```

### 6. Cliente simula corte
```
POST /api/hairstyle/signature (obtener firma)
POST /api/hairstyle/simulate (generar simulación)
```

---

## 📝 Notas Importantes

### Cambios en v1.10.0
- ✅ **ServicioBarbero Refactor**: Servicios ahora vinculados directamente con Barberos, no con Tiendas
- ✅ **Validación mejorada**: Se verifica que barbero pueda hacer el servicio al agendar cita
- ✅ **Precio/Duración efectiva**: Support para overrides por barbero

---

### 📊 Reportes Administrativos

Esta sección detalla los endpoints encargados de la generación de informes detallados para la gestión administrativa del negocio.

#### **Generar Reporte de Citas**
Genera y descarga un archivo Excel con el listado de citas filtradas por un rango de fechas.

- **Endpoint:** `GET /api/reportes/citas`
- **Seguridad:** Requiere validación mediante Token JWT en el Header.
- **Parámetros de consulta (Query Params):**
    - `fechaInicio` (opcional): Fecha inicial en formato `YYYY-MM-DD`.
    - `fechaFin` (opcional): Fecha final en formato `YYYY-MM-DD`.
- **Respuesta:**
    - **200 OK:** Retorna un flujo de datos (Buffer) correspondiente a un archivo `.xlsx`.
    - **Header Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
    - **Header Content-Disposition:** `attachment; filename=ReporteCitas.xlsx`

---

### 📸 Fotografía Relacional & IA

Integración con **CloudinaryService** para la gestión de activos visuales y generación dinámica de previsualizaciones estilizadas para cortes de cabello y sesiones fotográficas.

#### **Capacidades de CloudinaryService**
El servicio permite la subida, eliminación y transformación de imágenes en la nube de forma segura.

#### **Previsualizaciones con Estilos (IA Transformations)**
Utilizando los parámetros de transformación de Cloudinary, el backend permite generar URLs dinámicas que aplican filtros artísticos a las imágenes originales:

| Estilo | Descripción Técnica | Uso Sugerido |
| :--- | :--- | :--- |
| `sepia` | Efecto sepia (80%) y ajuste de brillo. | Estética clásica/vintage. |
| `grayscale` | Conversión a escala de grises optimizada. | Enfoque en texturas y formas. |
| `vibrant` | Mejora de saturación (+30%) y máscara de enfoque. | Publicaciones en redes sociales. |
| `portrait` | Recorte inteligente (Face Gravity) con viñeteado. | Portafolio de clientes. |
| `modern_cut` | Zoom facial (0.75) con efecto artístico *incognito*. | Resaltar detalles del degradado/fade. |

---

### 🚀 Ejemplos de cURL

#### **1. Descargar Reporte de Citas (Excel)**
```bash
curl -X GET "http://localhost:3000/api/reportes/citas?fechaInicio=2026-05-01&fechaFin=2026-05-31" \
     -H "Authorization: Bearer <TU_TOKEN_JWT>" \
     --output Reporte_Citas_Mayo.xlsx
```

#### **2. Autenticación (Login)**
```bash
curl -X POST "http://localhost:3000/api/usuarios/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@fadebooker.com", "contrasena": "password123"}'
```

---

**Generado:** 05 de Mayo de 2026  
**Versión API:** 1.11.0

