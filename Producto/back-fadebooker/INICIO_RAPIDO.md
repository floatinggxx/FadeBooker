# ⚡ INICIO RÁPIDO: Backend FadeBooker

## 🎯 Resumen en 1 Minuto

```bash
# Terminal PowerShell

cd "c:\Users\Steve\Desktop\GitHub\FadeBooker\Producto\back-fadebooker"

npm install    # ← Una sola vez (o cuando cambies dependencias)

npm start      # ← ESTO es lo que necesitas para trabajar
```

**Resultado esperado:**
```
✅✅✅ [SUCCESS] SERVIDOR CORRIENDO EN PUERTO 3000 ✅✅✅
✅ Conexión a la base de datos verificada (Azure SQL)
```

---

## 📊 ¿Qué Hace Cada Comando?

### `npm install` 🔧
**Propósito:** Instalar/actualizar todas las dependencias necesarias

| Aspecto | Detalle |
|--------|---------|
| **Función** | Lee `package.json` y descarga todas las librerías |
| **Duración** | 30-60 seg (primera vez)<br>2-5 seg (siguientes) |
| **Cuándo usar** | Una sola vez<br>O cuando actualices `package.json` |
| **Qué genera** | Carpeta `node_modules/` (494 carpetas de código) |
| **Puedes ignorar** | Si `node_modules` ya existe y no cambiaste `package.json` |

**Depende:**
```
Express          → Framework HTTP
bcryptjs         → Encriptación de contraseñas
mssql/tedious    → Conexión a Azure SQL
jwt              → Tokens de autenticación
cloudinary       → Almacenamiento de imágenes
mercadopago      → Procesamiento de pagos
... y 30+ más
```

---

### `npm start` 🚀
**Propósito:** INICIAR EL BACKEND (esto es lo que SIEMPRE necesitas)

| Aspecto | Detalle |
|--------|---------|
| **Función** | Ejecuta `src/index.js`<br>Inicia servidor Express en puerto 3000 |
| **Duración** | Permanente (hasta que lo cierres con Ctrl+C) |
| **Cuándo usar** | Cada vez que quieras trabajar |
| **Acceso** | `http://localhost:3000` |
| **API Docs** | `http://localhost:3000/api-docs` |
| **Health Check** | `http://localhost:3000` → `{"status":"up"}` |

**Lo que ocurre internamente:**
```
1. npm start
   ↓
2. Ejecuta: node src/index.js
   ↓
3. src/index.js carga src/app.js
   ↓
4. src/app.js:
   - Carga variables del .env (BD, puerto, etc.)
   - Configura Express HTTP server
   - Carga todas las rutas (/api/usuarios, /api/citas, etc.)
   - Configura CORS (permite peticiones del frontend)
   ↓
5. Se conecta a Azure SQL Database
   ↓
6. Escucha en puerto 3000
   ↓
✅ Backend LISTO para recibir peticiones
```

---

## 🔗 Conexión con el Frontend

```
Frontend (puerto 5173)     Backend (puerto 3000)     Azure SQL (Base de Datos)
    ↓                           ↓                             ↓
React app        →    Express API        →    Queries SQL
(fetch/axios)         (Node.js)              (Azure SQL Server)
```

**Ejemplo de petición:**
```javascript
// En el Frontend (React):
const response = await fetch('http://localhost:3000/api/usuarios');
// ↑ Va aquí ↑

// El backend recibe en:
// src/interfaces/http/routes/usuariosRoutes.js
// Procesa la lógica
// Consulta la BD
// Retorna los datos al frontend
```

---

## 🛑 Cuando Necesitas Restartear

| Situación | Acción |
|-----------|--------|
| Cambias código en `src/` | ❌ NO necesitas reiniciar (hot-reload) |
| Cambias variables en `.env` | ⚠️ SÍ necesitas reiniciar (`Ctrl+C` + `npm start`) |
| Cambias `package.json` | ⚠️ `npm install` + `npm start` |
| Puerto 3000 en uso | 🔄 Cámbialo: `$env:PORT=3001; npm start` |
| Error desconocido | 🔧 `Ctrl+C` → `npm start` nuevamente |

---

## 🎯 Troubleshooting Rápido

| Error | Solución |
|-------|----------|
| `Port 3000 already in use` | `$env:PORT=3001; npm start` |
| `Cannot find module 'express'` | `npm install` |
| `ENOENT: no such file or directory '.env'` | Verifica `.env` existe |
| `Cannot connect to database` | Verifica credenciales en `.env` |
| `npm: command not found` | Instala Node.js desde nodejs.org |

---

## 📝 Checklist Antes de Trabajar

- [ ] Abres PowerShell
- [ ] Navegas a: `Producto/back-fadebooker/`
- [ ] Ejecutas: `npm install` (solo primera vez)
- [ ] Ejecutas: `npm start`
- [ ] Ves: `✅ SERVIDOR CORRIENDO EN PUERTO 3000 ✅`
- [ ] Abres otra terminal y pruebas: `curl http://localhost:3000`
- [ ] Ves: `{"status":"up","message":"FadeBooker Backend is alive"}`
- [ ] ✅ TODO FUNCIONA

---

## 🔐 Archivo .env (Debe Existir)

**Ubicación:** `Producto/back-fadebooker/.env`

**Contenido requerido:**
```ini
DB_SERVER=fadebooker-server-v2.database.windows.net
DB_DATABASE=FadeBooker_DB
DB_USER=adminuser
DB_PASSWORD=F4deBooker.2026
DB_PORT=1433
PORT=3000
NODE_ENV=development
```

---

## 💻 Comando Completo (Copiar y Pegar)

```powershell
cd "c:\Users\Steve\Desktop\GitHub\FadeBooker\Producto\back-fadebooker"; npm install; npm start
```

---

## 🎓 Por Qué Necesitas npm install + npm start

**Analogía:**

Imagine que necesitas iniciar un coche:

1. **`npm install`** = Compramos todas las piezas del coche (motor, ruedas, etc.)
   - Se compran una sola vez
   - Se guardan en el garaje (`node_modules/`)

2. **`npm start`** = Encendemos el coche cada día
   - Lo hacemos cada vez que queremos conducir
   - Usa las piezas que compramos antes

Si no compras las piezas (`npm install`), no puedes encender el coche (`npm start`).

---

**¿Listo para trabajar? ⚡**

```powershell
npm start
```
