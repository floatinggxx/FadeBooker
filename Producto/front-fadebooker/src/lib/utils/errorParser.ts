/**
 * Parsea errores técnicos (Zod, SQL, API) en mensajes comprensibles para el usuario
 */
export const parseError = (error: any): string => {
  if (!error) return 'Ha ocurrido un error inesperado';

  // Si es un error de Axios con respuesta detallada
  if (error.response?.data) {
    const data = error.response.data;
    const message = String(data.message || data.error || '').trim();

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      if (typeof firstError === 'string') return firstError;
      if (firstError.mensaje) return firstError.mensaje;
      if (firstError.message) return firstError.message;
    }

    // Mensajes directos de auth
    if (message.includes('El correo electrónico ya está registrado')) {
      return 'Este correo ya tiene una cuenta registrada.';
    }
    if (message.includes('Credenciales inválidas')) {
      return 'Correo o contraseña incorrectos.';
    }
    if (message.includes('El correo electrónico no está registrado')) {
      return 'Este correo no está registrado.';
    }

    // Carácter inválido específico
    if (message.toLowerCase().includes('carácter') || message.toLowerCase().includes('caracter') || message.toLowerCase().includes('invalid character')) {
      return 'Hay un carácter no válido en los datos. Verifica y vuelve a intentarlo.';
    }

    // Manejo de errores de validación (Zod)
    if (message.includes('Validation failed:') || message.includes('Error de validación') || message.includes('Invalid input')) {
      if (message.includes('anos_experiencia')) return 'Los años de experiencia deben ser un número válido.';
      if (message.includes('id_tienda')) return 'Selecciona una barbería válida de la lista.';
      if (message.includes('email')) return 'El correo electrónico no es válido o ya está en uso.';
      if (message.includes('contrasena')) return 'La contraseña debe tener al menos 6 caracteres.';
      if (message.includes('nombre')) return 'El nombre no es válido. Usa solo caracteres permitidos.';
      if (message.includes('apellido')) return 'El apellido no es válido. Usa solo caracteres permitidos.';
      return 'Por favor, revisa que todos los campos estén correctamente completados.';
    }

    // Manejo de errores de base de datos / Negocio
    if (message.includes('Cita ya está completamente pagada')) return 'Esta cita ya ha sido pagada anteriormente.';
    if (message.includes('Cita no encontrada')) return 'No pudimos encontrar la información de la cita.';
    if (message.includes('mercadopago')) return 'Hubo un problema al conectar con el portal de pagos. Inténtalo más tarde.';

    // Errores de SQL genéricos
    if (message.includes('CHK_') || message.includes('FK_') || message.includes('duplicate key')) {
      return 'No se pudo completar la operación. Verifica que los datos sean únicos y correctos.';
    }

    return message || 'Ha ocurrido un error. Inténtalo de nuevo.';
  }

  // Error de red
  if (error.message === 'Network Error') {
    return 'No hay conexión con el servidor. Revisa tu internet.';
  }
  // Errores de runtime (por ejemplo: Cannot read properties of undefined)
  if (typeof error.message === 'string') {
    if (error.message.includes('Cannot read properties of undefined') || error.message.includes('reading')) {
      return 'Ocurrió un error al procesar la información. Intenta recargar la página o vuelve a intentarlo más tarde.';
    }
  }

  return error.message || 'Ha ocurrido un error. Inténtalo de nuevo.';
};
