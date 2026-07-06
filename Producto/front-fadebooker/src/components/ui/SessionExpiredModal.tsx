import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { X } from 'lucide-react';

const SessionExpiredModal: React.FC = () => {
  const { sessionExpiredReason, clearSessionExpiredReason, logout } = useAuth();

  if (!sessionExpiredReason) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">Sesión expirada</h3>
            <p className="text-sm text-slate-600 mt-2">{sessionExpiredReason}</p>
          </div>
          <button onClick={() => clearSessionExpiredReason()} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={() => { clearSessionExpiredReason(); window.location.href = '/login'; }} className="button button-primary">Ir a login</button>
          <button onClick={() => { clearSessionExpiredReason(); logout(); }} className="button button-secondary">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
