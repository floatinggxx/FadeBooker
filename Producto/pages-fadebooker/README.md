# 🎨 Power Pages Frontend - FadeBooker

**Versión:** 1.0.0  
**Fecha:** 21 de abril de 2026  
**Estado:** En configuración

---

## 📋 Tabla de Contenidos

1. [Inicio Rápido](#inicio-rápido)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Integración con React](#integración-con-react)
4. [Comandos PAC CLI](#comandos-pac-cli)
5. [Despliegue](#despliegue)

---

## 🚀 Inicio Rápido

### Requisitos
```bash
# Power Apps CLI (PAC)
npm install -g @microsoft/powerplatform-cli

# Git
git --version

# Node.js (opcional, solo si quieres compilar React localmente)
node --version
npm --version
```

### Primer Deploy

```bash
# 1️⃣ Autenticarse con Power Platform
pac auth create --environment 28237aaa-b826-ecc1-87ab-5a19fc954e19

# 2️⃣ Descargar sitio desde servidor
pac pages download --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2

# 3️⃣ Ver estado del proyecto
git status

# 4️⃣ Hacer cambios (ver abajo)
# - Editar HTML en web-pages/
# - Agregar componentes React en web-files/react/
# - Modificar CSS

# 5️⃣ Subir cambios
pac pages upload --path "./pages-fadebooker" --modelVersion 2

# 6️⃣ Verificar en navegador
# https://fadebooker.powerappsportals.com/
```

---

## 📁 Estructura del Proyecto

```
pages-fadebooker/
│
└── fadebooker/                          (Sitio Power Pages)
    │
    ├── 📄 web-pages/                   (Páginas HTML/Liquid)
    │   ├── página-principal/
    │   │   └── pagecopy.aspx.yml      (Home del sitio)
    │   │
    │   ├── búsqueda/
    │   │   └── pagecopy.aspx.yml      (Buscar barberos - React)
    │   │
    │   ├── reserva-cita/
    │   │   └── pagecopy.aspx.yml      (Booking citas - React)
    │   │
    │   ├── mi-cuenta/
    │   │   └── pagecopy.aspx.yml      (Perfil usuario - React)
    │   │
    │   ├── perfil-barbero/
    │   │   └── pagecopy.aspx.yml      (Perfil barbero - React)
    │   │
    │   ├── reseñas/
    │   │   └── pagecopy.aspx.yml      (Reviews - React)
    │   │
    │   ├── contacto/
    │   ├── sobre-nosotros/
    │   ├── preguntas-frecuentes/
    │   └── ...
    │
    ├── 🎨 web-files/                   (Assets públicos)
    │   │
    │   ├── react/                      (🆕 Componentes React)
    │   │   ├── api-service.js          (Cliente HTTP)
    │   │   ├── components/
    │   │   │   ├── SearchBarbers.js
    │   │   │   ├── BookingForm.js
    │   │   │   ├── UserProfile.js
    │   │   │   ├── ReviewCard.js
    │   │   │   └── BarberProfile.js
    │   │   └── styles.css              (Estilos React)
    │   │
    │   ├── 🆕 api-service.js           (Referencia principal)
    │   ├── bootstrap.min.css           (Bootstrap)
    │   ├── theme.css                   (Tema FadeBooker)
    │   ├── FadeBooker_Logo.jpg
    │   └── ...
    │
    ├── 📝 content-snippets/            (Fragmentos reutilizables)
    │   ├── header/
    │   │   └── snippets.yml           (Header compartido)
    │   ├── footer/
    │   │   └── snippets.yml           (Footer compartido)
    │   └── navbar/
    │       └── snippets.yml           (Navbar compartido)
    │
    └── ⚙️ Archivos de Configuración (.yml)
        ├── website.yml                 (Configuración del sitio)
        ├── webpagerule.yml             (Reglas de páginas)
        ├── weblink-sets/               (Menús y links)
        ├── webrole.yml                 (Roles de usuario)
        ├── websiteaccess.yml           (Control de acceso)
        └── ...
```

---

## 🧪 Integración con React

### 1. API Service (Cliente HTTP)

El archivo principal es `web-files/api-service.js`:

```html
<!-- Incluir en cualquier página -->
<script src="/web-files/api-service.js"></script>

<!-- Usar en JavaScript -->
<script>
  // Obtener barberos
  window.ApiService.getBarbers().then(barberos => {
    console.log('Barberos:', barberos)
  })

  // Login
  window.ApiService.login('user@example.com', 'password123')
    .then(({ token, user }) => {
      console.log('✅ Autenticado:', user)
    })

  // Agendar cita
  const citaData = {
    id_cliente: 1,
    id_barbero: 5,
    id_servicio: 3,
    id_tienda: 1,
    fecha_hora_inicio: '2024-04-25T14:30:00',
    duracion_minutos: 30,
    monto_total: 150.00,
    pago_abono: 50.00,
    metodo_pago: 'tarjeta'
  }
  window.ApiService.createAppointment(citaData)
    .then(cita => console.log('Cita creada:', cita))
</script>
```

### 2. Componentes React (Sin Build)

**Versión CDN + Vanilla JS:**
```html
<!-- En: web-pages/búsqueda/pagecopy.aspx.yml -->
<div id="react-root"></div>

<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="/web-files/api-service.js"></script>

<script>
  const { useState, useEffect } = React

  function SearchBarbers() {
    const [barbers, setBarbers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      window.ApiService.getBarbers()
        .then(setBarbers)
        .finally(() => setLoading(false))
    }, [])

    if (loading) return React.createElement('div', null, 'Cargando...')

    return React.createElement(
      'div',
      { className: 'search-container' },
      React.createElement('h1', null, 'Barberos Disponibles'),
      React.createElement(
        'div',
        { className: 'barbers-grid' },
        barbers.map(barber =>
          React.createElement(
            'div',
            { key: barber.id, className: 'barber-card' },
            React.createElement('h3', null, barber.nombre),
            React.createElement('p', null, barber.especialidad),
            React.createElement('button', { className: 'btn btn-primary' }, 'Ver Perfil')
          )
        )
      )
    )
  }

  ReactDOM.render(
    React.createElement(SearchBarbers),
    document.getElementById('react-root')
  )
</script>
```

### 3. Componentes React (Con Build)

Para mayor complejidad, usar Webpack/Babel:

**Estructura:**
```
pages-fadebooker/
├── src/
│   ├── components/
│   │   ├── SearchBarbers.jsx
│   │   ├── BookingForm.jsx
│   │   └── UserProfile.jsx
│   ├── services/
│   │   └── api.js
│   └── index.js
│
├── webpack.config.js
├── .babelrc
└── package.json
```

**Build:**
```bash
# Instalar dependencias
npm install

# Compilar
npm run build

# Archivos generados en:
# dist/components.bundle.js  (Incluir en web-pages)
```

---

## 🎮 Comandos PAC CLI

### Autenticación

```bash
# Crear conexión a entorno
pac auth create --environment 28237aaa-b826-ecc1-87ab-5a19fc954e19

# Listar conexiones
pac auth list

# Ver conexión activa
pac auth show

# Cambiar de entorno
pac auth change --environment ENVIRONMENT_ID

# Limpiar caché
pac auth clear
```

### Descargar Sitio

```bash
# Descargar completo (primera vez)
pac pages download \
  --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2 \
  --overwrite

# Descargar cambios del servidor (NO sobrescribir locales)
pac pages download \
  --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2
```

### Subir Cambios

```bash
# Subir todos los cambios
pac pages upload \
  --path "./pages-fadebooker" \
  --modelVersion 2

# Con verbose (ver detalles)
pac pages upload \
  --path "./pages-fadebooker" \
  --modelVersion 2 \
  --verbose
```

### Workflow Completo

```bash
#!/bin/bash

echo "🔄 Descargando cambios del servidor..."
pac pages download \
  --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2

echo "✏️  Realizando cambios (edita los archivos)..."
read -p "Presiona Enter cuando termines..."

echo "⬆️  Subiendo cambios..."
pac pages upload \
  --path "./pages-fadebooker" \
  --modelVersion 2

echo "✅ ¡Cambios subidos exitosamente!"
```

---

## 🎯 Despliegue

### Desarrollo (Local)

```bash
# 1. Descargar sitio
pac pages download \
  --path "./pages-fadebooker" \
  --webSiteId af0d9c93-8138-4034-91ec-18c60b7953d5 \
  --modelVersion 2

# 2. Editar archivos localmente
# - Modificar web-pages/
# - Agregar web-files/
# - Testear cambios

# 3. Subir cambios
pac pages upload \
  --path "./pages-fadebooker" \
  --modelVersion 2

# 4. Verificar en navegador
# https://fadebooker.powerappsportals.com/
```

### Producción

```bash
# 1. Build de React (si aplica)
npm run build

# 2. Copiar bundle a web-files
cp dist/components.bundle.js pages-fadebooker/fadebooker/web-files/react/

# 3. Commit a git
git add .
git commit -m "Release: React components v1.0"

# 4. Subir a Power Pages
pac pages upload \
  --path "./pages-fadebooker" \
  --modelVersion 2 \
  --verbose

# 5. Verificar logs
# Power Platform Admin Center → Sitio → Activity Log
```

---

## ⚠️ Consideraciones Importantes

### Seguridad
- ✅ Token JWT almacenado en localStorage
- ✅ CORS configurado en Backend
- ✅ Variables sensibles en .env (no en código)
- ❌ NO exponer secrets en web-files

### Performance
- ✅ Comprimir CSS/JS
- ✅ Lazy load de React
- ✅ Caché de API calls
- ✅ CDN para librerías

### Compatibilidad
- ✅ React 18 (compatible con todos los navegadores modernos)
- ✅ Bootstrap 5 (para estilos)
- ✅ Liquid templates (Power Pages)

---

## 📚 Documentación Relacionada

- [REACT_INTEGRATION_GUIDE.md](./REACT_INTEGRATION_GUIDE.md) - Guía completa de integración
- [API Reference](../back-fadebooker/openapi.yaml) - Endpoints del Backend
- [Configuración de Entornos](../../CONFIGURACION_ENTORNOS.md) - Setup completo
- [Power Pages Docs](https://learn.microsoft.com/en-us/power-pages/)
- [Power Apps CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)

---

## 🤝 Contribución

```bash
# 1. Crear rama
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios
# - Editar componentes
# - Probar localmente

# 3. Subir cambios
git add .
git commit -m "feat: Agregar búsqueda de barberos"
git push origin feature/nueva-funcionalidad

# 4. Pull Request
# Abrir PR en GitHub/Azure DevOps
```

---

**Próximos Pasos:**
1. Descargar sitio con PAC
2. Crear carpeta `react/` en `web-files/`
3. Agregar `api-service.js` a pages
4. Implementar primer componente (SearchBarbers)
5. Subir cambios y validar

