import React from 'react';
import BookingForm from '@/components/booking/BookingForm';

const BookingPage: React.FC = () => {
  return (
    <section className="page-content container booking-page">
      <div className="section-heading">
        <h1>Crear Reserva</h1>
        <p>Completa los datos para agendar tu corte con el barbero seleccionado.</p>
      </div>
      <div className="booking-layout">
        <div className="booking-card">
          <BookingForm onSuccess={() => { window.location.href = '/bookings'; }} />
        </div>
        <aside className="booking-aside">
          <div className="info-box">
            <h2>Consejos rápidos</h2>
            <ul>
              <li>Selecciona un barbero disponible</li>
              <li>Elige un servicio acorde a tu estilo</li>
              <li>Confirma tu cita con anticipación</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default BookingPage;
