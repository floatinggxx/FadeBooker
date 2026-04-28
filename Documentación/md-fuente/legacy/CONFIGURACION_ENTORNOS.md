# 🔐 Configuración de Entornos - FadeBooker

**Versión:** 1.0.0  
**Última actualización:** 21 de abril de 2026

---

## 📋 Tabla de Contenidos

1. [Setup Inicial](#setup-inicial)
2. [Backend (Node.js)](#backend-nodejs)
3. [Power Pages (PAC CLI)](#power-pages-pac-cli)
4. [Base de Datos](#base-de-datos)
5. [Frontend (React)](#frontend-react)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Inicial

### Requisitos Globales
```bash
# Node.js 16+ (verificar)
node --version
npm --version

# Power Apps CLI (PAC)
npm install -g @microsoft/powerplatform-cli

# Git
git --version
```

---

## 🔧 Backend (Node.js)

### 1. Instalación
```bash
# Navegar a carpeta del backend
cd Producto/back-fadebooker

# Instalar dependencias
npm install
```

### 2. Configuración de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus credenciales
# Windows (Notepad)
notepad .env

# macOS/Linux (Vi/Nano)
nano .env
```

### 3. Variables de Entorno Requeridas
```env
# 🔐 BASE DE DATOS (REQUERIDO)
DB_SERVER=fadebooker-server.database.windows.net
DB_NAME=FadeBooker_DB
DB_USER=adminuser
DB_PASSWORD=Tu_Password_Aqui
DB_PORT=1433

# 🌐 SERVIDOR (REQUERIDO)
PORT=3000
NODE_ENV=development

# ☁️  CLOUDINARY (OPCIONAL para desarrollo)
CLOUDINARY_CLOUD_NAME=Fadebooker
CLOUDINARY_API_KEY=267983583352493
CLOUDINARY_API_SECRET=yy5bfkweC0cJ9Gas8wX_5ItOPPI
CLOUDINARY_UPLOAD_PRESET=fadebooker_uploads
```

### 4. Ejecutar Backend
```bash
# Modo desarrollo (con reinicio automático)
npm start

# Resultado esperado:
# ✅ Servidor corriendo en http://localhost:3000
```

### 5. Verificar Endpoints
```bash
# Health check
curl http://localhost:3000/api

# Obtener barberos
curl http://localhost:3000/api/barberos

# Obtener servicios
curl http://localhost:3000/api/servicios
```

---

## 🎨 Power Pages (PAC CLI)

### 1. Autenticación

#### Paso 1: Crear/Abrir Conexión
```bash
# Crear nueva autenticación
pac auth create --environment 28237aaa-b826-ecc1-87ab-5a19fc954e19

# O listar autenticaciones existentes
pac auth list
```

**Notas:**
- El ID de entorno: `28237aaa-b826-ecc1-87ab-5a19fc954e19`
- Power Pages requiere permisos de admin
- Te pedirá tu cuenta Microsoft

#### Paso 2: Verificar Autenticación
```bash
# Ver conexión actual
pac auth show

# Cambiar a diferente entorno (si tienes múltiples)
pac auth change --environment ENVIRONMENT_ID
```

---

### 2. Descargar Sitio

#### Desde Repositorio (Primera vez o después de cambios en servidor)
```bash
# Descargar con overwrite (reemplazar archivos locales)
pac pages download --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2 \
  --overwrite

# O sin overwrite (mantener cambios locales)
pac pages download --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2
```

**Parámetros:**
- `--path`: Carpeta local donde descargar
- `--webSiteId`: ID de tu sitio Power Pages
- `--modelVersion`: 2 (actual estándar)
- `--overwrite`: Reemplazar archivos locales

**Resultado:**
```
Descargar en: ./pages-fadebooker
Total archivos: ~150+ (configuración YAML + web files)
Tamaño: ~5-10 MB
```

---

### 3. Editar Sitio Localmente

#### Estructura de Archivos
```
pages-fadebooker/fadebooker/
├── web-pages/                    (Páginas HTML/Liquid)
│   ├── búsqueda/
│   ├── reserva-cita/
│   ├── mi-cuenta/
│   └── ...
│
├── web-files/                    (Assets: JS, CSS, imágenes)
│   ├── react/                    (NEW - Componentes React)
│   │   ├── api-service.js
│   │   ├── components/
│   │   └── styles.css
│   ├── bootstrap.min.css
│   ├── theme.css
│   └── FadeBooker_Logo.jpg
│
├── content-snippets/             (Fragmentos reutilizables)
│   ├── header/
│   ├── footer/
│   └── navbar/
│
└── *.yml                         (Configuración metadata)
    ├── website.yml
    ├── webpagerule.yml
    └── ...
```

#### Agregar Componentes React
```bash
# 1. Crear carpeta de React components
mkdir pages-fadebooker/fadebooker/web-files/react

# 2. Copiar archivos (ver REACT_INTEGRATION_GUIDE.md)
cp src/api-service.js pages-fadebooker/fadebooker/web-files/react/
cp dist/components.bundle.js pages-fadebooker/fadebooker/web-files/react/

# 3. Editar página HTML para incluir React
# Ver ejemplos en /búsqueda/, /reserva-cita/, etc.
```

#### Ejemplo: Agregar React a una página
```html
<!-- pages-fadebooker/fadebooker/web-pages/búsqueda/pagecopy.aspx -->
<div id="react-root"></div>

<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Cargar nuestros componentes compilados -->
<script src="/web-files/react/api-service.js"></script>
<script src="/web-files/react/components.bundle.js"></script>
```

---

### 4. Subir Cambios a Power Pages

#### Subir todos los cambios
```bash
# Subir cambios a Power Pages
pac pages upload --path "./pages-fadebooker" --modelVersion 2

# O con verbose para ver detalle
pac pages upload --path "./pages-fadebooker" --modelVersion 2 --verbose
```

**Parámetros:**
- `--path`: Carpeta con cambios
- `--modelVersion`: 2 (debe coincidir con descarga)
- `--verbose`: Ver más detalles (RECOMENDADO)

**Resultado esperado:**
```
✅ Subiendo archivos...
✅ Validando cambios...
✅ 32 archivos actualizados
✅ Deployment completado exitosamente
🕐 Tiempo: ~30-60 segundos
```

---

### 5. Workflow Completo: Descargar → Editar → Subir

```bash
# ═══════════════════════════════════════════════════════════════
# PASO 1: DESCARGAR (Si hay cambios en servidor)
# ═══════════════════════════════════════════════════════════════
pac pages download --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2

echo "✅ Sitio descargado"

# ═══════════════════════════════════════════════════════════════
# PASO 2: EDITAR (Usar tu editor favorito)
# ═══════════════════════════════════════════════════════════════
# - Agregar componentes React
# - Modificar HTML/Liquid
# - Actualizar CSS
# - Añadir imágenes/assets

# Ejemplo: Agregar componente de búsqueda
# vim pages-fadebooker/fadebooker/web-pages/búsqueda/pagecopy.aspx

echo "✅ Cambios realizados"

# ═══════════════════════════════════════════════════════════════
# PASO 3: VERIFICAR CAMBIOS (GIT)
# ═══════════════════════════════════════════════════════════════
git status
git diff pages-fadebooker/

echo "✅ Cambios verificados"

# ═══════════════════════════════════════════════════════════════
# PASO 4: SUBIR A POWER PAGES
# ═══════════════════════════════════════════════════════════════
pac pages upload --path "./pages-fadebooker" --modelVersion 2

echo "✅ Cambios subidos a Power Pages"

# ═══════════════════════════════════════════════════════════════
# PASO 5: VERIFICAR EN NAVEGADOR
# ═══════════════════════════════════════════════════════════════
# Abrir: https://fadebooker.powerappsportals.com/
# Verificar cambios se vean reflejados

echo "✅ Deployment completado"
```

---

## 🗄️ Base de Datos

### Conexión Azure SQL Server

**Credenciales:**
```
Servidor: fadebooker-server.database.windows.net
Puerto: 1433
Base de Datos: FadeBooker_DB
Usuario: adminuser
Contraseña: [En .env]
```

### Herramientas para Conectar

#### 1. SQL Server Management Studio (SSMS)
```
1. Descargar: https://ssms.blob.core.windows.net/ssl/SSMS-Setup-ENU.exe
2. Conectar:
   - Server: fadebooker-server.database.windows.net
   - Authentication: SQL Server Authentication
   - Login: adminuser
   - Password: [Tu contraseña]
3. Expandir FadeBooker_DB → Tables
```

#### 2. Azure Data Studio
```
1. Descargar: https://go.microsoft.com/fwlink/?linkid=2215158
2. New Connection
3. Rellenar credenciales Azure
```

#### 3. VSCode SQL Database Projects
```
1. Instalar extension: Database Projects
2. New Project → SQL Database Project
3. Conectar a fadebooker-server
```

#### 4. CLI (T-SQL)
```bash
# Instalar sqlcmd
npm install -g sql-cli

# Conectar
sqlcmd -S fadebooker-server.database.windows.net \
       -U adminuser \
       -P "TuPassword" \
       -d FadeBooker_DB

# Ejecutar query
SELECT * FROM Usuario
GO
```

---

## 🎨 Frontend (React)

### Setup React en Power Pages

```bash
# 1. Ir a carpeta Power Pages
cd pages-fadebooker

# 2. Crear estructura React (si aún no existe)
mkdir -p fadebooker/web-files/react/components
mkdir -p fadebooker/web-files/react/services

# 3. Crear archivo API Service
cat > fadebooker/web-files/react/api-service.js << 'EOF'
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api'
  }
  
  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers
      },
      ...options
    })
    return response.json()
  }
  
  getBarbers() { return this.request('/barberos') }
  getServices() { return this.request('/servicios') }
  bookAppointment(data) { return this.request('/citas', { method: 'POST', body: JSON.stringify(data) }) }
}

window.ApiService = new ApiService()
EOF

echo "✅ API Service creado"

# 4. Incluir React en páginas (agregar a web-pages/*.aspx)
# Ver REACT_INTEGRATION_GUIDE.md para ejemplos
```

---

## ⚠️ Troubleshooting

### Backend no conecta a BD

```bash
# 1. Verificar credenciales en .env
cat .env | grep DB_

# 2. Verificar que BD está disponible
ping fadebooker-server.database.windows.net

# 3. Test de conexión en Node
node -e "
const knex = require('knex');
const db = knex({
  client: 'mssql',
  connection: {
    server: 'fadebooker-server.database.windows.net',
    database: 'FadeBooker_DB',
    user: 'adminuser',
    password: process.env.DB_PASSWORD,
    port: 1433,
    encrypt: true
  }
});
db.raw('SELECT 1').then(() => console.log('✅ Conectado')).catch(e => console.log('❌ Error:', e.message));
"
```

### PAC CLI errores de autenticación

```bash
# 1. Limpiar cache de autenticación
pac auth clear

# 2. Crear nueva conexión
pac auth create --environment 28237aaa-b826-ecc1-87ab-5a19fc954e19

# 3. Verificar permisos en Power Platform Admin Center
# https://admin.powerplatform.microsoft.com/
```

### React no carga en Power Pages

```bash
# 1. Verificar que archivos estén en web-files
ls -la pages-fadebooker/fadebooker/web-files/react/

# 2. Verificar que Power Pages subió los cambios
pac pages upload --path "./pages-fadebooker" --verbose

# 3. Limpiar cache del navegador
# Chrome/Edge: Ctrl+Shift+Delete → Limpiar datos de navegación

# 4. Ver errores en consola del navegador
# F12 → Console → Ver errores
```

### Conflictos de archivos al descargar

```bash
# Si tienes cambios locales y quieres mantenerlos:
git stash

# Descargar cambios del servidor
pac pages download --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2

# Aplicar tus cambios de nuevo
git stash pop

# Resolver conflictos manualmente
git merge --continue
```

---

## 🔗 Quick Reference Commands

```bash
# ═══════════════════════════════════════════════════════════════
# BACKEND
# ═══════════════════════════════════════════════════════════════
npm install              # Instalar dependencias
npm start               # Ejecutar servidor
npm test                # Ejecutar tests
npm test:watch          # Tests en modo watch

# ═══════════════════════════════════════════════════════════════
# POWER PAGES
# ═══════════════════════════════════════════════════════════════
pac auth create --environment 28237aaa-b826-ecc1-87ab-5a19fc954e19
pac pages download --path "./pages-fadebooker" --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 --modelVersion 2 --overwrite
pac pages upload --path "./pages-fadebooker" --modelVersion 2
pac auth list
pac auth clear

# ═══════════════════════════════════════════════════════════════
# GIT
# ═══════════════════════════════════════════════════════════════
git status              # Ver cambios
git add .               # Preparar cambios
git commit -m "msg"     # Guardar cambios
git push                # Subir a repositorio
```

---

## 📚 Recursos

- [Power Apps CLI Official Docs](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)
- [Power Pages Docs](https://learn.microsoft.com/en-us/power-pages/)
- [Azure SQL Server](https://learn.microsoft.com/en-us/azure/azure-sql/database/sql-database-paas-overview)
- [React 18 Documentation](https://react.dev)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

**Última actualización:** 21 de abril de 2026  
**Versión:** 1.0.0

