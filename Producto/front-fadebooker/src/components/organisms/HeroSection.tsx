import React from 'react';
import HeroActions from '../molecules/HeroActions';
import ImageCarousel from '../ui/ImageCarousel';

const HeroSection: React.FC = () => (
  <section className="container hero-section animate-fade-in-up">
    <div className="hero-copy">
      <h1 className="hero-title">Reserva tu corte ideal y gestiona tu estilo con una experiencia premium.</h1>
      <p className="hero-text">Explora barberías cercanas, compara servicios, agenda tu cita y lleva un control claro de tus próximas visitas.</p>
      <HeroActions />
      <div className="hero-metrics">
        <div className="hero-metric">
          <span>⚡</span>
          <div>
            <strong>Reservas instantáneas</strong>
            <p>Agenda en menos de 30 segundos.</p>
          </div>
        </div>
        <div className="hero-metric">
          <span>📍</span>
          <div>
            <strong>Barberías verificadas</strong>
            <p>Encuentra lugares con reseñas y calificaciones reales.</p>
          </div>
        </div>
        <div className="hero-metric">
          <span>⭐</span>
          <div>
            <strong>Recomendaciones personalizadas</strong>
            <p>Encuentra el barbero ideal según tu estilo y valoraciones.</p>
          </div>
        </div>
      </div>
      <div className="hero-trust">
        <span>+1.200 reservas completadas</span>
        <span>4.9/5 calificación promedio</span>
        <span>150 barberías confiables</span>
      </div>
    </div>

    <div className="hero-visual animate-appearance">
      <ImageCarousel />
      <div className="hero-highlights">
        <div className="hero-highlight-card">
          <h3>Confiable</h3>
          <p>Reseñas reales y barberías certificadas.</p>
        </div>
        <div className="hero-highlight-card">
          <h3>Rápido</h3>
          <p>Busca, compara y reserva sin salir de la app.</p>
        </div>
        <div className="hero-highlight-card">
          <h3>Fácil</h3>
          <p>Controla todas tus citas desde un solo panel.</p>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
