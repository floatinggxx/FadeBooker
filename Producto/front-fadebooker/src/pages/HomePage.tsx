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

      <section id="servicios" className="section-block">
        <div className="section-heading">
          <h2>Servicios principales</h2>
          <p>Elige entre cortes, diseño de barba y tratamientos premium con los mejores barberos.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="feature-card">
            <h3>Corte clásico</h3>
            <p>Perfecto para mantener un estilo cuidado y rápido.</p>
          </article>
          <article className="feature-card">
            <h3>Barba & Afeitado</h3>
            <p>Perfilado preciso con productos profesionales.</p>
          </article>
          <article className="feature-card">
            <h3>Experiencia premium</h3>
            <p>Servicio completo con masaje y styling exclusivo.</p>
          </article>
        </div>
      </section>

      <section id="como-funciona" className="section-block bg-surface">
        <div className="section-heading">
          <h2>Cómo funciona</h2>
          <p>Reserva en tres pasos simples y llega directo a tu cita sin esperas.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="step-card">
            <strong>1</strong>
            <h3>Seleccioná tu barbero</h3>
            <p>Navega entre perfiles y elige a tu especialista ideal.</p>
          </article>
          <article className="step-card">
            <strong>2</strong>
            <h3>Elegí servicio y horario</h3>
            <p>Reserva el servicio que quieras y elige la franja disponible.</p>
          </article>
          <article className="step-card">
            <strong>3</strong>
            <h3>Confirmá tu reserva</h3>
            <p>Recibí la confirmación al instante y llega puntual a tu cita.</p>
          </article>
        </div>
      </section>

      <section id="por-que-elegirnos" className="section-block">
        <div className="section-heading">
          <h2>Por qué elegirnos</h2>
          <p>Una plataforma confiable con barberos verificados y atención ágil.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="value-card">
            <h3>Calidad comprobada</h3>
            <p>Barberos con reseñas reales y estilo profesional.</p>
          </article>
          <article className="value-card">
            <h3>Reserva rápida</h3>
            <p>Agenda tu cita en minutos, desde cualquier dispositivo.</p>
          </article>
          <article className="value-card">
            <h3>Soporte local</h3>
            <p>Atención personalizada para clientes y barberos.</p>
          </article>
        </div>
      </section>

      <section id="testimonios" className="section-block bg-surface">
        <div className="section-heading">
          <h2>Testimonios</h2>
          <p>Lo que dicen quienes ya reservaron con FadeBooker.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="testimonial-card">
            <p>"Excelente experiencia. Reservar fue fácil y el barbero fue muy profesional."</p>
            <small>— Lucas P.</small>
          </article>
          <article className="testimonial-card">
            <p>"Agendé mi corte en segundos y todo estuvo listo cuando llegué."</p>
            <small>— Martina R.</small>
          </article>
          <article className="testimonial-card">
            <p>"Los servicios son variados y la calidad se nota en cada visita."</p>
            <small>— Andrés M.</small>
          </article>
        </div>
      </section>

      <section className="section-block cta-panel">
        <div className="cta-content">
          <h2>Listo para tu próximo corte?</h2>
          <p>Reserva ahora y asegura tu horario con el barbero ideal.</p>
        </div>
        <div className="hero-actions">
          <Link to="/booking/new" className="button button-primary">Agendar ahora</Link>
          <Link to="/login" className="button button-secondary">Ingresar</Link>
        </div>
      </section>

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
