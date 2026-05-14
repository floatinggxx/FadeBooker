import React from 'react';
import HeroActions from '../molecules/HeroActions';
import ImageCarousel from '../ui/ImageCarousel';

const HeroSection: React.FC = () => (
  <section className="container hero-section animate-fade-in-up">
    <div className="hero-copy">
      <span className="hero-eyebrow">Barberías + Citas + Perfil</span>
      <h1 className="hero-title">Tu estilo, tu agenda y tus barberías favoritas en un solo lugar.</h1>
      <p className="hero-text">Regístrate, inicia sesión y descubre barberías cercanas con reseñas reales, atención premium y reservas en segundos.</p>
      <HeroActions />
      <div className="card-surface mt-8 hero-note">
        <p className="text-sm">Coloca tus imágenes en <code className="text-slate-700">Producto/front-fadebooker/public/images/</code> con estos nombres: <strong>slider-1.jpg</strong>, <strong>slider-2.jpg</strong> y <strong>slider-3.jpg</strong>. Si quieres un logo chulo en el header, guarda tu archivo como <strong>logo.svg</strong> dentro de <code className="text-slate-700">public/images/</code> y el sitio lo mostrará automáticamente.</p>
      </div>
    </div>
    <div className="hero-visual animate-appearance">
      <ImageCarousel />
    </div>
  </section>
);

export default HeroSection;
