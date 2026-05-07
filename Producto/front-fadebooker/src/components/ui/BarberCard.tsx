import React from 'react';
import { Barbero } from '@/types';
import { Link } from 'react-router-dom';

const BarberCard: React.FC<{ barber: Barbero }> = ({ barber }) => {
  const fotoUrl = (barber as Barbero & { fotoUrl?: string }).fotoUrl || '/nicocos.png';

  return (
    <div className="border rounded p-4 shadow-sm flex items-center gap-4">
      <img src={fotoUrl} alt={barber.nombre} className="w-20 h-20 rounded-full object-cover" />
      <div>
        <h3 className="text-lg font-semibold">{barber.nombre}</h3>
        <p className="text-sm text-gray-600">{barber.especialidad || 'Barbero'}</p>
        <Link to={`/barbero/${barber.id}`} className="mt-2 inline-block text-blue-600">Ver perfil</Link>
      </div>
    </div>
  );
};

export default BarberCard;
