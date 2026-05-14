import React from 'react';
import FeatureCard from '../molecules/FeatureCard';

const features = [
  {
    title: 'Barberías cercanas',
    description: 'Encuentra lugares verificados cerca de tu comuna y reserva en segundos desde cualquier dispositivo.'
  },
  {
    title: 'Gestión de citas',
    description: 'Revisa tus próximas citas, historial y cambia tu reserva cuando lo necesites.'
  },
  {
    title: 'Perfil personalizado',
    description: 'Mantén tus datos al día y recibe recomendaciones basadas en tus preferencias.'
  }
];

const FeaturesSection: React.FC = () => (
  <section className="container animate-fade-in-up">
    <div className="section-heading">
      <h2>Todo listo para comenzar</h2>
      <p>Tu panel de usuario te permite ver perfil, citas y barberías recomendadas desde el primer acceso.</p>
    </div>
    <div className="feature-grid mb-8">
      {features.map((feature) => (
        <FeatureCard key={feature.title} title={feature.title} description={feature.description} />
      ))}
    </div>
  </section>
);

export default FeaturesSection;
