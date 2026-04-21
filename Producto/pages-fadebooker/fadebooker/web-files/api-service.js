/**
 * API Service - FadeBooker Frontend
 * 
 * Cliente HTTP centralizado para comunicación con Backend
 * Compatible con React (CDN o Build) y Power Pages
 * 
 * Uso:
 * - async/await: const users = await window.ApiService.getBarbers()
 * - .then(): window.ApiService.login(email, pass).then(data => ...)
 * 
 * @version 1.0.0
 * @author FadeBooker Team
 */

class FadeBookerApiService {
  constructor(baseURL = null) {
    // Detectar URL del backend automáticamente
    this.baseURL = baseURL || this.detectBackendURL()
    this.timeout = 10000
    this.token = localStorage.getItem('fadebooker_token')
  }

  /**
   * Detecta la URL del backend según el entorno
   * - Desarrollo: http://localhost:3000/api
   * - Producción: URL configurada en window.BACKEND_CONFIG
   */
  detectBackendURL() {
    // Si hay configuración global, usarla
    if (window.BACKEND_CONFIG && window.BACKEND_CONFIG.apiUrl) {
      return window.BACKEND_CONFIG.apiUrl
    }

    // En desarrollo local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api'
    }

    // En Power Pages (producción)
    // Cambiar según tu dominio
    return 'https://tu-backend-fadebooker.azurewebsites.net/api'
  }

  /**
   * Realiza una petición HTTP genérica
   * @param {string} endpoint - Ruta del endpoint (ej: /barberos)
   * @param {object} options - Opciones de fetch
   * @returns {Promise<object>} Respuesta parseada
   */
  async request(endpoint, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    // Agregar token si existe
    if (this.token) {
      defaultOptions.headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const url = `${this.baseURL}${endpoint}`
      console.log(`[API] ${options.method || 'GET'} ${url}`)

      const response = await Promise.race([
        fetch(url, defaultOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), this.timeout)
        )
      ])

      // Handle HTTP errors
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`)
        error.status = response.status
        throw error
      }

      // Parse JSON
      const data = await response.json()
      console.log(`[API] ✅ Response:`, data)
      return data
    } catch (error) {
      console.error(`[API] ❌ Error:`, error.message)
      throw error
    }
  }

  /**
   * Setea el token para autenticación
   * @param {string} token - JWT token
   */
  setToken(token) {
    this.token = token
    localStorage.setItem('fadebooker_token', token)
  }

  /**
   * Limpia el token (logout)
   */
  clearToken() {
    this.token = null
    localStorage.removeItem('fadebooker_token')
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔐 AUTENTICACIÓN
  // ═══════════════════════════════════════════════════════════════

  /**
   * Registra un nuevo usuario
   * @param {object} userData - {nombre, email, password, telefono, rol}
   * @returns {Promise<{id, token, user}>}
   */
  async register(userData) {
    const response = await this.request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    if (response.token) {
      this.setToken(response.token)
    }
    return response
  }

  /**
   * Login de usuario
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token, user}>}
   */
  async login(email, password) {
    const response = await this.request('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    if (response.token) {
      this.setToken(response.token)
    }
    return response
  }

  // ═══════════════════════════════════════════════════════════════
  // 👨‍💼 BARBEROS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene lista de todos los barberos
   * @returns {Promise<Array>} Array de barberos
   */
  async getBarbers() {
    return this.request('/barberos')
  }

  /**
   * Obtiene barbero por ID
   * @param {number} id
   * @returns {Promise<object>} Datos del barbero
   */
  async getBarberById(id) {
    return this.request(`/barberos/${id}`)
  }

  /**
   * Busca barberos por especialidad
   * @param {string} especialidad - ej: "fade", "degradado"
   * @returns {Promise<Array>}
   */
  async getBarbersBySpecialty(especialidad) {
    return this.request(`/barberos/especialidad/${especialidad}`)
  }

  /**
   * Obtiene disponibilidad de barbero en una fecha
   * @param {number} barberId
   * @param {string} date - Formato: YYYY-MM-DD
   * @returns {Promise<Array>} Horarios disponibles
   */
  async getBarberAvailability(barberId, date) {
    return this.request(`/barberos/${barberId}/disponibilidad/${date}`)
  }

  /**
   * Obtiene servicios de un barbero específico
   * @param {number} barberId
   * @returns {Promise<Array>} Servicios del barbero
   */
  async getBarberServices(barberId) {
    return this.request(`/barberos/${barberId}/servicios`)
  }

  // ═══════════════════════════════════════════════════════════════
  // 🪒 SERVICIOS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene todos los servicios
   * @returns {Promise<Array>}
   */
  async getServices() {
    return this.request('/servicios')
  }

  /**
   * Obtiene servicio por ID
   * @param {number} id
   * @returns {Promise<object>}
   */
  async getServiceById(id) {
    return this.request(`/servicios/${id}`)
  }

  /**
   * Busca servicios por nombre
   * @param {string} nombre
   * @returns {Promise<Array>}
   */
  async searchServices(nombre) {
    return this.request(`/servicios/buscar?nombre=${encodeURIComponent(nombre)}`)
  }

  /**
   * Obtiene servicios de una tienda específica
   * @param {number} tiendaId
   * @returns {Promise<Array>}
   */
  async getServicesByStore(tiendaId) {
    return this.request(`/servicios/tienda/${tiendaId}`)
  }

  /**
   * Obtiene barberos que ofrecen un servicio
   * @param {number} serviceId
   * @returns {Promise<Array>}
   */
  async getBarbersByService(serviceId) {
    return this.request(`/servicios/${serviceId}/barberos`)
  }

  // ═══════════════════════════════════════════════════════════════
  // 📅 CITAS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene todas las citas
   * @returns {Promise<Array>}
   */
  async getAppointments() {
    return this.request('/citas')
  }

  /**
   * Obtiene cita por ID
   * @param {number} id
   * @returns {Promise<object>}
   */
  async getAppointmentById(id) {
    return this.request(`/citas/${id}`)
  }

  /**
   * Crea una nueva cita/reserva
   * @param {object} appointmentData
   * - {
   *   id_cliente,       // ID del cliente
   *   id_barbero,       // ID del barbero
   *   id_servicio,      // ID del servicio
   *   id_tienda,        // ID de la tienda
   *   fecha_hora_inicio, // ISO string: "2024-04-21T14:30:00"
   *   duracion_minutos, // Duración en minutos (ej: 30)
   *   monto_total,      // Monto final
   *   pago_abono,       // Abono inicial
   *   metodo_pago       // "tarjeta", "efectivo", etc
   * }
   * @returns {Promise<object>} Cita creada
   */
  async createAppointment(appointmentData) {
    return this.request('/citas', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    })
  }

  /**
   * Cancela una cita
   * @param {number} id
   * @param {string} motivo - Razón de cancelación (opcional)
   * @returns {Promise<object>}
   */
  async cancelAppointment(id, motivo = '') {
    return this.request(`/citas/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ motivo })
    })
  }

  /**
   * Cambia el estado de una cita
   * @param {number} id
   * @param {string} nuevoEstado - "confirmada", "cancelada", "completada"
   * @returns {Promise<object>}
   */
  async updateAppointmentStatus(id, nuevoEstado) {
    return this.request(`/citas/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ nuevoEstado })
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 👥 CLIENTES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene todos los clientes
   * @returns {Promise<Array>}
   */
  async getClients() {
    return this.request('/clientes')
  }

  /**
   * Obtiene cliente por ID
   * @param {number} id
   * @returns {Promise<object>}
   */
  async getClientById(id) {
    return this.request(`/clientes/${id}`)
  }

  /**
   * Obtiene cliente por email
   * @param {string} email
   * @returns {Promise<object>}
   */
  async getClientByEmail(email) {
    return this.request(`/clientes/email/${email}`)
  }

  /**
   * Busca cliente por nombre
   * @param {string} nombre
   * @returns {Promise<Array>}
   */
  async searchClients(nombre) {
    return this.request(`/clientes/buscar?nombre=${encodeURIComponent(nombre)}`)
  }

  /**
   * Obtiene cliente por teléfono
   * @param {string} telefono
   * @returns {Promise<object>}
   */
  async getClientByPhone(telefono) {
    return this.request(`/clientes/telefono/${telefono}`)
  }

  /**
   * Crea un cliente
   * @param {object} clientData
   * @returns {Promise<object>}
   */
  async createClient(clientData) {
    return this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(clientData)
    })
  }

  /**
   * Actualiza datos de cliente
   * @param {number} id
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  async updateClient(id, updateData) {
    return this.request(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })
  }

  /**
   * Actualiza puntos del cliente
   * @param {number} id
   * @param {number} puntos
   * @returns {Promise<object>}
   */
  async updateClientPoints(id, puntos) {
    return this.request(`/clientes/${id}/puntos`, {
      method: 'PUT',
      body: JSON.stringify({ puntos })
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 🌟 RESEÑAS (Cuando esté implementado en Backend)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene reseñas de un barbero
   * @param {number} barberId
   * @returns {Promise<Array>}
   */
  async getBarberReviews(barberId) {
    return this.request(`/barberos/${barberId}/resenas`)
  }

  /**
   * Crea una reseña
   * @param {object} reviewData
   * - { id_cita, id_cliente, id_barbero, calificacion, comentario, fotos[] }
   * @returns {Promise<object>}
   */
  async createReview(reviewData) {
    return this.request('/resenas', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // 📸 CLOUDINARY (Simulación de cortes)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Genera firma para subida segura a Cloudinary
   * @param {string} folder
   * @returns {Promise<{signature, timestamp, cloudName}>}
   */
  async getCloudinarySignature(folder = 'user_photos') {
    return this.request('/hairstyle/signature', {
      method: 'POST',
      body: JSON.stringify({ folder })
    })
  }

  /**
   * Simula un corte de pelo sobre una foto
   * @param {string} publicId - ID de la imagen en Cloudinary
   * @param {string} styleId - ID del estilo ("degradado", "fade", etc)
   * @returns {Promise<{simulatedImageUrl, styleId}>}
   */
  async simulateHairstyle(publicId, styleId) {
    return this.request('/hairstyle/simulate', {
      method: 'POST',
      body: JSON.stringify({ publicId, styleId })
    })
  }

  // ═══════════════════════════════════════════════════════════════
  // ⚙️ HEALTH CHECK
  // ═══════════════════════════════════════════════════════════════

  /**
   * Verifica si el Backend está disponible
   * @returns {Promise<boolean>}
   */
  async checkHealth() {
    try {
      const response = await this.request('/')
      return !!response
    } catch {
      return false
    }
  }
}

// Exportar como variable global para Power Pages
if (typeof window !== 'undefined') {
  window.ApiService = new FadeBookerApiService()
  
  // Debug: Mostrar instancia
  console.log('[FadeBooker API Service] Inicializado')
  console.log('Base URL:', window.ApiService.baseURL)
  console.log('Uso: await window.ApiService.getBarbers()')
}

// Si es Node.js/CommonJS (para testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FadeBookerApiService
}
