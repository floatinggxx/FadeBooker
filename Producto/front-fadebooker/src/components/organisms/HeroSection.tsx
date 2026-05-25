import React from 'react';
import HeroActions from '../molecules/HeroActions';
import ImageCarousel from '../ui/ImageCarousel';

const HeroSection: React.FC = () => (
  <section className="container hero-section animate-fade-in-up">
    {/* 1. La Promesa (El Título) */}
    <div className="hero-content-top">
      <h1 className="hero-title">Reserva tu corte ideal y gestiona tu estilo con una experiencia premium.</h1>
    </div>

    {/* 2. La Inspiración (El Carrusel) */}
    <div className="hero-visual-wide animate-appearance">
      <ImageCarousel />
    </div>

    {/* 3. El Reconocimiento (Prueba Social Rápida) */}
    <div className="hero-trust-subtle">
      <div className="trust-pill"><span>✓</span> +1.200 reservas completadas</div>
      <div className="trust-pill"><span>★</span> 4.9/5 calificación promedio</div>
      <div className="trust-pill"><span>📍</span> 150 barberías confiables</div>
    </div>

    {/* 4. La Experiencia (Detalles Técnicos) */}
    <div className="hero-metrics-grid">
      <div className="hero-metric-card">
        <div className="metric-icon">⚡</div>
        <div className="metric-info">
          <strong>Reservas instantáneas</strong>
          <p>Agenda en menos de 30 segundos sin llamadas.</p>
        </div>
      </div>
      <div className="hero-metric-card">
        <div className="metric-icon">📍</div>
        <div className="metric-info">
          <strong>Barberías verificadas</strong>
          <p>Solo lugares con calificaciones reales y calidad probada.</p>
        </div>
      </div>
      <div className="hero-metric-card">
        <div className="metric-icon">⭐</div>
        <div className="metric-info">
          <strong>Estilo personalizado</strong>
          <p>Encuentra al barbero que entiende exactamente lo que buscas.</p>
        </div>
      </div>
    </div>

    {/* 5. El Cierre y Acción (Conversión) */}
    <div className="hero-cta-block">
      <div className="cta-content">
        <p className="hero-text">Explora barberías cercanas, compara servicios y agenda tu cita con un solo clic.</p>
        <HeroActions />
      </div>
    </div>

    {/* 6. La Identidad (Valores de Marca) */}
    <div className="hero-highlights-row">
      <div className="identity-badge">
        <span className="dot blue"></span>
        <span className="label">CONFIABLE</span>
      </div>
      <div className="identity-badge">
        <span className="dot red"></span>
        <span className="label">RÁPIDO</span>
      </div>
      <div className="identity-badge">
        <span className="dot accent"></span>
        <span className="label">FÁCIL</span>
      </div>
    </div>
  </section>
);

export default HeroSection;
