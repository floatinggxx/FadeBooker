import React from 'react';
import TestimonialCard from '../molecules/TestimonialCard';

const testimonials = [
  { name: 'Fernando R.', quote: 'Reservar fue facilísimo y el barbero supo exactamente lo que quería. La app está muy bien diseñada.' },
  { name: 'María S.', quote: 'Me encanta que puedo ver mis citas y contactar al barbero desde el perfil. Súper práctico.' },
  { name: 'Diego P.', quote: 'Las barberías tienen buena información y es fácil comparar horarios. Muy recomendable.' }
];

const TestimonialsSection: React.FC = () => (
  <section className="container mb-8 animate-fade-in-up">
    <div className="section-heading">
      <h2>Testimonios</h2>
      <p>Lo que dicen nuestros usuarios sobre una experiencia de reserva rápida y confiable.</p>
    </div>
    <div className="testimonial-grid feature-grid">
      {testimonials.map((item) => (
        <TestimonialCard key={item.name} name={item.name} quote={item.quote} />
      ))}
    </div>
  </section>
);

export default TestimonialsSection;
