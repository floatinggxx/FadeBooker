import React, { useState } from 'react';
import FAQItem from '../molecules/FAQItem';

const faqs = [
  { question: '¿Cómo puedo actualizar mi perfil?', answer: 'Ingresa a la sección "Mi Perfil" cuando hayas iniciado sesión. Ahí podrás editar tus datos personales y ver la información actualizada en tiempo real.' },
  { question: '¿Cómo agendo una cita?', answer: 'En "Barberías", selecciona un barbero y un servicio disponible, elige fecha y hora, y confirma la reserva. Después podrás ver tus citas en "Mis Citas" con todos los detalles.' },
  { question: '¿Cómo cancelo una cita?', answer: 'Desde la sección "Mis Citas", selecciona la cita que deseas cancelar y confirma la acción. Recibirás la cancelación en tu perfil.' },
  { question: '¿Es seguro mi información?', answer: 'Sí. FadeBooker utiliza autenticación segura y guarda tus datos de forma confiable.' }
];

const supportCards = [
  { title: '📍 Encuentra tu barbería', description: 'Explora barberías disponibles y encuentra la que mejor se adapte a tu estilo y ubicación.', theme: 'blue' },
  { title: '🔐 Acceso seguro', description: 'Crea tu cuenta o inicia sesión para gestionar tus reservas de forma rápida y segura.', theme: 'red' },
  { title: '🗓️ Gestiona tus reservas', description: 'Reserva, reprograma o cancela tus citas cuando lo necesites.', theme: 'green' }
];

const FAQSection: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState(faqs[0].question);

  return (
    <section className="page-content container animate-fade-in-up help-page">
      <div className="help-top">
        <div className="section-heading">
          <h1>Centro de ayuda</h1>
          <p>Resuelve tus dudas clave y recupera el control de tu experiencia en FadeBooker.</p>
        </div>
        <div className="help-summary card-surface">
          <p>Identifica rápidamente el origen de los problemas y sigue los pasos para que el sitio funcione con normalidad. Si necesitas atención personalizada, también tenemos soporte por correo.</p>
        </div>
      </div>

      <div className="support-grid mb-8">
        {supportCards.map((card) => (
          <article key={card.title} className={`support-card support-card-${card.theme}`}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </div>

      <div className="faq-card">
        <div className="faq-card-header">
          <h2>Preguntas frecuentes</h2>
          <p>Haz clic en cada pregunta para ver la respuesta y navegar con más claridad por la aplicación.</p>
        </div>
        {faqs.map((item) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            open={activeQuestion === item.question}
            onToggle={() => setActiveQuestion(activeQuestion === item.question ? '' : item.question)}
          />
        ))}
      </div>

      <div className="card-surface help-contact-card">
        <h2>¿Aún no encuentras tu respuesta?</h2>
        <p>Escríbenos a <a href="mailto:soporte@fadebooker.com" className="text-accent underline">soporte@fadebooker.com</a> y te ayudaremos de manera personalizada.</p>
      </div>
    </section>
  );
};

export default FAQSection;
