import React from 'react';
import { Barbero } from '@/types';
import { Link } from 'react-router-dom';

const BarberCard: React.FC<{ barber: Barbero }> = ({ barber }) => {
  const fotoUrl = (barber as Barbero & { fotoUrl?: string }).fotoUrl || '/images/barber-1.svg';
  const rating = barber.calificacion || 4.8;

  return (
    <article className="barber-card">
      <img src={fotoUrl} alt={barber.nombre} />
      <div className="barber-card-content">
        <h3>{barber.nombre}</h3>
        <p>{barber.especialidad || 'Barbero profesional'}</p>
        <p className="text-sm text-slate-300">{barber.email}</p>
        <p className="text-sm text-slate-400">Valoración: {rating} ★</p>
        <Link to={`/barbero/${barber.id}`} className="barber-card-link">Ver perfil</Link>
      </div>
    </article>
  );
};

export default BarberCard;
