import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { barberService } from '@/lib/api/barberService';
import BarberCard from '@/components/ui/BarberCard';

const HomePage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['barbers'],
    queryFn: barberService.listBarberos,
  });

  if (isLoading) return <div className="page-message">Cargando barberos...</div>;
  if (error) return <div className="page-message page-message-error">Error al cargar barberos.</div>;

  return (
    <section className="page-content container">
      <div className="hero-panel">
        <div>
          <span className="hero-label">Agendá tu corte online</span>
          <h1 className="hero-title">El mejor servicio para tu barbería</h1>
          <p className="hero-text">Selecciona tu barbero favorito, elige el servicio y reserva el horario ideal en segundos.</p>
          <div className="hero-actions">
            <Link to="/booking/new" className="button button-primary">Reservar ahora</Link>
            <Link to="/bookings" className="button button-secondary">Ver mis citas</Link>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <h2>Barberos disponibles</h2>
        <p>Encuentra al experto que mejor se adapta a tu estilo.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {data && data.length ? data.map((b: any) => (
          <BarberCard key={b.id} barber={b} />
        )) : <p>No se encontraron barberos.</p>}
      </div>
    </section>
  );
};

export default HomePage;
