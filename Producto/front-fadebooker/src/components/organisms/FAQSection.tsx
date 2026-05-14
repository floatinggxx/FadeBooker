import React, { useState } from 'react';
import FAQItem from '../molecules/FAQItem';

const faqs = [
  { question: '¿Por qué no cargan las barberías?', answer: 'Si no aparecen barberías, lo más probable es que el backend no esté activo o que la base de datos no esté conectada. El frontend solicita la lista a /api/barberos, por lo que ambos deben estar funcionando.' },
  { question: '¿Qué hacer si el registro falla?', answer: 'Verifica que la API esté corriendo y que la variable VITE_API_URL apunte al servidor correcto. Si el backend está activo, revisa el mensaje de error que devuelve la API.' },
  { question: '¿Cómo puedo actualizar mi perfil?', answer: 'Ingresa a la sección Mi Perfil cuando hayas iniciado sesión. Ahí podrás editar tus datos y ver tu información actualizada.' },
  { question: '¿Cómo agendo una cita?', answer: 'En Barberías, selecciona un barbero y un servicio disponible, elige fecha y hora, y confirma la reserva. Después podrás ver tus citas en Mis Citas.' }
];

const FAQSection: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState(faqs[0].question);

  return (
    <section className="page-content container animate-fade-in-up">
      <div className="section-heading">
        <h1>Centro de ayuda</h1>
        <p>Resuelve tus dudas clave y recupera el control de tu experiencia en FadeBooker.</p>
      </div>
      <div className="help-grid mb-8">
        <article className="card-surface">
          <h2>Conexión de barberías</h2>
          <p>El panel de barberías depende directamente de la API. Si no ves resultados, revisa que el backend esté levantado y conectado a la base de datos.</p>
        </article>
        <article className="card-surface">
          <h2>Registro y login</h2>
          <p>El registro crea tu usuario en la base de datos. El login solo funciona si el backend devuelve un token válido y guarda tu sesión en el navegador.</p>
        </article>
      </div>
      <div className="faq-card">
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
      <div className="card-surface mt-8">
        <h2>Contacto</h2>
        <p className="text-sm">Si el problema persiste, escríbenos a <a href="mailto:soporte@fadebooker.com" className="text-accent underline">soporte@fadebooker.com</a> y te ayudaremos a revisar backend, API y conexión.</p>
      </div>
    </section>
  );
};

export default FAQSection;
