## 🏗️ Arquitectura del Sistema (Hexagonal / Clean Architecture)

FadeBooker utiliza una arquitectura hexagonal para separar la lógica de negocio de las implementaciones tecnológicas.

- **`/src/domain`**: Entidades y reglas de negocio puras.
- **`/src/application/usecases`**: Servicios que coordinan la lógica de la aplicación (Casos de Uso).
- **`/src/infraestructure`**: Adaptadores para herramientas externas.
  - `/database`: Implementación de repositorios con Knex.js.
  - `/storage`: Integración con Cloudinary.
- **`/src/interfaces/http`**: Controladores y rutas Express.js para la comunicación externa.

---

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo (si no existe .env)
cp .env.example .env

# Verificar que el archivo .env tenga tus credenciales
cat .env
```

### 3️⃣ Ejecutar el Servidor
```bash
npm start
```

**Resultado esperado:**
```
⚠️  Cloudinary no configurado (variables faltantes: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
   Cloudinary es OPCIONAL en desarrollo.
   Para habilitar uploads, configura las variables de entorno en .env
✅ Servidor corriendo en http://localhost:3000
```

---

## 📋 Archivo `.env` - Configuración

### Ubicación
```
Producto/back-fadebooker/.env
```

### Contenido Ejemplo
```env
# Database Configuration
DB_SERVER=fadebooker-server.database.windows.net
DB_NAME=FadeBooker_DB
DB_USER=adminuser
DB_PASSWORD=your_password_here
DB_PORT=1433

# Server Configuration
PORT=3000
NODE_ENV=development

# Cloudinary Configuration (OPCIONAL en desarrollo)
CLOUDINARY_URL=cloudinary://267983583352493:yy5bfkweC0cJ9Gas8wX_5ItOPPI@Fadebooker
CLOUDINARY_CLOUD_NAME=Fadebooker
CLOUDINARY_API_KEY=267983583352493
CLOUDINARY_API_SECRET=yy5bfkweC0cJ9Gas8wX_5ItOPPI
CLOUDINARY_UPLOAD_PRESET=fadebooker_uploads
```

### Descripción de Variables

#### Database
```
DB_SERVER      - Servidor SQL Server (Azure)
DB_NAME        - Nombre de la base de datos
DB_USER        - Usuario SQL Server
DB_PASSWORD    - Contraseña del usuario
DB_PORT        - Puerto SQL Server (default: 1433)
```

#### Server
```
PORT           - Puerto del servidor Express (default: 3000)
NODE_ENV       - Ambiente: development | production
                 En development: Cloudinary es OPCIONAL
                 En production: Cloudinary es REQUERIDO
```

#### Cloudinary
```
CLOUDINARY_URL           - URL completa de conexión (Formato: cloudinary://API_KEY:API_SECRET@CLOUD_NAME)
CLOUDINARY_CLOUD_NAME    - Nombre de tu cloud en Cloudinary
CLOUDINARY_API_KEY       - API Key de tu cuenta
CLOUDINARY_API_SECRET    - API Secret (CONFIDENCIAL)
CLOUDINARY_UPLOAD_PRESET - Preset para uploads sin firma
```

---

## 🛠️ Procesamiento de Documentos

El backend ahora soporta procesamiento de diversos formatos de documentos:
- **Excel (.xlsx):** vía `exceljs` (Alternativa segura a SheetJS)
- **Word (.docx):** vía `docx` y `mammoth` (extracción de texto)
- **PDF (.pdf):** vía `pdf-parse`

Asegúrate de tener estas dependencias instaladas (incluidas en `npm install`).

---

## ⚠️ Configuración de Cloudinary

### Estado: OPCIONAL en Desarrollo

Cloudinary es **OPCIONAL** en `NODE_ENV=development`.

**Significa:**
- ✅ El servidor INICIA correctamente sin Cloudinary
- ⚠️ Los endpoints de upload **fallarán** si se usan sin Cloudinary
- ℹ️ Perfecto para desarrollo sin necesidad de cuenta Cloudinary

### Habilitar Cloudinary

Si deseas habilitar Cloudinary en desarrollo, completa las credenciales en `.env`:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Luego, cuando inicies el servidor, verás:
```
✅ Cloudinary configurado correctamente
✅ Servidor corriendo en http://localhost:3000
```

---

## 🧪 Ejecutar Tests

### Todos los Tests
```bash
npm test
```

### Solo Tests Unitarios
```bash
npm run test:unit
```

### Solo Tests de Integración
```bash
npm run test:integration
```

### Con Watch (Re-ejecutar al cambiar código)
```bash
npm run test:watch
```

---

## 📊 Estructura de Carpetas

```
back-fadebooker/
├── src/
│   ├── app.js                    ← Punto de entrada
│   ├── config/
│   │   ├── knexfile.js          ← Config de Knex/BD
│   │   └── cloudinary.config.js ← Config de Cloudinary
│   ├── db/
│   │   └── knex.js              ← Instancia de Knex
│   ├── domain/
│   │   ├── entities/            ← Modelos
│   │   ├── repositories/        ← Interfaces
│   │   └── services/            ← Lógica de negocio
│   ├── infraestructure/
│   │   ├── database/            ← Implementación de repos
│   │   ├── payment/             ← Servicios de pago
│   │   └── storage/             ← Servicios de almacenamiento
│   └── interfaces/
│       └── http/
│           ├── controllers/     ← Controladores
│           └── routes/          ← Rutas de la API
├── tests/
│   ├── unit/                    ← Tests unitarios
│   ├── integration/             ← Tests de integración
│   └── setup.js                 ← Setup de Jest
├── .env                         ← Variables de entorno (NO SUBIR A GIT)
├── .env.example                 ← Ejemplo de variables (SUBIR A GIT)
├── package.json                 ← Dependencias
└── jest.config.js              ← Config de Jest
```

---

## 🔗 Endpoints Disponibles

### Health Check
```
GET /api
```

### Usuarios
```
POST   /api/usuarios             ← Registrar usuario
POST   /api/auth/login           ← Login
GET    /api/usuarios/:id         ← Obtener usuario
```

### Barberos
```
GET    /api/barberos             ← Listar barberos
GET    /api/barberos/:id         ← Obtener barbero
GET    /api/barberos/:id/servicios ← Servicios del barbero (v1.10.0)
POST   /api/barberos/:id/servicios ← Agregar servicio (v1.10.0)
DELETE /api/barberos/:id/servicios/:id_servicio ← Remover servicio (v1.10.0)
```

### Servicios
```
GET    /api/servicios            ← Listar servicios
GET    /api/servicios/:id        ← Obtener servicio
GET    /api/servicios/:id/barberos ← Barberos que hacen servicio (v1.10.0)
GET    /api/servicios/:id_barbero/:id_servicio/precio ← Precio efectivo (v1.10.0)
GET    /api/servicios/:id_barbero/:id_servicio/duracion ← Duración efectiva (v1.10.0)
```

### Citas
```
GET    /api/citas                ← Listar citas
POST   /api/citas                ← Agendar cita
GET    /api/citas/:id            ← Obtener cita
PUT    /api/citas/:id            ← Modificar cita
DELETE /api/citas/:id            ← Cancelar cita
```

### Uploads (Cloudinary)
```
POST   /api/upload/signature     ← Generar firma de upload
POST   /api/hairstyles/simulate  ← Simular corte de pelo
```

---

## 🐛 Troubleshooting

### ❌ "Cloudinary no está configurado"

**Problema:** Ves la advertencia al iniciar

**Solución:**
```bash
# 1. Verificar que .env existe
ls -la .env

# 2. Si no existe, copiar del ejemplo
cp .env.example .env

# 3. Editar .env y agregar tus credenciales de Cloudinary
nano .env  # o tu editor favorito

# 4. Reiniciar el servidor
npm start
```

### ❌ "Cannot find module 'dotenv'"

**Problema:** Las dependencias no están instaladas

**Solución:**
```bash
npm install
```

### ❌ "ECONNREFUSED - No se puede conectar a BD"

**Problema:** No hay conexión a Azure SQL Server

**Verificar:**
```bash
# 1. Variables de entorno correctas
cat .env

# 2. Conectividad a la BD (desde PowerShell)
Test-NetConnection fadebooker-server.database.windows.net -Port 1433

# 3. Usuario y contraseña correctos
```

### ❌ "Puerto 3000 ya está en uso"

**Problema:** Otro proceso usa el puerto 3000

**Soluciones:**
```bash
# Opción 1: Usar otro puerto
PORT=3001 npm start

# Opción 2: Matar el proceso que usa el puerto
netstat -ano | findstr :3000    # Ver PID
taskkill /PID 12345 /F          # Matar proceso
```

---

## 📝 Archivos de Configuración

### `.env` (NO SUBIR A GIT)
```
⚠️  CONFIDENCIAL
- Contiene credenciales
- Está en .gitignore
- Nunca hacer commit
```

### `.env.example` (SUBIR A GIT)
```
✅ Ejemplo seguro
- Valores de ejemplo
- Documentación de variables
- Guía para otros desarrolladores
```

---

## 🚀 Flujo Típico de Desarrollo

```bash
# 1. Primera vez
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm start

# 2. En siguientes ejecuciones
npm start

# 3. Ejecutar tests
npm test

# 4. Verificar código
npm run test:unit
npm run test:integration
```

---

## 📞 Variables de Entorno Mínimas

**Para iniciar el servidor:**
```env
PORT=3000
NODE_ENV=development
```

**Para conectar a BD:**
```env
DB_SERVER=fadebooker-server.database.windows.net
DB_NAME=FadeBooker_DB
DB_USER=adminuser
DB_PASSWORD=tu_password
```

**Para Cloudinary (OPCIONAL en desarrollo):**
```env
CLOUDINARY_CLOUD_NAME=tu_cloud
CLOUDINARY_API_KEY=tu_key
CLOUDINARY_API_SECRET=tu_secret
```

---

## ✅ Verificación de Setup

Después de `npm start`, deberías ver:

```
✅ Servidor corriendo en http://localhost:3000
```

O si Cloudinary no está configurado:

```
⚠️  Cloudinary no configurado (variables faltantes: ...)
   Cloudinary es OPCIONAL en desarrollo.
✅ Servidor corriendo en http://localhost:3000
```

**Ambos son correctos en desarrollo.**

---

## 📚 Documentación Relacionada

- [README_DOCS.md](README_DOCS.md) - Documentación del backend
- [DATABASE.md](DATABASE.md) - Schema de base de datos
- [TESTING.md](TESTING.md) - Guía de testing
- [openapi.yaml](openapi.yaml) - Especificación OpenAPI 3.0.0
- [CHANGELOG.md](CHANGELOG.md) - Cambios por versión

---

**¿Problemas? Revisa la sección de Troubleshooting o crea un issue en GitHub.**
