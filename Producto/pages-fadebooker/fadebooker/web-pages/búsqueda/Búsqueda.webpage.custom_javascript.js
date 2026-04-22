/**
 * Búsqueda Page - Custom JavaScript
 * Inicializa el componente SearchBarbers cuando la página carga
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Búsqueda Page] DOM Loaded');
  
  // Verificar que React y ApiService estén disponibles
  if (typeof React === 'undefined') {
    console.error('[Búsqueda] React no está disponible');
    return;
  }
  
  if (typeof window.ApiService === 'undefined') {
    console.error('[Búsqueda] ApiService no está disponible');
    return;
  }
  
  console.log('[Búsqueda] ✅ React y ApiService disponibles');
  console.log('[Búsqueda] API Base URL:', window.ApiService.baseURL);
  
  // El componente SearchBarbers se auto-inicializa
  // Solo verificamos que todo está cargado correctamente
  const reactRoot = document.getElementById('react-root');
  if (reactRoot) {
    console.log('[Búsqueda] ✅ React root container encontrado');
  } else {
    console.error('[Búsqueda] ❌ React root container no encontrado');
  }
});

// Manejador de errores global
window.addEventListener('error', function(event) {
  console.error('[Búsqueda] Error:', event.message);
});

// Log cuando el ApiService esté listo
if (window.ApiService) {
  window.ApiService.checkHealth()
    .then(healthy => {
      console.log('[Búsqueda] Backend Health:', healthy ? '✅ OK' : '❌ Offline');
    })
    .catch(err => {
      console.warn('[Búsqueda] Backend unreachable:', err.message);
    });
}
