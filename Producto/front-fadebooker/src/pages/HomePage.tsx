
import React from 'react';
import HeroSection from '../components/organisms/HeroSection';
import WhyChooseSection from '../components/organisms/WhyChooseSection';
import FeaturesSection from '../components/organisms/FeaturesSection';
import HowItWorksSection from '../components/organisms/HowItWorksSection';
import TestimonialsSection from '../components/organisms/TestimonialsSection';
import { ButtonLink } from '../components/atoms/ButtonLink';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-content">
      <HeroSection />
      <WhyChooseSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />

      <section className="container mb-10">
        <div className="card-surface cta-panel">
          <div>
            <h2 className="section-highlight">¿Listo para tu primer corte?</h2>
            <p>{isAuthenticated ? 'Continúa gestionando tus citas y descubre nuevas barberías con tu sesión activa.' : 'Regístrate ahora y descubre barberías, perfiles y reservas con una experiencia visual moderna.'}</p>
          </div>
          <div className="hero-actions">
            {!isAuthenticated ? (
              <ButtonLink to="/register" variant="primary" className="hover:text-white active:text-white">Crear cuenta</ButtonLink>
            ) : (
              <ButtonLink to="/bookings" variant="primary" className="hover:text-white active:text-white">Ver mis citas</ButtonLink>
            )}
            <ButtonLink to="/barberias" variant="blue" className="hover:text-white active:text-white">
              {isAuthenticated ? 'Explorar barberías' : 'Ver barberías'}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
