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

## Modelos de Datos

### Usuario (Base para todos)
```javascript
{
  id_usuario,
  nombre,
  email,
  contrasena,
  tipo_usuario,           // admin, cliente, barbero
  estado,
  createdAt, updatedAt
}
```

### Cliente (extends Usuario)
```javascript
{
  ...Usuario,
  telefono,
  direccion,
  puntos_lealtad,
  fecha_registro
}
```

### Barbero (extends Usuario)
```javascript
{
  ...Usuario,
  especialidad,
  calificacion_promedio,
  horario_disponible,
  id_usuario_barbero     // Foreign key a Usuario
}
```

### Cita
```javascript
{
  id_cita,
  id_cliente,
  id_barbero,
  id_servicio,
  id_tienda,
  fecha_hora_inicio,
  duracion_minutos,
  estado,                 // confirmada, completada, cancelada
  monto_total,
  pago_abono,
  metodo_pago,
  createdAt, updatedAt
}
```

## Repositorios Implementados

| Repositorio | Métodos | Usado En |
|------------|---------|----------|
| UsuarioRepository | create, findById, findByEmail, update, delete, findAll | UsuarioService |
| ClienteRepository | ...usuario + findByTelefono, actualizarPuntos | ClienteService |
| BarberoRepository | ...usuario + findByEspecialidad, obtenerDisponibilidad | BarberoService |
| CitaRepository | create, findById, findByEstado, findByFecha, update, delete | CitaService |
| ServicioRepository | create, findById, findAll, update, delete | ServicioService |
| PagoRepository | create, findById, findByIdCita | PagoService |
| ReseñaRepository | create, findById, findByIdCita, update | ReseñaService |

## Servicios de Negocio

### UsuarioService
- Registro y validación de usuario
- Búsqueda por email
- Actualización de perfil

### CitaService
- Crear cita (validar disponibilidad)
- Cancelar cita
- Listar citas por cliente/barbero
- Cambiar fecha

### ServicioService
- Listar servicios
- Obtener detalle con precio de tienda
- Filtrar por tienda

### BarberoService
- Obtener barberos de tienda
- Ver disponibilidad
- Obtener calificación promedio

## Endpoints Actuales

### Usuarios
- `POST /api/usuarios/register` - Crear usuario
- `POST /api/usuarios/login` - Autenticación

### Citas
- `GET /api/citas` - Listar mis citas
- `GET /api/citas/:id` - Obtener cita
- `POST /api/citas` - Crear cita
- `PUT /api/citas/:id` - Actualizar cita
- `DELETE /api/citas/:id` - Cancelar cita

### Clientes
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/:id` - Obtener cliente

### Barberos
- `GET /api/barberos` - Listar barberos
- `GET /api/barberos/:id` - Obtener barbero

### Servicios
- `GET /api/servicios` - Listar servicios
- `GET /api/servicios/:id` - Obtener servicio

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
