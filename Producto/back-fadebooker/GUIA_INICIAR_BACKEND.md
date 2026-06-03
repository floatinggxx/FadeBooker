## 🚀 GUÍA COMPLETA: Cómo Iniciar el Backend de FadeBooker

> **Última actualización:** 3 de Junio de 2026  
> **Versión:** 1.0

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Estructura del Backend](#estructura-del-backend)
3. [Proceso de Inicialización Paso a Paso](#proceso-de-inicialización-paso-a-paso)
4. [Comandos Principales](#comandos-principales)
5. [Solución de Problemas](#solución-de-problemas)
6. [Verificación de que Todo Funciona](#verificación-de-que-todo-funciona)

---

## ✅ Requisitos Previos

Antes de iniciar el backend, verifica que tienes:

### 1️⃣ **Node.js (v18 o superior)**
```powershell
node --version  # Deberías ver v18.x.x o superior
npm --version   # Deberías ver 9.x.x o superior
```

### 2️⃣ **Variables de Entorno Configuradas**
El archivo `.env` debe estar en:
```
Producto/back-fadebooker/.env
```

**Contenido obligatorio:**
```ini
# Base de Datos (Azure SQL)
DB_SERVER=fadebooker-server-v2.database.windows.net
DB_DATABASE=FadeBooker_DB
DB_USER=adminuser
DB_PASSWORD=F4deBooker.2026
DB_PORT=1433

# Servidor
PORT=3000
NODE_ENV=development
```

### 3️⃣ **Dependencias Instaladas**
```powershell
cd Producto/back-fadebooker
npm install
```

---

## 📁 Estructura del Backend

```
back-fadebooker/
├── src/
│   ├── index.js                 ← 🎯 PUNTO DE ENTRADA (lo que ejecuta npm start)
│   ├── app.js                   ← Configuración de Express
│   ├── domain/                  ← Lógica de negocio
│   ├── application/             ← Servicios y casos de uso
│   ├── infrastructure/          ← Base de datos, APIs externas
│   └── interfaces/
│       └── http/
│           ├── routes/          ← Rutas de la API
│           ├── controllers/     ← Manejadores de requests
│           └── middlewares/     ← CORS, autenticación, etc.
├── package.json                 ← Scripts y dependencias
├── .env                         ← Variables de entorno
└── node_modules/                ← Dependencias instaladas (494 carpetas)
```

---

## 🔧 Proceso de Inicialización Paso a Paso

### **PASO 1: Abre PowerShell**
```powershell
# Abre PowerShell como usuario normal (NO necesitas admin)
```

### **PASO 2: Navega a la carpeta del Backend**
```powershell
cd "c:\Users\Steve\Desktop\GitHub\FadeBooker\Producto\back-fadebooker"

# Verifica que estés en la carpeta correcta:
pwd  # Debería mostrar: C:\Users\Steve\Desktop\GitHub\FadeBooker\Producto\back-fadebooker
```

### **PASO 3: Verifica que las dependencias estén instaladas**
```powershell
# Esto toma 30-60 segundos la primera vez
# Las siguientes veces es instantáneo (porque está cacheado)
npm install

# Output esperado:
# up to date, audited 494 packages in 10s
```

**❓ ¿Qué hace `npm install`?**
- Lee el archivo `package.json`
- Descarga TODAS las librerías necesarias (Express, bcrypt, Mercado Pago, Azure SQL, etc.)
- Las guarda en la carpeta `node_modules/`
- Crea un archivo `package-lock.json` para garantizar versiones exactas

### **PASO 4: Inicia el Backend**
```powershell
npm start

# Output esperado:
# 🚀 [STARTUP] Iniciando FadeBooker Backend...
# 🕒 [STARTUP] Timestamp: 2026-06-03T18:48:28.928Z
# 🛠️ [STARTUP] Cargando aplicación (app.js)...
# 🔧 Inicializando Knex para el entorno: development
# ✅ Cloudinary configurado correctamente
# 🛠️ [STARTUP] Intentando escuchar en puerto: 3000
# 🛠️ [STARTUP] DB_SERVER configurado: SÍ
# ✅✅✅ [SUCCESS] SERVIDOR CORRIENDO EN PUERTO 3000 ✅✅✅
# ✅ Conexión a la base de datos verificada (Azure SQL)
```

### **PASO 5: Verifica que el Backend está funcionando**
Abre una **SEGUNDA terminal** y ejecuta:
```powershell
curl http://localhost:3000

# Output esperado:
# {"status":"up","message":"FadeBooker Backend is alive"}
```

---

## 💻 Comandos Principales

| Comando | Qué hace | Duración |
|---------|----------|----------|
| `npm install` | Instala/actualiza todas las dependencias | 30-60 seg (primera vez)<br>2-5 seg (siguientes) |
| `npm start` | **INICIA EL BACKEND** (lo que necesitas) | Permanente (hasta que lo cierres) |
| `npm test` | Ejecuta pruebas unitarias | 10-20 seg |
| `npm run test:unit` | Solo pruebas de unidad | 5-10 seg |
| `npm run test:integration` | Pruebas de integración | 15-30 seg |

---

## ⚠️ Solución de Problemas

### ❌ Error: `Port 3000 already in use`

**Causa:** Otro proceso ya está usando el puerto 3000

**Soluciones:**

#### Opción A: Cambiar el puerto
```powershell
# En Windows PowerShell, ejecuta:
$env:PORT=3001
npm start

# O directamente:
npm start -- --port 3001
```

#### Opción B: Matar el proceso que usa el puerto
```powershell
# Encuentra qué proceso usa el puerto 3000
netstat -ano | findstr :3000

# Output: TCP    127.0.0.1:3000    0.0.0.0:0    LISTENING    12345
# Ese número (12345) es el PID

# Mata el proceso:
taskkill /PID 12345 /F

# Luego intenta npm start de nuevo
npm start
```

---

### ❌ Error: `Cannot find module 'express'`

**Causa:** Las dependencias no están instaladas

**Solución:**
```powershell
npm install

# Si sigue fallando:
rm -r node_modules package-lock.json  # Elimina todo
npm install                            # Reinstala desde cero
npm start
```

---

### ❌ Error: `Cannot connect to database`

**Causa:** Las variables de entorno no están bien configuradas

**Solución:**

1. Verifica que `.env` existe:
```powershell
Test-Path .env  # Debería mostrar "True"
```

2. Verifica el contenido:
```powershell
Get-Content .env
```

3. Verifica conexión a la base de datos directamente:
```powershell
# Instala sqlcmd si no lo tienes:
choco install sqlcmd -y

# Intenta conectar:
sqlcmd -S fadebooker-server-v2.database.windows.net -U adminuser -P "F4deBooker.2026" -d FadeBooker_DB
```

---

### ❌ Error: `Cannot find module 'dotenv'`

**Causa:** El .env no se está cargando correctamente

**Solución:**
```powershell
# Asegúrate de estar en la carpeta correcta:
pwd  # Debe mostrar: ...back-fadebooker

# Reinstala dotenv:
npm install dotenv

npm start
```

---

## ✅ Verificación de que Todo Funciona

### **Checklist Final**

```powershell
# 1️⃣ Verifica que Node.js está instalado
node --version

# 2️⃣ Navega a la carpeta correcta
cd "c:\Users\Steve\Desktop\GitHub\FadeBooker\Producto\back-fadebooker"
pwd

# 3️⃣ Verifica que .env existe
Test-Path .env

# 4️⃣ Instala dependencias
npm install

# 5️⃣ Inicia el backend
npm start

# 6️⃣ Abre OTRA terminal y verifica respuesta
curl http://localhost:3000
```

### **Si ves esto, TODO está correcto ✅**

**Terminal 1 (Backend):**
```
✅✅✅ [SUCCESS] SERVIDOR CORRIENDO EN PUERTO 3000 ✅✅✅
✅ Conexión a la base de datos verificada (Azure SQL)
```

**Terminal 2 (Verificación):**
```
{"status":"up","message":"FadeBooker Backend is alive"}
```

---

## 🔐 Explicación: Qué Ocurre Cuando Ejecutas `npm start`

### **Línea por línea:**

```
npm start
    ↓
Lee package.json → "start": "node src/index.js"
    ↓
Ejecuta: node src/index.js
    ↓
src/index.js carga:
    ├─ Captura errores no manejados
    ├─ Carga src/app.js (Express)
    ├─ app.js carga:
    │   ├─ dotenv → Lee variables de .env
    │   ├─ express → Crea servidor HTTP
    │   ├─ routes → Carga rutas (/api/usuarios, /api/citas, etc.)
    │   └─ CORS → Permite peticiones desde el frontend
    ├─ Se conecta a Azure SQL (usando credenciales del .env)
    └─ Escucha en puerto 3000
        ↓
    🚀 Backend listo para recibir peticiones
```

---

## 📊 Diagrama de Ejecución

```
PowerShell
    ↓
npm start
    ↓
┌─────────────────────────────────────┐
│   src/index.js                      │
│  ├─ Carga app.js                    │
│  ├─ Configura errores globales      │
│  └─ Inicia servidor en puerto 3000  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   src/app.js                        │
│  ├─ Carga .env (variables)          │
│  ├─ Configura Express               │
│  ├─ Carga rutas                     │
│  └─ Configura CORS                  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│   Base de Datos (Azure SQL)         │
│  ├─ Conexión verificada             │
│  └─ Listo para queries              │
└─────────────────────────────────────┘
    ↓
✅ Backend listo en http://localhost:3000
```

---

## 🎯 Resumen de Pasos (Quick Reference)

```powershell
# SIEMPRE usa estos pasos en este ORDEN:

# 1. Navega a la carpeta
cd "c:\Users\Steve\Desktop\GitHub\FadeBooker\Producto\back-fadebooker"

# 2. Instala dependencias (solo si no has hecho npm install antes)
npm install

# 3. Inicia el backend
npm start

# 4. Verifica en otra terminal
curl http://localhost:3000

# 5. Ver documentación de la API
http://localhost:3000/api-docs
```

---

## 📚 Archivos Clave del Backend

| Archivo | Propósito | Si falla... |
|---------|-----------|------------|
| `src/index.js` | Punto de entrada | Backend no inicia |
| `src/app.js` | Configuración Express | Rutas no funcionan |
| `.env` | Variables de entorno | No conecta a BD |
| `package.json` | Dependencias | `npm install` no funciona |
| `src/interfaces/http/routes` | Definición de endpoints | API no responde |

---

## 💡 Pro Tips

### **1. Mantén el Backend Corriendo**
Una vez que ejecutes `npm start`, déjalo corriendo en una terminal.
No lo cierres mientras estés desarrollando.

### **2. Si Cambias Código**
- Cambia en cualquier archivo del backend
- El servidor se reinicia automáticamente (gracias a hot-reload)
- No necesitas hacer `npm start` de nuevo

### **3. Ver Logs en Tiempo Real**
Mientras el backend está corriendo, ves en la terminal:
```
[2026-06-03T18:50:12.345Z] GET /api/usuarios
[2026-06-03T18:50:13.456Z] POST /api/citas
[2026-06-03T18:50:14.567Z] PUT /api/usuarios/5
```

### **4. Combinar Backend + Frontend**
Terminal 1:
```powershell
cd back-fadebooker
npm start  # Backend en puerto 3000
```

Terminal 2:
```powershell
cd front-fadebooker
npm run dev  # Frontend en puerto 5173
```

Ambos corren simultáneamente. El frontend hace peticiones al backend.

---

## ✨ Conclusión

El backend funciona mediante:

1. **`npm install`** → Instala las herramientas necesarias
2. **`npm start`** → Ejecuta `src/index.js` que inicia todo
3. **Puerto 3000** → El servidor escucha aquí
4. **`.env`** → Proporciona las credenciales y configuración

Si sigues estos pasos, **siempre funcionará correctamente** ✅

---

*¿Preguntas? Revisa la sección "Solución de Problemas" o contacta al equipo.*
