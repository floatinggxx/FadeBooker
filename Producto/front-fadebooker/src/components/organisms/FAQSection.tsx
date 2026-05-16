import React, { useState } from 'react';
import FAQItem from '../molecules/FAQItem';

const faqs = [
  { question: '¿Por qué no cargan las barberías?', answer: 'Si no aparecen barberías, lo más probable es que el backend no esté activo o que la base de datos no esté conectada. El frontend solicita la lista a /api/barberos, por lo que ambos deben estar funcionando. Verifica que el servidor corra en puerto 3000.' },
  { question: '¿Qué hacer si el registro falla?', answer: 'Verifica que la API esté corriendo y que la variable VITE_API_URL apunte al servidor correcto. Si el backend está activo, revisa el mensaje de error que devuelve la API. Asegúrate de usar un email único no registrado.' },
  { question: '¿Cómo puedo actualizar mi perfil?', answer: 'Ingresa a la sección "Mi Perfil" cuando hayas iniciado sesión. Ahí podrás editar tus datos personales (nombre, teléfono, etc.) y ver tu información actualizada en tiempo real.' },
  { question: '¿Cómo agendo una cita?', answer: 'En "Barberías", selecciona un barbero y un servicio disponible, elige fecha y hora, y confirma la reserva. Después podrás ver tus citas en "Mis Citas" con todos los detalles de tu reserva.' },
  { question: '¿Cómo cancelo una cita?', answer: 'Desde la sección "Mis Citas", selecciona la cita que deseas cancelar y presiona el botón "Cancelar". Recibirás confirmación de la cancelación.' },
  { question: '¿Es seguro mi información?', answer: 'Sí. FadeBooker utiliza autenticación JWT segura, encriptación en las conexiones y almacenamiento seguro de datos en Azure SQL Server.' }
];

const HelpInfoCard: React.FC<{ title: string; description: string; icon: string; color: string }> = ({
  title,
  description,
  icon,
  color,
}) => (
  <article
    className="card-surface"
    style={{
      borderLeft: `4px solid ${color}`,
      transition: 'all 0.3s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div className="flex items-start gap-3">
      <span style={{ fontSize: '1.8rem' }}>{icon}</span>
      <div className="flex-1">
        <h3 style={{ color: color, marginTop: '0' }}>{title}</h3>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', margin: '0.5rem 0 0 0' }}>{description}</p>
      </div>
    </div>
  </article>
);

const FAQSection: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState(faqs[0].question);

  return (
    <section className="page-content container animate-fade-in-up">
      <div
        className="section-heading"
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
          borderBottom: '2px solid #e63946',
          paddingBottom: '2rem',
        }}
      >
        <h1 style={{ color: '#0f3460', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Centro de Ayuda</h1>
        <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>
          Resuelve tus dudas clave y recupera el control de tu experiencia en FadeBooker.
        </p>
      </div>

      <div
        className="help-grid mb-12"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        <HelpInfoCard
          title="Conexión de Barberías"
          description="El panel de barberías depende directamente de la API. Si no ves resultados, revisa que el backend esté levantado y conectado a la base de datos."
          icon="🔌"
          color="#0f3460"
        />
        <HelpInfoCard
          title="Registro y Login"
          description="El registro crea tu usuario en la base de datos. El login solo funciona si el backend devuelve un token válido y guarda tu sesión en el navegador."
          icon="🔐"
          color="#e63946"
        />
        <HelpInfoCard
          title="Gestión de Citas"
          description="Selecciona barbero, servicio, fecha y hora para agendar. Visualiza todas tus citas en 'Mis Citas' y cancela cuando necesites."
          icon="📅"
          color="#16a34a"
        />
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f0f5fb 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '3rem',
          borderTop: '3px solid #e63946',
        }}
      >
        <h2 style={{ color: '#0f3460', marginTop: '0', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          Preguntas Frecuentes
        </h2>
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
      </div>

      <div
        className="card-surface"
        style={{
          background: 'linear-gradient(135deg, #e63946 0%, #d62828 100%)',
          color: '#ffffff',
          textAlign: 'center',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 8px 24px rgba(230, 57, 70, 0.2)',
        }}
      >
        <h2 style={{ color: '#ffffff', marginTop: '0', marginBottom: '0.5rem' }}>¿Necesitas más ayuda?</h2>
        <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '1rem' }}>
          Si el problema persiste, contacta con nuestro equipo de soporte
        </p>
        <a
          href="mailto:soporte@fadebooker.com"
          style={{
            display: 'inline-block',
            background: '#ffffff',
            color: '#e63946',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          📧 soporte@fadebooker.com
        </a>
      </div>
    </section>
  );
};

export default FAQSection;
