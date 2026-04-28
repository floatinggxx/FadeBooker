# 🚀 Guía de Integración React en Power Pages - FadeBooker

**Versión:** 1.0.0  
**Fecha:** 21 de abril de 2026  
**Estado:** En implementación

---

## 📌 Visión General

Esta guía documenta cómo integrar componentes **React** en Power Pages de FadeBooker, manteniendo compatibilidad total con la plataforma de Microsoft.

### ¿Por qué React en Power Pages?
- ✅ Componentes reutilizables
- ✅ Lógica compleja más manejable
- ✅ State management avanzado
- ✅ Mejor performance
- ✅ Desarrollo más ágil

### Stack de Integración
```
Power Pages (Interfaz + Enrutamiento)
    ↓
React Components (via CDN + Portals)
    ↓
Backend API (Node.js + Express)
    ↓
Azure SQL Server (Base de Datos)
```

---

## 🏗️ Estrategia de Integración

### Opción 1: React via CDN (⭐ RECOMENDADA)
```html
<!-- En Power Pages HTML/Liquid template -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<div id="react-root"></div>
<script src="./react-components.js"></script>
```

**Ventajas:**
- Sin build process
- Ligero y rápido
- Fácil de mantener

**Desventajas:**
- No soporte de JSX sin compilación
- Limitado en funcionalidades

---

### Opción 2: Webpack + React (RECOMENDADA para lógica compleja)
```
pages-fadebooker/
├── web-files/
│   ├── react-components.js    (Componentes compilados)
│   ├── react-app.min.js       (Bundle minificado)
│   └── styles.css             (Estilos)
├── src/
│   ├── components/            (Código fuente JSX)
│   ├── services/              (API calls)
│   ├── hooks/                 (Custom hooks)
│   └── utils/                 (Helpers)
├── webpack.config.js
├── package.json
└── .babelrc
```

**Ventajas:**
- JSX completo + TypeScript
- Tree-shaking + code splitting
- Optimización automática

---

## 📁 Estructura Recomendada

```
pages-fadebooker/
├── fadebooker/
│   ├── web-files/             (Archivos servidos al navegador)
│   │   ├── react/
│   │   │   ├── components/    (Componentes compilados)
│   │   │   ├── api-service.js (Cliente HTTP)
│   │   │   └── app-bundle.js  (Bundle principal)
│   │   └── styles.css
│   │
│   ├── web-pages/             (Páginas de Power Pages)
│   │   ├── búsqueda/          (Search barberos)
│   │   ├── reserva-cita/      (Booking)
│   │   ├── mi-cuenta/         (User profile)
│   │   ├── reseñas/           (Reviews)
│   │   └── perfil-barbero/    (Barber profile)
│   │
│   └── content-snippets/      (Snippets reutilizables)
│
└── src/                       (Código fuente React - OPCIONAL)
    ├── components/
    │   ├── SearchBarbers.jsx
    │   ├── BookingForm.jsx
    │   ├── UserProfile.jsx
    │   ├── ReviewCard.jsx
    │   └── shared/
    │       ├── Header.jsx
    │       ├── Footer.jsx
    │       └── Navbar.jsx
    │
    ├── hooks/
    │   ├── useApi.js          (Custom hook para API)
    │   ├── useAuth.js         (Auth state)
    │   └── useForm.js         (Form handling)
    │
    ├── services/
    │   └── api.js             (Cliente HTTP centralizado)
    │
    └── utils/
        ├── constants.js
        └── helpers.js
```

---

## 🔌 Conexión al Backend

### API Service Centralizado
```javascript
// react/api-service.js
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api'
    this.timeout = 5000
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          ...options.headers
        },
        ...options
      })
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Endpoints de Usuarios
  async login(email, password) {
    return this.request('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async register(userData) {
    return this.request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  // Endpoints de Barberos
  async getBarbers() {
    return this.request('/barberos')
  }

  async getBarberById(id) {
    return this.request(`/barberos/${id}`)
  }

  async getBarberAvailability(id, date) {
    return this.request(`/barberos/${id}/disponibilidad/${date}`)
  }

  // Endpoints de Servicios
  async getServices() {
    return this.request('/servicios')
  }

  async searchServices(name) {
    return this.request(`/servicios/buscar?nombre=${name}`)
  }

  // Endpoints de Citas
  async bookAppointment(bookingData) {
    return this.request('/citas', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })
  }

  async cancelAppointment(id) {
    return this.request(`/citas/${id}`, {
      method: 'DELETE'
    })
  }

  // Endpoints de Reseñas (cuando esté implementado)
  async submitReview(reviewData) {
    return this.request('/resenas', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    })
  }
}

// Exportar instancia singleton
window.ApiService = new ApiService()
```

---

## 🧩 Componentes React Prioritarios

### 1. **SearchBarbers** (Búsqueda de barberos)
```javascript
// Se renderiza en: /búsqueda/
// Funcionalidades:
// - Listar barberos
// - Filtrar por especialidad
// - Ver perfiles
// - Ranking por calificación
```

### 2. **BookingForm** (Reservar cita)
```javascript
// Se renderiza en: /reserva-cita/
// Funcionalidades:
// - Seleccionar barbero
// - Seleccionar servicio
// - Verificar disponibilidad
// - Elegir fecha/hora
// - Confirmar y pagar
```

### 3. **UserProfile** (Perfil de usuario)
```javascript
// Se renderiza en: /mi-cuenta/
// Funcionalidades:
// - Ver datos del usuario
// - Historial de citas
// - Puntos acumulados
// - Métodos de pago
// - Preferencias
```

### 4. **ReviewCard** (Reseñas)
```javascript
// Se renderiza en: /reseñas/
// Funcionalidades:
// - Ver reseñas de barbero
// - Calificación con estrellas
// - Fotos
// - Fecha de reseña
```

### 5. **BarberProfile** (Perfil de barbero)
```javascript
// Se renderiza en: /perfil-barbero/
// Funcionalidades:
// - Información del barbero
// - Servicios que ofrece
// - Disponibilidad
// - Reseñas
// - Botón de booking
```

---

## 📝 Ejemplo: Componente SearchBarbers

### Versión CDN (Sin JSX)
```javascript
// react/components/SearchBarbers.js
class SearchBarbers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      barbers: [],
      filtered: [],
      search: '',
      loading: true,
      error: null
    }
  }

  componentDidMount() {
    this.fetchBarbers()
  }

  fetchBarbers = async () => {
    try {
      const data = await window.ApiService.getBarbers()
      this.setState({ 
        barbers: data, 
        filtered: data, 
        loading: false 
      })
    } catch (error) {
      this.setState({ error: error.message, loading: false })
    }
  }

  handleSearch = (e) => {
    const search = e.target.value.toLowerCase()
    const filtered = this.state.barbers.filter(b =>
      b.nombre.toLowerCase().includes(search) ||
      b.especialidad.toLowerCase().includes(search)
    )
    this.setState({ search, filtered })
  }

  render() {
    const { loading, error, filtered } = this.state

    if (loading) return React.createElement('div', null, 'Cargando...')
    if (error) return React.createElement('div', null, `Error: ${error}`)

    return React.createElement(
      'div',
      { className: 'search-container' },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Buscar barbero...',
        onChange: this.handleSearch,
        className: 'search-input'
      }),
      React.createElement(
        'div',
        { className: 'barbers-grid' },
        filtered.map(barber =>
          React.createElement(
            'div',
            { key: barber.id, className: 'barber-card' },
            React.createElement('h3', null, barber.nombre),
            React.createElement('p', null, barber.especialidad),
            React.createElement('button', null, 'Ver Perfil')
          )
        )
      )
    )
  }
}

// Renderizar en el DOM
const container = document.getElementById('react-root')
if (container) {
  ReactDOM.render(React.createElement(SearchBarbers), container)
}
```

### Versión con JSX + Build
```jsx
// src/components/SearchBarbers.jsx
import { useState, useEffect } from 'react'
import ApiService from '../services/api'

export default function SearchBarbers() {
  const [barbers, setBarbers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBarbers()
  }, [])

  const fetchBarbers = async () => {
    try {
      const data = await ApiService.getBarbers()
      setBarbers(data)
      setFiltered(data)
    } catch (error) {
      console.error('Error fetching barbers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearch(value)
    const results = barbers.filter(b =>
      b.nombre.toLowerCase().includes(value) ||
      b.especialidad.toLowerCase().includes(value)
    )
    setFiltered(results)
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar barbero..."
        value={search}
        onChange={handleSearch}
        className="search-input"
      />
      <div className="barbers-grid">
        {filtered.map(barber => (
          <div key={barber.id} className="barber-card">
            <h3>{barber.nombre}</h3>
            <p>{barber.especialidad}</p>
            <button>Ver Perfil</button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🎯 Implementación Step-by-Step

### Fase 1: Setup Inicial (Semana 1)
- [x] Crear estructura de carpetas
- [ ] Configurar API Service
- [ ] Crear componentes base (Header, Footer, Navbar)
- [ ] Conectar React CDN a Power Pages

### Fase 2: Búsqueda de Barberos (Semana 2)
- [ ] Implementar SearchBarbers
- [ ] Filtrar por especialidad
- [ ] Mostrar calificaciones
- [ ] Integrar en `/búsqueda/`

### Fase 3: Reserva de Citas (Semana 3)
- [ ] Implementar BookingForm
- [ ] Verificar disponibilidad
- [ ] Seleccionar fecha/hora
- [ ] Sistema de pagos
- [ ] Integrar en `/reserva-cita/`

### Fase 4: Perfil de Usuario (Semana 4)
- [ ] Implementar UserProfile
- [ ] Mostrar historial de citas
- [ ] Gestionar métodos de pago
- [ ] Integrar en `/mi-cuenta/`

### Fase 5: Reseñas (Semana 5)
- [ ] Implementar ReviewCard
- [ ] Calificación con estrellas
- [ ] Listar reseñas por barbero
- [ ] Integrar en `/reseñas/`

### Fase 6: Perfiles de Barbero (Semana 6)
- [ ] Implementar BarberProfile
- [ ] Mostrar servicios
- [ ] Disponibilidad
- [ ] Botón directo a booking
- [ ] Integrar en `/perfil-barbero/`

---

## 🔑 Consideraciones Importantes

### Seguridad
```javascript
// ✅ Almacenar token en localStorage
localStorage.setItem('token', response.token)

// ❌ NO exponer credenciales en el frontend
// Los tokens deben ser validados en el Backend

// ✅ Usar CORS en el Backend
app.use(cors({
  origin: ['https://tunombrededominio.powerapps.com'],
  credentials: true
}))
```

### Performance
```javascript
// ✅ Lazy load de componentes
const SearchBarbers = React.lazy(() => import('./SearchBarbers'))

// ✅ Memoización
const BarberCard = React.memo(({ barber }) => ...)

// ✅ Caché de API calls
useEffect(() => {
  if (window.barbersCache) {
    setBarbers(window.barbersCache)
  } else {
    fetchBarbers()
  }
}, [])
```

### Compatibilidad Power Pages
```javascript
// ✅ Usar versiones estables de React
<script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>

// ✅ Evitar conflictos de CSS
.react-app-search { /* Prefijo para evitar conflictos */ }

// ✅ No interferir con Liquid templates
// Power Pages renderiza Liquid primero, React se monta después
```

---

## 📚 Recursos

- [React 18 Docs](https://react.dev)
- [Power Pages Docs](https://learn.microsoft.com/en-us/power-pages/)
- [Backend API Reference](../../back-fadebooker/openapi.yaml)
- [Power Apps CLI (PAC)](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)

---

**Próximos Pasos:**
1. Implementar API Service en web-files
2. Crear componentes base
3. Integrar React CDN en Power Pages
4. Empezar con SearchBarbers
