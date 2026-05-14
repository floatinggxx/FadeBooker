import React from 'react';
import StepCard from '../molecules/StepCard';

const steps = [
  { step: '1', title: 'Regístrate e inicia sesión', description: 'Crea tu usuario con correo y contraseña, luego accede a todo el contenido exclusivo.' },
  { step: '2', title: 'Explora barberías', description: 'Busca por nombre, especialidad o barrio y conoce la valoración de cada lugar.' },
  { step: '3', title: 'Agenda tu cita', description: 'Elige el barbero, selecciona la fecha y confirma tu reserva con un solo clic.' }
];

const HowItWorksSection: React.FC = () => (
  <section className="container animate-fade-in-up">
    <div className="section-heading">
      <h2>¿Cómo funciona?</h2>
      <p>Una experiencia creada para que tus reservas de barbería sean rápidas, seguras y con estilo.</p>
    </div>
    <div className="step-grid mb-8">
      {steps.map((item) => (
        <StepCard key={item.step} step={item.step} title={item.title} description={item.description} />
      ))}
    </div>
  </section>
);

export default HowItWorksSection;
