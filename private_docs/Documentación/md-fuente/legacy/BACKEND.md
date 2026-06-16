# 🔧 Backend - FadeBooker

## Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** Express.js 5.2.1
- **ORM:** Knex.js 3.2.9
- **Base Datos:** Azure SQL Server (tedious driver)
- **Language:** JavaScript (CommonJS)
- **Testing:** Jest 29.7.0

## Estructura de Carpetas

```
src/
├── config/
│   ├── knexfile.js          # Configuración de BD
│   └── cloudinary.config.js # Config Cloudinary
├── db/
│   └── knex.js              # Instancia de Knex
├── domain/
│   ├── entities/            # Modelos (Usuario, Cita, etc)
│   ├── repositories/        # Interfaces de acceso a datos
│   └── services/            # Lógica de negocio
├── application/
│   └── usecases/            # Servicios de aplicación
├── infraestructure/
│   ├── database/            # Implementación de repositorios
│   ├── payment/             # Lógica de pagos
│   └── storage/             # Almacenamiento
└── interfaces/
    └── http/
        ├── controllers/     # Handlers de requests
        ├── routes/          # Definición de rutas
        └── middleware/      # Middleware custom
```

## Modelos de Datos (10 entidades)

10 modelos implementados en `src/domain/entities/`:
- Usuario ✓
- Cliente ✓
- Barbero ✓
- Tienda ✓
- Servicio ✓
- ServicioTienda ✓
- Cita ✓
- Pago ✓
- Reseña ✓
- (+ audit tables in BD)

**Ver [DATABASE.md](./DATABASE.md) para esquema completo con todas las columnas y relaciones**

### Relaciones de Entidades
```
Usuario (base)
├─ Cliente (extends: id_cliente, FK/Usuario)
├─ Barbero (extends: id_barbero, FK/Usuario, FK/Tienda)
└─ Tienda (FK/Usuario como dueño)
    ├─ M2M ServicioTienda
    │   └─ Servicio
    ├─ Barbero (trabaja en)
    ├─ Cita (ocurre en)
    └─ Reseña (sobre la tienda)

Cita (transacción)
├─ Cliente (FK)
├─ Barbero (FK)
├─ Servicio (FK)
├─ Tienda (FK)
├─ Pago (1:M)
└─ Reseña (1:1)

Reseña (calificación)
├─ Cita (FK)
├─ Cliente (FK)
├─ Barbero (FK)
└─ Tienda (FK)
```

## Repositorios (Abstract Interfaces)

⚠️ **CRITICAL:** Abstract interfaces defined but **NO concrete Knex implementations yet**

| Repositorio | Ubicación | Status |
|------------|-----------|--------|
| **UsuarioRepository** | `domain/repositories/usuario.repository.js` | ⚠️ Abstract only |
| **ClienteRepository** | `domain/repositories/cliente.repository.js` | ⚠️ Abstract only |
| **BarberoRepository** | `domain/repositories/barbero.repository.js` | ⚠️ Abstract only |
| **CitaRepository** | `domain/repositories/cita.repository.js` | ⚠️ Abstract only |
| **ServicioRepository** | `domain/repositories/servicio.repository.js` | ⚠️ Abstract only |

**Concrete Implementations Missing:**
- ❌ BarberoRepositoryImpl (needs Knex queries)
- ❌ CitaRepositoryImpl (needs Knex queries)
- ❌ ClienteRepositoryImpl (needs Knex queries)
- ❌ ServicioRepositoryImpl (needs Knex queries)
- ❌ UsuarioRepositoryImpl (needs Knex queries)

**Impact:** Services reference empty repositories → Database operations will fail

**See:** [DATABASE.md](./DATABASE.md) - Schema ready, implementation needed

## Servicios de Negocio

- **UsuarioService** - Registro, autenticación, búsqueda  
- **CitaService** - CRUD citas, validar disponibilidad
- **ServicioService** - CRUD servicios, filtrar por tienda
- **BarberoService** - CRUD barberos, disponibilidad
- **ClienteService** - CRUD clientes, gestionar puntos
- **HairstyleService** - Cloudinary integration (signatures, simulations)
- **Domain CitaService** - Lógica de negocio de citas

## Endpoints Implementados (33 total)

### Usuarios (2)
- `POST /api/usuarios/register` - Registrar
- `POST /api/usuarios/login` - Autenticación

### Barberos (9)
- `POST /api/barberos`, `GET /api/barberos`, `GET /api/barberos/especialidad/:especialidad`
- `GET /api/barberos/email/:email`, `GET /api/barberos/:id`, `GET /api/barberos/:id/disponibilidad/:fecha`
- `PUT /api/barberos/:id`, `PUT /api/barberos/:id/horario`, `DELETE /api/barberos/:id`

### Clientes (9)
- `POST /api/clientes`, `GET /api/clientes`, `GET /api/clientes/buscar`
- `GET /api/clientes/telefono/:telefono`, `GET /api/clientes/email/:email`, `GET /api/clientes/:id`
- `PUT /api/clientes/:id`, `PUT /api/clientes/:id/puntos`, `DELETE /api/clientes/:id`

### Citas (3)
- `POST /api/citas` - Crear cita
- `PUT /api/citas/:id/estado` - Cambiar estado
- GET endpoints incomplete

### Servicios (7)
- `POST /api/servicios`, `GET /api/servicios`, `GET /api/servicios/buscar`
- `GET /api/servicios/tienda/:id_tienda`, `GET /api/servicios/:id`
- `PUT /api/servicios/:id`, `DELETE /api/servicios/:id`

### Hairstyle/Cloudinary (2)
- `POST /api/hairstyle/signature` - Firma SHA-1
- `POST /api/hairstyle/simulate` - Simular corte (5 estilos)

**Total:** 31 implemented | **Pending:** ~10 (Tienda, Pago, Reseña CRUD)

## Entrypoint

- **Archivo Principal:** `index.js` (raíz)
- **Aplicación Express:** `src/app.js`
- **Puerto:** 3000 (configurable en `.env`)
- **Comando:** `npm start`

## Variables de Entorno

```env
# Database
DB_SERVER=fadebooker-server.database.windows.net
DB_NAME=FadeBooker_DB
DB_USER=adminuser
DB_PASSWORD=***
DB_PORT=1433

# Server
PORT=3000
NODE_ENV=development

# Cloudinary (para simular cortes)
CLOUDINARY_CLOUD_NAME=***
CLOUDINARY_API_KEY=***
CLOUDINARY_API_SECRET=***
```

## Patrones Implementados

- ✅ **Clean Architecture** - Separación clara de layers
- ✅ **Dependency Injection** - Inyección de dependencias
- ✅ **Repository Pattern** - Abstracción de datos
- ✅ **Error Handling** - Try/catch en servicios
- ✅ **Validation** - Validar inputs en controllers

## Últimos Cambios

- ✅ Estructura de carpetas creada
- ✅ Modelos de dominio implementados
- ✅ Repositorios definidos
- ✅ Servicios de negocio listos
- ✅ Endpoints configurados
- ✅ Validaciones básicas en place
