import React from 'react';

const reasons = [
  { title: 'Agenda rápida', subtitle: 'Reserva en segundos sin filas ni llamadas.' },
  { title: 'Cerca de ti', subtitle: 'Encuentra barberías según tu ubicación y horario.' },
  { title: 'Reseñas reales', subtitle: 'Elige con confianza gracias a opiniones verificadas.' },
  { title: 'Recomendación IA', subtitle: 'Recibe sugerencias de estilo basadas en tu perfil.' }
];

const topBarbers = [
  { name: 'StudioDanger', score: '5.0' },
  { name: 'TutiBarber', score: '4.8' },
  { name: 'ManhattanStudio', score: '4.7' }
];

const WhyChooseSection: React.FC = () => (
  <section className="container animate-fade-in-up">
    <div className="why-choose-grid mb-10">
      <div className="why-choose-panel">
        <div className="section-heading">
          <h2>¿Por qué elegir FadeBooker?</h2>
          <p>Una plataforma diseñada para que tus reservas sean más rápidas, seguras y fáciles de administrar.</p>
        </div>
        <div className="why-choose-list">
          {reasons.map((item) => (
            <div key={item.title} className="why-choose-item">
              <span className="why-choose-dot" aria-hidden="true" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="why-choose-card">
        <div className="why-choose-card-top">
          <span className="tag-pill">Top recomendado</span>
          <h3>Reseñas reales. Resultados seguros.</h3>
          <p>Compara barberías de manera clara, con datos de calidad, imágenes y valoraciones actualizadas.</p>
        </div>
        <div className="why-choose-stat-grid">
          <div className="why-choose-stat">
            <strong>150+</strong>
            <p>Barberías verificadas</p>
          </div>
          <div className="why-choose-stat">
            <strong>4.9</strong>
            <p>Calif. promedio</p>
          </div>
          <div className="why-choose-stat">
            <strong>+1.200</strong>
            <p>Reservas completadas</p>
          </div>
        </div>
        <div className="top-barber-list">
          <h4>Barberías destacadas</h4>
          {topBarbers.map((barber) => (
            <div key={barber.name} className="top-barber">
              <span>{barber.name}</span>
              <strong>{barber.score}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseSection;
