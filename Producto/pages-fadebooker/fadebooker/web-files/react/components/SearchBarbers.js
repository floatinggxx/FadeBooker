/**
 * SearchBarbers Component - FadeBooker
 * 
 * Componente React para búsqueda y visualización de barberos
 * Compatible con React 18 (CDN o Build)
 * 
 * Uso:
 * <div id="react-root"></div>
 * <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
 * <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
 * <script src="/api-service.js"></script>
 * <script src="/react/components/SearchBarbers.js"></script>
 */

class SearchBarbers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      barbers: [],
      filtered: [],
      specialties: [],
      selectedSpecialty: '',
      searchTerm: '',
      loading: true,
      error: null,
      sortBy: 'nombre' // 'nombre' o 'rating'
    }
  }

  componentDidMount() {
    this.loadBarbers()
  }

  loadBarbers = async () => {
    try {
      this.setState({ loading: true, error: null })
      const data = await window.ApiService.getBarbers()
      
      // Extraer especialidades únicas
      const specialties = [...new Set(data.map(b => b.especialidad))].filter(Boolean)
      
      this.setState({
        barbers: data,
        filtered: data,
        specialties: specialties,
        loading: false
      })
    } catch (error) {
      this.setState({
        error: error.message || 'Error al cargar barberos',
        loading: false
      })
    }
  }

  handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase()
    this.setState({ searchTerm }, this.applyFilters)
  }

  handleSpecialtyFilter = (e) => {
    const selectedSpecialty = e.target.value
    this.setState({ selectedSpecialty }, this.applyFilters)
  }

  handleSort = (e) => {
    const sortBy = e.target.value
    this.setState({ sortBy }, this.applyFilters)
  }

  applyFilters = () => {
    const { barbers, searchTerm, selectedSpecialty, sortBy } = this.state

    let filtered = barbers

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.nombre.toLowerCase().includes(searchTerm) ||
        (b.especialidad && b.especialidad.toLowerCase().includes(searchTerm))
      )
    }

    // Filtrar por especialidad
    if (selectedSpecialty) {
      filtered = filtered.filter(b => b.especialidad === selectedSpecialty)
    }

    // Ordenar
    if (sortBy === 'nombre') {
      filtered.sort((a, b) => a.nombre.localeCompare(b.nombre))
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0))
    }

    this.setState({ filtered })
  }

  handleViewProfile = (barberId) => {
    // Redirigir a perfil del barbero
    if (window.location.pathname.includes('admin')) {
      // Admin
      console.log('Ver perfil de barbero:', barberId)
    } else {
      // Público
      window.location.href = `/perfil-barbero/?id=${barberId}`
    }
  }

  renderStars = (rating) => {
    if (!rating) return React.createElement('span', { className: 'stars' }, 'Sin calificación')
    
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        React.createElement('span', {
          key: i,
          className: i < Math.floor(rating) ? 'star filled' : 'star'
        }, '⭐')
      )
    }
    return React.createElement('div', { className: 'stars' }, stars)
  }

  renderBarberCard = (barber) => {
    return React.createElement(
      'div',
      { key: barber.id, className: 'barber-card' },
      React.createElement(
        'div',
        { className: 'barber-header' },
        React.createElement('img', {
          src: barber.foto || '/web-files/default-barber.png',
          alt: barber.nombre,
          className: 'barber-photo'
        })
      ),
      React.createElement(
        'div',
        { className: 'barber-body' },
        React.createElement('h3', { className: 'barber-name' }, barber.nombre),
        React.createElement('p', { className: 'barber-specialty' }, barber.especialidad),
        this.renderStars(barber.calificacion),
        React.createElement('p', { className: 'barber-experience' },
          `${barber.anos_experiencia || 0} años de experiencia`
        ),
        React.createElement('p', { className: 'barber-tienda' },
          `Tienda: ${barber.tienda_nombre || 'N/A'}`
        )
      ),
      React.createElement(
        'div',
        { className: 'barber-footer' },
        React.createElement(
          'button',
          {
            className: 'btn btn-primary btn-sm',
            onClick: () => this.handleViewProfile(barber.id)
          },
          'Ver Perfil'
        ),
        React.createElement(
          'button',
          {
            className: 'btn btn-success btn-sm',
            onClick: () => window.location.href = `/reserva-cita/?barbero=${barber.id}`
          },
          'Reservar'
        )
      )
    )
  }

  render() {
    const { filtered, loading, error, specialties, searchTerm, selectedSpecialty, sortBy } = this.state

    // Loading
    if (loading) {
      return React.createElement(
        'div',
        { className: 'search-container loading' },
        React.createElement('div', { className: 'spinner' }, 'Cargando barberos...')
      )
    }

    // Error
    if (error) {
      return React.createElement(
        'div',
        { className: 'search-container error' },
        React.createElement('div', { className: 'alert alert-danger' },
          `❌ ${error}`
        ),
        React.createElement(
          'button',
          { className: 'btn btn-primary', onClick: this.loadBarbers },
          'Reintentar'
        )
      )
    }

    return React.createElement(
      'div',
      { className: 'search-container' },

      // Header
      React.createElement(
        'div',
        { className: 'search-header' },
        React.createElement('h1', null, 'Encontrar Barberos'),
        React.createElement('p', { className: 'subtitle' },
          `${filtered.length} barberos disponibles`
        )
      ),

      // Filtros
      React.createElement(
        'div',
        { className: 'search-filters' },

        // Search Input
        React.createElement(
          'div',
          { className: 'filter-group' },
          React.createElement('label', null, 'Buscar:'),
          React.createElement('input', {
            type: 'text',
            className: 'form-control',
            placeholder: 'Nombre, especialidad...',
            value: searchTerm,
            onChange: this.handleSearch
          })
        ),

        // Specialty Filter
        React.createElement(
          'div',
          { className: 'filter-group' },
          React.createElement('label', null, 'Especialidad:'),
          React.createElement(
            'select',
            {
              className: 'form-control',
              value: selectedSpecialty,
              onChange: this.handleSpecialtyFilter
            },
            React.createElement('option', { value: '' }, 'Todas'),
            specialties.map(specialty =>
              React.createElement('option', { key: specialty, value: specialty }, specialty)
            )
          )
        ),

        // Sort
        React.createElement(
          'div',
          { className: 'filter-group' },
          React.createElement('label', null, 'Ordenar por:'),
          React.createElement(
            'select',
            {
              className: 'form-control',
              value: sortBy,
              onChange: this.handleSort
            },
            React.createElement('option', { value: 'nombre' }, 'Nombre A-Z'),
            React.createElement('option', { value: 'rating' }, 'Mejor Calificado')
          )
        )
      ),

      // Results
      React.createElement(
        'div',
        { className: 'barbers-grid' },
        filtered.length > 0
          ? filtered.map(barber => this.renderBarberCard(barber))
          : React.createElement(
              'div',
              { className: 'alert alert-info' },
              '😞 No encontramos barberos con esos criterios'
            )
      )
    )
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('react-root')
    if (container) {
      ReactDOM.render(React.createElement(SearchBarbers), container)
    }
  })
} else {
  const container = document.getElementById('react-root')
  if (container) {
    ReactDOM.render(React.createElement(SearchBarbers), container)
  }
}

// Estilos CSS (agregar en theme.css)
const styles = `
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-header {
  text-align: center;
  margin-bottom: 30px;
}

.search-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.search-header .subtitle {
  font-size: 1.1rem;
  color: #666;
}

.search-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.filter-group input,
.filter-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.barbers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.barber-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.barber-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.barber-header {
  height: 250px;
  overflow: hidden;
  background: #e0e0e0;
}

.barber-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.barber-body {
  padding: 15px;
}

.barber-name {
  font-size: 1.3rem;
  margin: 0 0 5px 0;
  color: #333;
}

.barber-specialty {
  color: #666;
  font-size: 0.95rem;
  margin: 5px 0;
}

.barber-experience {
  color: #999;
  font-size: 0.85rem;
  margin: 5px 0;
}

.barber-tienda {
  color: #999;
  font-size: 0.85rem;
  margin: 10px 0 0 0;
}

.stars {
  margin: 8px 0;
  color: #ffa500;
}

.barber-footer {
  padding: 10px 15px 15px;
  display: flex;
  gap: 10px;
}

.barber-footer .btn {
  flex: 1;
  padding: 8px;
  font-size: 0.9rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.spinner {
  font-size: 1.2rem;
  color: #666;
}

.alert {
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
}

.alert-info {
  background: #e3f2fd;
  color: #1565c0;
  border: 1px solid #90caf9;
}

.alert-danger {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ef5350;
}

@media (max-width: 768px) {
  .search-filters {
    grid-template-columns: 1fr;
  }

  .barbers-grid {
    grid-template-columns: 1fr;
  }

  .search-header h1 {
    font-size: 1.8rem;
  }
}
`

console.log('[SearchBarbers] Componente cargado')
