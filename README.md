# 🎭 FadeBooker

Plataforma de gestión de citas para servicios de barbería y fotografía relacional.

## 🚀 Estado del Proyecto
- **Backend:** 98% completo (Node.js + Arquitectura Hexagonal).
- **Frontend:** En migración a **Feature-Based Architecture** (React + Tailwind + Bootstrap).
- **Infraestructura:** Desplegado en Azure (App Service + SQL Server).

## 🛠️ Tecnologías Principales
- **Backend:** Node.js, Express, Knex.js, Zod, JWT.
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React.
- **Servicios:** Cloudinary (Imágenes), Mercado Pago (Pagos), Azure (Cloud).

## 📂 Estructura del Proyecto
- `Producto/back-fadebooker/`: API REST siguiendo Arquitectura Hexagonal.
- `Producto/front-fadebooker/`: Cliente web React (Vite).
- `Documentación/`: Documentación técnica consolidada, diagramas ER y flujos.

## ⚙️ Configuración del Backend (.env)
Para el correcto funcionamiento de Cloudinary y la base de datos:
```env
DB_SERVER=...
CLOUDINARY_CLOUD_NAME=fadebooker
CLOUDINARY_UPLOAD_PRESET=fadebooker_uploads
...
```

## 🔗 Enlaces del Ecosistema
- **API Health:** [https://fadebooker-backend-ok.azurewebsites.net/api/health](https://fadebooker-backend-ok.azurewebsites.net/api/health)
- **Documentación API:** [Indice de Endpoints](Documentación/md-fuente/INDICE_ENDPOINTS.md)
- **Estado de Agentes:** [.github/AGENTS.md](.github/AGENTS.md)

---
*Este proyecto es parte del ecosistema FadeBooker para la automatización de barberías y servicios fotográficos.*

```bash
git clone <repositorio> FadeBooker
cd FadeBooker
```

2. Instalar dependencias del backend:

```bash
cd Producto/back-fadebooker
npm install
```

3. Instalar dependencias del frontend:

```bash
cd ../front-fadebooker
npm install
```

## Configuración de entorno

1. Copiar archivo de ejemplo del backend:

```bash
cd ../back-fadebooker
copy .env.example .env
```

2. Editar `.env` con los valores de la base de datos y servicios:

- `DB_SERVER`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `PORT`
- `NODE_ENV`
- `MP_ACCESS_TOKEN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `FRONTEND_URL`

3. En el frontend, si se usa la API local, no es necesario modificar nada. Si se ejecuta en otro servidor, crear o actualizar el archivo `.env` en `Producto/front-fadebooker/` con:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_URL=http://localhost:3000/api
```

## Ejecutar localmente

### Backend

```bash
cd Producto/back-fadebooker
npm start
```

El backend quedará disponible en `http://localhost:3000`.

### Frontend

```bash
cd Producto/front-fadebooker
npm run dev
```

El frontend quedará disponible en `http://localhost:5173`.

## Despliegue con Docker

### Backend

```bash
cd Producto/back-fadebooker
docker build -t fadebooker-backend .
docker run -d -p 3000:3000 --env-file .env fadebooker-backend
```

### Frontend

```bash
cd Producto/front-fadebooker
docker build -t fadebooker-frontend .
docker run -d -p 4173:4173 fadebooker-frontend
```

## Verificación

- Backend: `http://localhost:3000/api/health`
- Frontend: `http://localhost:5173`

## Notas finales

- El backend usa `dotenv` para cargar variables desde `.env`.
- La configuración de la base de datos está en `Producto/back-fadebooker/src/config/knexfile.js`.
- El frontend consume la API usando `import.meta.env.VITE_API_BASE_URL`.
