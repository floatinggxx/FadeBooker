import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const spanishify = (msg: string) => {
    if (!msg) return 'Ha ocurrido un error.';
    // If message already seems Spanish, return as-is (simple heuristic)
    const spanishWords = ['error','éxito','bienvenido','correo','contraseña','conexión','No hay','Por favor','Cita','Reserv','Pago','exitoso','rechaz'];
    if (spanishWords.some(w => msg.toLowerCase().includes(w.toLowerCase()))) return msg;
    // Short mapping for common English phrases
    const map: Record<string,string> = {
      'Network Error': 'No hay conexión con el servidor. Revisa tu internet.',
      'Invalid credentials': 'Credenciales inválidas. Revisa tu correo y contraseña.',
      'User not found': 'Usuario no encontrado.',
      'Unauthorized': 'Acceso no autorizado. Por favor inicia sesión.'
    };
    for (const k of Object.keys(map)) {
      if (msg.includes(k)) return map[k];
    }
    // Fallback: return original message but ensure sentence capitalization
    return msg.charAt(0).toUpperCase() + msg.slice(1);
  };

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2,9);
    const safeMessage = spanishify(message);
    setNotifications(n => [...n, { id, type, message: safeMessage }]);
    setTimeout(() => { removeNotification(id); }, 5000);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
