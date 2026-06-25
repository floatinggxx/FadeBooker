import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import PromocionesManager from '@/features/barbero/ui/PromocionesManager';

const PromocionesPage: React.FC = () => {
  const { user } = useAuth();

  if (!user || (user.rol !== 'Barbero' && user.rol !== 'Dueño')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border-8 border-white max-w-xl text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Acceso restringido</h2>
          <p className="text-slate-500 leading-relaxed">Esta sección está disponible solo para barberos y dueños de barbería.</p>
        </div>
      </div>
    );
  }

  return <PromocionesManager />;
};

export default PromocionesPage;
