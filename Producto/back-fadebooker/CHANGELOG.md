# Registro de Cambios - FadeBooker Backend

## Descripción General
Implementación completa de la arquitectura limpia/hexagonal para el backend de FadeBooker, un sistema de agendamiento de barberías.

---

## Cambios Realizados

### 1. **Correcciones Iniciales**

#### a) Estructura del Proyecto
- **Problema:** `package.json` apuntaba a `index.js` que no existía
- **Solución:** 
  - Creado archivo `index.js` en la raíz que importa `src/app.js`
  - Actualizado `src/app.js` para usar la ruta correcta de rutas

#### b) Configuración de Knex
- **Archivo:** `src/db/knex.js`
- **Cambio:** Arreglada la ruta de importación de `knexfile.js`
- **Ruta correcta:** `require('../config/knexfile')`

---

### 2. **Capa de Dominio - Entidades**

#### Archivos Creados/Actualizados:
- `src/domain/entities/usuario.model.js` - Base de todos los usuarios
- `src/domain/entities/cliente.model.js` - Hereda de Usuario (nombre, teléfono, dirección)
- `src/domain/entities/barbero.model.js` - Hereda de Usuario (especialidad, horario_disponible)
- `src/domain/entities/cita.model.js` - Modelo de citas
- `src/domain/entities/servicio.model.js` - Modelo de servicios
- `src/domain/entities/pago.model.js` - Modelo de pagos
- `src/domain/entities/resena.model.js` - Modelo de reseñas
- `src/domain/entities/tienda.model.js` - Modelo de tiendas
- `src/domain/entities/tienda.servicios.model.js` - Relación tienda-servicios

#### Estructura de Herencia:
```
Usuario (base)
├── Cliente (extends Usuario)
└── Barbero (extends Usuario)
```

---

### 3. **Capa de Dominio - Interfaces de Repositorio**

#### Archivos Creados:
- `src/domain/repositories/usuario.repository.js`
  - Métodos: `create()`, `findById()`, `findByEmail()`, `update()`, `delete()`, `findAll()`

- `src/domain/repositories/cliente.repository.js` (extends UsuarioRepository)
  - Métodos adicionales: `findByTelefono()`, `findByNombre()`, `actualizarPuntos()`

- `src/domain/repositories/barbero.repository.js` (extends UsuarioRepository)
  - Métodos adicionales: `findByEspecialidad()`, `actualizarHorario()`, `obtenerDisponibilidad()`

- `src/domain/repositories/cita.repository.js`
  - Métodos: `create()`, `findById()`, `findByClienteId()`, `findByBarberoId()`, `update()`, `delete()`, `findByFecha()`, `findByEstado()`

- `src/domain/repositories/servicio.repository.js`
  - Métodos: `create()`, `findById()`, `findByNombre()`, `update()`, `delete()`, `findAll()`, `findByTienda()`

---

### 4. **Capa de Infraestructura - Implementaciones de Repositorio**

#### Archivos Creados/Corregidos:
- `src/infraestructure/database/UsuarioRepositoryImpl.js`
  - **Problema corregido:** Typo en nombre de archivo (`UsuarioRespositoryImpl.js` → `UsuarioRepositoryImpl.js`)
  - **Mejora:** Agregado `constructor()` con `this.db` para acceso centralizado a Knex
  - Implementa CRUD completo con SQL Server

- `src/infraestructure/database/ClienteRepositoryImpl.js` (extends UsuarioRepositoryImpl)
  - Hereda métodos base
  - Implementa búsquedas específicas de cliente

- `src/infraestructure/database/BarberoRepositoryImpl.js` (extends UsuarioRepositoryImpl)
  - Hereda métodos base
  - Implementa búsquedas por especialidad y disponibilidad

- `src/infraestructure/database/CitaRepositoryImpl.js`
  - Agregado `constructor()` con `this.db`
  - Cambio: `db(tabla)` → `this.db(tabla)` en todos los métodos
  - Implementa CRUD y filtros por fecha, estado, cliente, barbero

- `src/infraestructure/database/ServicioRepositoryImpl.js`
  - Agregado `constructor()` con `this.db`
  - Cambio: `db(tabla)` → `this.db(tabla)` en todos los métodos
  - Implementa CRUD y búsquedas por tienda

---

### 5. **Capa de Aplicación - Servicios**

#### Archivos Creados/Actualizados:
- `src/application/usecases/usuario.service.js`
  - Cambio: Ahora usa `UsuarioRepositoryImpl` (concreto) en lugar de la interfaz
  - Métodos: `registrar()`, `login()`
  - Incluye validación de credenciales

- `src/application/usecases/cliente.service.js` (NUEVO)
  - Métodos: `crearCliente()`, `obtenerClientePorId()`, `obtenerClientePorEmail()`, `buscarClientePorNombre()`, `buscarClientePorTelefono()`, `obtenerTodosLosClientes()`, `actualizarCliente()`, `eliminarCliente()`, `actualizarPuntosCliente()`

- `src/application/usecases/barbero.service.js` (ACTUALIZADO)
  - Métodos: `crearBarbero()`, `obtenerBarberoPorId()`, `obtenerBarberoPorEmail()`, `buscarBarberosPorEspecialidad()`, `obtenerTodosLosBarberos()`, `actualizarBarbero()`, `eliminarBarbero()`, `actualizarHorarioBarbero()`, `obtenerDisponibilidadBarbero()`

- `src/application/usecases/cita.service.js` (ACTUALIZADO)
  - Cambio: Ahora usa `CitaRepositoryImpl` (concreto)
  - Métodos: `crearCita()`, `actualizarEstado()`, `obtenerCitaPorId()`, `obtenerCitasDelCliente()`, `obtenerCitasDelBarbero()`, `obtenerCitasPorEstado()`, `eliminarCita()`

- `src/application/usecases/servicio.service.js` (NUEVO)
  - Métodos: `crearServicio()`, `obtenerServicioPorId()`, `buscarServicioPorNombre()`, `obtenerTodosLosServicios()`, `actualizarServicio()`, `eliminarServicio()`, `obtenerServiciosPorTienda()`

---

### 6. **Capa de Interfaces - Controladores**

#### Archivos Creados/Actualizados:
- `src/interfaces/http/controllers/usuario.controller.js`
  - Cambio: Actualizada ruta de importación del servicio
  - Endpoints: POST `/register`, POST `/login`
  - Manejo de errores con códigos HTTP apropiados (401, 400)

- `src/interfaces/http/controllers/cliente.controller.js` (NUEVO)
  - Métodos: `crear()`, `obtenerPorId()`, `obtenerPorEmail()`, `buscarPorNombre()`, `buscarPorTelefono()`, `obtenerTodos()`, `actualizar()`, `eliminar()`, `actualizarPuntos()`
  - Validación de recursos encontrados (404)

- `src/interfaces/http/controllers/barbero.controller.js` (NUEVO)
  - Métodos: `crear()`, `obtenerPorId()`, `obtenerPorEmail()`, `buscarPorEspecialidad()`, `obtenerTodos()`, `actualizar()`, `eliminar()`, `actualizarHorario()`, `obtenerDisponibilidad()`

- `src/interfaces/http/controllers/cita.controller.js` (ACTUALIZADO)
  - Cambio: Actualizada ruta de importación del servicio para usar `application/usecases`

- `src/interfaces/http/controllers/servicio.controller.js` (NUEVO)
  - Métodos: `crear()`, `obtenerPorId()`, `buscarPorNombre()`, `obtenerTodos()`, `actualizar()`, `eliminar()`, `obtenerPorTienda()`

---

### 7. **Capa de Interfaces - Rutas**

#### Archivos Creados/Actualizados:
- `src/interfaces/http/routes/index.js` (ACTUALIZADO)
  - Cambio: Rutas actualizadas de `modulos/` a directorio actual
  - Agregadas nuevas rutas: `/clientes`, `/barberos`, `/servicios`
  - Prefijo global: `/api`

- `src/interfaces/http/routes/usuario.routes.js` (SIN CAMBIOS)
  - `POST /api/usuarios/register`
  - `POST /api/usuarios/login`

- `src/interfaces/http/routes/cliente.routes.js` (NUEVO)
  - `POST /api/clientes` - Crear cliente
  - `GET /api/clientes` - Obtener todos
  - `GET /api/clientes/:id` - Obtener por ID
  - `GET /api/clientes/email/:email` - Obtener por email
  - `GET /api/clientes/telefono/:telefono` - Obtener por teléfono
  - `GET /api/clientes/buscar` - Buscar por nombre (query)
  - `PUT /api/clientes/:id` - Actualizar
  - `PUT /api/clientes/:id/puntos` - Actualizar puntos
  - `DELETE /api/clientes/:id` - Eliminar

- `src/interfaces/http/routes/barbero.routes.js` (NUEVO)
  - `POST /api/barberos` - Crear barbero
  - `GET /api/barberos` - Obtener todos
  - `GET /api/barberos/:id` - Obtener por ID
  - `GET /api/barberos/email/:email` - Obtener por email
  - `GET /api/barberos/especialidad/:especialidad` - Buscar por especialidad
  - `GET /api/barberos/:id/disponibilidad/:fecha` - Obtener disponibilidad
  - `PUT /api/barberos/:id` - Actualizar
  - `PUT /api/barberos/:id/horario` - Actualizar horario
  - `DELETE /api/barberos/:id` - Eliminar

- `src/interfaces/http/routes/cita.routes.js` (ACTUALIZADO)
  - Cambio: Actualizada ruta de importación del controlador
  - `POST /api/citas` - Crear cita
  - `PUT /api/citas/:id/estado` - Cambiar estado

- `src/interfaces/http/routes/servicio.routes.js` (NUEVO)
  - `POST /api/servicios` - Crear servicio
  - `GET /api/servicios` - Obtener todos
  - `GET /api/servicios/:id` - Obtener por ID
  - `GET /api/servicios/buscar` - Buscar por nombre (query)
  - `GET /api/servicios/tienda/:id_tienda` - Obtener por tienda
  - `PUT /api/servicios/:id` - Actualizar
  - `DELETE /api/servicios/:id` - Eliminar

---

### 8. **Archivo Principal de la Aplicación**

#### `src/app.js` (ACTUALIZADO)
- Cambio: Ruta de `rutes` a `interfaces/http/routes`
- Middleware JSON agregado
- Prefijo `/api` para todas las rutas
- Puerto: 3000
- Export del módulo para testing

#### `index.js` (NUEVO)
- Archivo de entrada para `npm start`
- Importa y ejecuta `src/app.js`
- Permite ejecutar `node index.js` desde la raíz

---

### 9. **Archivos de Configuración**

#### `.github/copilot-instructions.md` (NUEVO)
- Documentación de instrucciones para Copilot
- Descripción de la arquitectura
- Guía de convenciones del proyecto
- Problemas conocidos y soluciones
- Cómo ejecutar cambios

---

## Resumen de Arquitectura Implementada

```
┌─────────────────────────────────────┐
│   Interfaces HTTP (Controllers)     │
│   usuario | cliente | barbero | ... │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  Application Layer (Services)       │
│  usuario | cliente | barbero | ...  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  Infrastructure (Repository Impl)   │
│  usuario | cliente | barbero | ...  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  Domain Layer (Interfaces)          │
│  usuario | cliente | barbero | ...  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  Database (Knex + SQL Server)       │
└─────────────────────────────────────┘
```

---

## Cómo Ejecutar el Proyecto

### Instalación de Dependencias
```bash
npm install
```

### Ejecutar el Servidor
```bash
npm start
# o
node index.js
```

El servidor estará disponible en `http://localhost:3000`

### Endpoints Disponibles

**Usuarios:**
- `POST /api/usuarios/register` - Registrar usuario
- `POST /api/usuarios/login` - Login de usuario

**Clientes:**
- `POST /api/clientes` - Crear cliente
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/:id` - Obtener cliente por ID
- `GET /api/clientes/email/:email` - Obtener cliente por email
- `GET /api/clientes/telefono/:telefono` - Obtener cliente por teléfono
- `GET /api/clientes/buscar?nombre=xyz` - Buscar clientes por nombre
- `PUT /api/clientes/:id` - Actualizar cliente
- `PUT /api/clientes/:id/puntos` - Actualizar puntos del cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

**Barberos:**
- `POST /api/barberos` - Crear barbero
- `GET /api/barberos` - Obtener todos los barberos
- `GET /api/barberos/:id` - Obtener barbero por ID
- `GET /api/barberos/email/:email` - Obtener barbero por email
- `GET /api/barberos/especialidad/:especialidad` - Buscar barberos por especialidad
- `GET /api/barberos/:id/disponibilidad/:fecha` - Obtener disponibilidad
- `PUT /api/barberos/:id` - Actualizar barbero
- `PUT /api/barberos/:id/horario` - Actualizar horario del barbero
- `DELETE /api/barberos/:id` - Eliminar barbero

**Citas:**
- `POST /api/citas` - Crear cita
- `PUT /api/citas/:id/estado` - Cambiar estado de la cita

**Servicios:**
- `POST /api/servicios` - Crear servicio
- `GET /api/servicios` - Obtener todos los servicios
- `GET /api/servicios/:id` - Obtener servicio por ID
- `GET /api/servicios/buscar?nombre=xyz` - Buscar servicios por nombre
- `GET /api/servicios/tienda/:id_tienda` - Obtener servicios por tienda
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

---

## Validaciones Realizadas

✅ Todos los archivos de repositorio fueron validados sin errores de sintaxis
✅ Todos los servicios fueron validados sin errores de sintaxis
✅ Todos los controladores fueron validados sin errores de sintaxis
✅ Todas las rutas fueron validadas sin errores de sintaxis
✅ El servidor inicia correctamente en puerto 3000

---

## Próximos Pasos Sugeridos

1. **Autenticación JWT** - Implementar tokens para endpoints protegidos
2. **Validación de Datos** - Usar `joi` o `express-validator`
3. **Manejo de Errores Global** - Middleware centralizado de errores
4. **Pruebas Unitarias** - Jest o Mocha
5. **Base de Datos** - Crear migraciones con Knex
6. **Variables de Entorno** - Usar `.env` con `dotenv`
7. **CORS** - Configurar para frontend
8. **Logging** - Implementar Winston o Morgan

---

## Notas Importantes

- La contraseña en `knexfile.js` debe protegerse con variables de entorno
- Asegurar que SQL Server esté corriendo en `127.0.0.1`
- Base de datos debe ser `fadebooker`
- Usar `npm nodemon` para desarrollo (instalar si no está)

---

**Fecha de Actualización:** 14 de Abril de 2026
**Versión:** 1.0.0
