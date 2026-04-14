# 🔥 FadeBooker - Plataforma de Agendamiento de Citas para Barberías

## 📖 Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración Inicial](#configuración-inicial)
5. [Base de Datos](#base-de-datos)
6. [Ejecución del Proyecto](#ejecución-del-proyecto)
7. [Agentes de Desarrollo](#agentes-de-desarrollo)
8. [Documentación](#documentación)

---

## 🎯 Descripción General

**FadeBooker** es una plataforma de gestión de citas para barberías, similar a Uber Eats pero para servicios de barbería. La aplicación permite:

- 📅 Agendar citas con barberos específicos
- 💈 Recibir servicios de barbería (corte, afeitado, etc.)
- 💳 Procesar pagos/abonos por cita
- ⭐ Calificar y dejar reseñas
- 📋 Administrar agenda de barberos
- 🏪 Gestionar múltiples sucursales

**Versión:** 1.0.0  
**Estado:** 🔄 En Desarrollo  
**Última Actualización:** 14 de abril de 2026

---

## 🛠️ Tecnologías Utilizadas

### Backend
```
- Node.js 18+
- Express.js 5.2.1
- Knex.js 3.2.9 (Query Builder)
- Tedious 19.2.1 (SQL Server Driver)
- JavaScript (No TypeScript)
```

### Base de Datos
```
- Azure SQL Server
- Servidor: fadebooker-server.database.windows.net
- BD: FadeBooker_DB
- Usuario: adminuser
```

### Documentación & Diagramas
```
- Markdown
- Draw.io (diagramas)
- UML & Entity-Relationship Diagrams
```

### Herramientas de Desarrollo
```
- Git/GitHub
- NPM (gestor de paquetes)
- Knex CLI (migraciones)
- SQL Server Management Studio (opcional)
```

---

## 📁 Estructura del Proyecto

```
FadeBooker/
│
├── .github/
│   ├── INSTRUCCIONES_GLOBALES_ES.md    ← Instrucciones en ESPAÑOL
│   ├── copilot-instructions.md         ← Instrucciones en INGLÉS
│   ├── AGENTS.md                       ← Registro de agentes
│   ├── AGENTS_USER_GUIDE.md            ← Guía de uso de agentes
│   └── agents/                         ← Instrucciones por agente
│       ├── backend-agent.md
│       ├── database-agent.md
│       ├── documentation-agent.md
│       ├── diagram-agent.md
│       └── orchestrator-agent.md
│
├── Documentación/
│   ├── Documentos/
│   │   ├── Requerimientos.xlsx
│   │   ├── Historias Usuario.xlsx
│   │   ├── Diccionario de Datos.xlsx
│   │   ├── EDT (Estructura Desglosada del Trabajo).xlsx
│   │   ├── Plan de Pruebas FadeBooker.docx
│   │   ├── Matriz de pruebas BD.xlsx
│   │   ├── plan de calidad.docx
│   │   ├── MATRIZ DE RIESGOS DEL PROYECTO.docx
│   │   └── Acta de constitución.docx
│   └── Material complementario/
│       ├── FadeBooker_ER_3NF.drawio    (Diagrama Entidad-Relación)
│       ├── FadeBooker_Diagrama_Clase.pdf
│       ├── FadeBooker_Diagrama_ActividadesUML.png
│       ├── FadeBooker_Esquema de la arquitectura.png
│       ├── FadeBooker_CartaGantt.pdf
│       ├── Logical_Fadebooker.html
│       └── Relational_Fadebooker.html
│
├── Gestión/                            (Documentos de gestión)
│
├── Producto/
│   └── back-fadebooker/                ← Código Backend Principal
│       ├── src/
│       │   ├── app.js                  (Configuración de Express)
│       │   ├── application/
│       │   │   └── usecases/           (Servicios de negocio)
│       │   ├── config/
│       │   │   └── knexfile.js         (Config de BD - CRÍTICO)
│       │   ├── db/
│       │   │   └── knex.js             (Instancia de Knex)
│       │   ├── domain/
│       │   │   ├── entities/           (Modelos de datos)
│       │   │   ├── repositories/       (Interfaces de repos)
│       │   │   └── services/           (Lógica de negocio)
│       │   ├── infraestructure/
│       │   │   ├── database/           (Implementación de repos)
│       │   │   ├── payment/            (Stripe integration)
│       │   │   └── storage/            (Cloudinary integration)
│       │   └── interfaces/
│       │       └── http/
│       │           ├── controllers/    (Controladores)
│       │           └── routes/         (Definición de rutas)
│       ├── package.json
│       ├── index.js                    (Entry point)
│       └── docker-compose.yml
│
├── database/                           (Scripts SQL - próxima fase)
│   ├── scripts/
│   ├── migrations/
│   ├── seeds/
│   └── schemas/
│
├── BACKEND_FIXES_APPLIED.md            ← Reporte de correcciones aplicadas
├── PROJECT_STATUS.md                   (Estado del proyecto)
├── DASHBOARD.md                        (Dashboard de progreso)
└── README.md                           ← Este archivo

```

---

## ⚙️ Configuración Inicial

### 1. Clonar Repositorio
```bash
git clone https://github.com/tu-usuario/FadeBooker.git
cd FadeBooker/Producto/back-fadebooker
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env` en la raíz de `back-fadebooker/`:

```env
# Base de Datos
DB_SERVER=fadebooker-server.database.windows.net
DB_USER=adminuser
DB_PASSWORD=tu_password_aqui
DB_NAME=FadeBooker_DB
DB_PORT=1433

# Entorno
NODE_ENV=development

# API
API_PORT=3000
API_HOST=localhost

# Stripe (Pagos)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Cloudinary (Almacenamiento)
CLOUDINARY_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# JWT (Autenticación)
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRATION=24h
```

### 4. Verificar Conexión a Base de Datos
```bash
node -e "require('./src/db/knex').raw('SELECT 1').then(() => console.log('✅ Conectado a Azure SQL')).catch(err => console.error('❌ Error:', err.message))"
```

**Resultado esperado:**
```
✅ Conectado a Azure SQL
```

---

## 🗄️ Base de Datos

### Conexión
```
Servidor: fadebooker-server.database.windows.net
BD: FadeBooker_DB
Usuario: adminuser
```

### Tablas Principales (11 total)

| Tabla | Descripción | FK |
|-------|-------------|-----|
| **Usuario** | Base de datos de usuarios | - |
| **Barbero** | Barberos (extiende Usuario) | id_usuario → Usuario |
| **Cliente** | Clientes (extiende Usuario) | id_usuario → Usuario |
| **Tienda** | Ubicaciones de barberías | id_dueño → Usuario |
| **Servicio** | Catálogo de servicios | - |
| **ServicioTienda** | Relación M:M Servicio-Tienda | id_servicio, id_tienda |
| **Cita** | Registros de citas/reservas | id_cliente, id_barbero, id_servicio, id_tienda |
| **Pago** | Registro de pagos | id_cita |
| **Reseña** | Reseñas y calificaciones | id_cita, id_usuario |
| **AuditoriaCancelacion** | Auditoría de cancelaciones | - |
| **AuditoriaPreciosServicio** | Auditoría de cambios de precios | - |

### Esquema ER
Ver diagrama en: `Documentación/Material complementario/FadeBooker_ER_3NF.drawio`

---

## 🚀 Ejecución del Proyecto

### Modo Desarrollo
```bash
npm run dev
# o
npm start
```

**Resultado esperado:**
```
✅ Servidor ejecutándose en http://localhost:3000
✅ Base de datos conectada: FadeBooker_DB
```

### Endpoints Disponibles

#### Usuarios
```
POST   /api/usuarios                  - Registrar usuario
POST   /api/usuarios/login             - Iniciar sesión
GET    /api/usuarios/:id               - Obtener usuario
PUT    /api/usuarios/:id               - Actualizar usuario
DELETE /api/usuarios/:id               - Eliminar usuario
```

#### Barberos
```
GET    /api/barberos                  - Listar barberos
GET    /api/barberos/:id              - Obtener detalle de barbero
GET    /api/barberos/:id/availability - Horario disponible de barbero
PUT    /api/barberos/:id              - Actualizar barbero
```

#### Clientes
```
GET    /api/clientes                  - Listar clientes
POST   /api/clientes                  - Crear cliente
PUT    /api/clientes/:id              - Actualizar cliente
DELETE /api/clientes/:id              - Eliminar cliente
```

#### Citas
```
POST   /api/citas                     - Agendar cita
GET    /api/citas/:id                 - Obtener detalle de cita
GET    /api/citas                     - Listar mis citas
PUT    /api/citas/:id                 - Modificar cita
DELETE /api/citas/:id                 - Cancelar cita
GET    /api/barberos/:id/availability - Verificar disponibilidad
```

#### Servicios
```
GET    /api/servicios                 - Listar servicios
GET    /api/servicios/:id             - Obtener servicio
GET    /api/servicios/por-tienda/:id  - Servicios de tienda
POST   /api/servicios                 - Crear servicio
```

### Tests
```bash
npm test              # Ejecutar todos los tests
npm run test:watch   # Modo watch
npm run test:coverage # Coverage report
```

---

## 🤖 Agentes de Desarrollo

El proyecto utiliza agentes especializados coordinados por un Orchestrator:

| Agente | Responsabilidad | Ubicación |
|--------|-----------------|-----------|
| **Database Agent** | Esquema BD, tablas, índices | `.github/agents/database-agent.md` |
| **Backend Agent** | Endpoints, servicios, modelos | `.github/agents/backend-agent.md` |
| **Documentation Agent** | API docs, guías, commentarios | `.github/agents/documentation-agent.md` |
| **Diagram Agent** | Diagramas ER, UML, arquitectura | `.github/agents/diagram-agent.md` |
| **Orchestrator Agent** | Coordinación, validación, sprints | `.github/agents/orchestrator-agent.md` |

### Invocación de Agentes
```markdown
@database-agent: Crear tabla Reseña con campos...
@backend-agent: Implementar endpoint POST /api/reseñas
@documentation-agent: Documentar API de Reseñas
@diagram-agent: Actualizar diagrama ER con tabla Reseña
@orchestrator-agent: Validar coherencia entre BD, Backend y Docs
```

---

## 📚 Documentación

### Documentos Clave
- **Base de Datos:** [ESPECIFICACION_BD.md](Documentación/ESPECIFICACION_BD.md)
- **Backend:** [BACKEND_FIXES_APPLIED.md](BACKEND_FIXES_APPLIED.md)
- **Requerimientos:** Documentación/Documentos/Requerimientos.xlsx
- **Historias Usuario:** Documentación/Documentos/Historias Usuario.xlsx
- **API Reference:** (Próximo a generar)
- **Guía de Instalación:** Este archivo

### Diagramas
- **Entity-Relationship:** `Documentación/Material complementario/FadeBooker_ER_3NF.drawio`
- **Diagrama de Clases:** `Documentación/Material complementario/FadeBooker_Diagrama_Clase.pdf`
- **Diagrama UML:** `Documentación/Material complementario/FadeBooker_Diagrama_ActividadesUML.png`
- **Arquitectura:** `Documentación/Material complementario/FadeBooker_Esquema de la arquitectura.png`

---

## 📋 Estado del Proyecto

**Fase 1: Setupeo de Agentes** ✅ COMPLETADA
- ✅ Instrucciones de agentes configuradas
- ✅ Backend conectado a Azure SQL
- ✅ Modelos de datos expandidos
- ✅ Repositorios corregidos

**Fase 2: Implementación** 🔄 EN PROGRESO
- ✅ Esquema BD validado
- ✅ 5 errores críticos corregidos
- ⏳ Documentación de API en progreso
- ⏳ Tests de integración diseñados

**Fase 3: Testing** ⏳ PRÓXIMO
- Tests unitarios para servicios
- Tests de integración (API vs BD)
- Tests de carga
- Coverage objetivo: 80%+

**Fase 4: Deployment** ⏳ FUTURO
- Setup en staging
- QA y validación
- Deployment en producción

---

## 🔍 Validación de Instalación

```bash
# 1. Verificar Node.js
node --version
# Esperado: v18+

# 2. Verificar NPM
npm --version
# Esperado: v9+

# 3. Instalar dependencias
npm install

# 4. Verificar conexión a BD
npm run test:db
# Esperado: ✅ Connected to FadeBooker_DB

# 5. Iniciar servidor
npm start
# Esperado: ✅ Server running on http://localhost:3000

# 6. Verificar endpoint
curl http://localhost:3000/api/usuarios
# Esperado: JSON response (puede ser error 401 si no hay auth, pero significa que API responde)
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar variables de entorno en .env
# Asegurar que credenciales son correctas
# Verificar conectividad de red a Azure

# Test de conexión
node -e "require('./src/db/knex').raw('SELECT 1').then(r => console.log('✅ OK')).catch(e => console.error('❌', e.message))"
```

### Error: "ENOENT: no such file or directory"
```bash
# Asegurar estar en directorio correcto
cd Producto/back-fadebooker

# Instalar dependencias nuevamente
npm install
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env o código
# O terminar proceso que usa el puerto
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

---

## 📞 Contacto & Soporte

- **Repositorio:** https://github.com/tu-usuario/FadeBooker
- **Issues:** Usar GitHub Issues
- **Documentación:** Ver carpeta `Documentación/`
- **Base de Datos:** Azure SQL Server `fadebooker-server.database.windows.net`

---

## 📜 Licencia

Este proyecto es propiedad de FadeBooker. Derechos reservados.

---

**Última actualización:** 14 de abril de 2026  
**Versión:** 1.0.0  
**Idioma:** 🇪🇸 ESPAÑOL
