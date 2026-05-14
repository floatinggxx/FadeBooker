
import React from 'react';
import HeroSection from '../components/organisms/HeroSection';
import FeaturesSection from '../components/organisms/FeaturesSection';
import HowItWorksSection from '../components/organisms/HowItWorksSection';
import TestimonialsSection from '../components/organisms/TestimonialsSection';
import { ButtonLink } from '../components/atoms/ButtonLink';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />

      <section className="container mb-10">
        <div className="card-surface cta-panel">
          <div>
            <h2 className="section-highlight">¿Listo para tu primer corte?</h2>
            <p>Regístrate ahora y descubre barberías, perfiles y reservas con una experiencia visual moderna.</p>
          </div>
          <div className="hero-actions">
            <ButtonLink to="/register" variant="primary">Crear cuenta</ButtonLink>
            <ButtonLink to="/barberias" variant="blue">Ir a barberías</ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
