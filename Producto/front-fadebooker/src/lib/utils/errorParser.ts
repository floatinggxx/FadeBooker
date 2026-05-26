/**
 * Parsea errores técnicos (Zod, SQL, API) en mensajes comprensibles para el usuario
 */
export const parseError = (error: any): string => {
  if (!error) return 'Ha ocurrido un error inesperado';

  // Si es un error de Axios con respuesta detallada
  if (error.response?.data) {
    const data = error.response.data;
    const message = data.message || data.error || '';

    // Manejo de errores de validación (Zod)
    if (message.includes('Error de validación') || message.includes('Invalid input')) {
      if (message.includes('anos_experiencia')) return 'Los años de experiencia deben ser un número válido';
      if (message.includes('id_tienda')) return 'Selecciona una barbería válida de la lista';
      if (message.includes('email')) return 'El correo electrónico no es válido o ya está en uso';
      if (message.includes('contrasena')) return 'La contraseña debe tener al menos 6 caracteres';
      return 'Por favor, revisa que todos los campos estén correctamente completados';
    }

    // Manejo de errores de base de datos / Negocio
    if (message.includes('Cita ya está completamente pagada')) return 'Esta cita ya ha sido pagada anteriormente';
    if (message.includes('Cita no encontrada')) return 'No pudimos encontrar la información de la cita';
    if (message.includes('mercadopago')) return 'Hubo un problema al conectar con el portal de pagos. Inténtalo más tarde.';
    
    // Errores de SQL genéricos
    if (message.includes('CHK_') || message.includes('FK_') || message.includes('duplicate key')) {
      return 'No se pudo completar la operación. Verifica que los datos sean únicos y correctos.';
    }

    return message;
  }

  // Error de red
  if (error.message === 'Network Error') {
    return 'No hay conexión con el servidor. Revisa tu internet.';
  }

  return error.message || 'Ha ocurrido un error. Inténtalo de nuevo.';
};
