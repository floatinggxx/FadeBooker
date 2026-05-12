
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <section className="container hero-section">
        <div className="hero-copy">
          <span className="hero-eyebrow">Barberías + Citas + Perfil</span>
          <h1 className="hero-title">Tu estilo, tu agenda y tus barberías favoritas en un solo lugar.</h1>
          <p className="hero-text">Regístrate, inicia sesión y descubre barberías cercanas con reseñas reales, atención premium y reservas en segundos.</p>
          <div className="hero-actions">
            <Link to="/register" className="button button-primary button-glow">Crear cuenta</Link>
            <Link to="/barberias" className="button button-blue">Ver barberías</Link>
          </div>
          <div className="card-surface mt-8">
            <p className="text-sm">Coloca tus imágenes en <code className="text-slate-700">Producto/front-fadebooker/public/images/</code> con estos nombres: <strong>hero-1.svg</strong>, <strong>hero-2.svg</strong> y <strong>hero-3.svg</strong>. También puedes usar fotos reales de barberías.</p>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-images">
            <img src="/images/hero-1.svg" alt="Barbería moderna" />
            <img src="/images/hero-2.svg" alt="Cliente en barbería" />
            <div className="hero-card">
              <h3>Reserva rápido y sin complicaciones</h3>
              <p>Conecta con barberías cercanas, elige tu hora y mantén tus citas bajo control.</p>
            </div>
            <img src="/images/hero-3.svg" alt="Corte premium" />
          </div>
        </div>
      </section>

      <section className="container">
        <div className="section-heading">
          <h2>Todo listo para comenzar</h2>
          <p>Tu panel de usuario te permite ver perfil, citas y barberías recomendadas desde el primer acceso.</p>
        </div>

        <div className="feature-grid mb-8">
          <article className="card-surface">
            <h3>Barberías cercanas</h3>
            <p>Encuentra lugares verificados cerca de tu comuna y reserva en segundos desde cualquier dispositivo.</p>
          </article>
          <article className="card-surface">
            <h3>Gestión de citas</h3>
            <p>Revisa tus próximas citas, historial y cambia tu reserva cuando lo necesites.</p>
          </article>
          <article className="card-surface">
            <h3>Perfil personalizado</h3>
            <p>Mantén tus datos al día y recibe recomendaciones basadas en tus preferencias.</p>
          </article>
        </div>

        <div className="section-heading">
          <h2>¿Cómo funciona?</h2>
          <p>Una experiencia creada para que tus reservas de barbería sean rápidas, seguras y con estilo.</p>
        </div>

        <div className="step-grid mb-8">
          <article className="card-surface">
            <strong>1</strong>
            <h3>Regístrate e inicia sesión</h3>
            <p>Crea tu usuario con correo y contraseña, luego accede a todo el contenido exclusivo.</p>
          </article>
          <article className="card-surface">
            <strong>2</strong>
            <h3>Explora barberías</h3>
            <p>Busca por nombre, especialidad o barrio y conoce la valoración de cada lugar.</p>
          </article>
          <article className="card-surface">
            <strong>3</strong>
            <h3>Agenda tu cita</h3>
            <p>Elige el barbero, selecciona la fecha y confirma tu reserva con un solo clic.</p>
          </article>
        </div>
      </section>

      <section className="container mb-8">
        <div className="section-heading">
          <h2>Testimonios</h2>
          <p>Lo que dicen nuestros usuarios sobre una experiencia de reserva rápida y confiable.</p>
        </div>
        <div className="testimonial-grid feature-grid">
          <article className="card-surface">
            <h3>Fernando R.</h3>
            <p>"Reservar fue facilísimo y el barbero supo exactamente lo que quería. La app está muy bien diseñada."</p>
          </article>
          <article className="card-surface">
            <h3>María S.</h3>
            <p>"Me encanta que puedo ver mis citas y contactar al barbero desde el perfil. Súper práctico."</p>
          </article>
          <article className="card-surface">
            <h3>Diego P.</h3>
            <p>"Las barberías tienen buena información y es fácil comparar horarios. Muy recomendable."</p>
          </article>
        </div>
      </section>

      <section className="container mb-10">
        <div className="card-surface cta-panel">
          <div>
            <h2 className="section-highlight">¿Listo para tu primer corte?</h2>
            <p>Regístrate ahora y descubre barberías, perfiles y reservas con una experiencia visual moderna.</p>
          </div>
          <div className="hero-actions">
            <Link to="/register" className="button button-primary">Crear cuenta</Link>
            <Link to="/barberias" className="button button-blue">Ir a barberías</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
