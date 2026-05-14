import React from 'react';
import BookingCard from '../molecules/BookingCard';

interface BookingItem {
  id: number;
  fecha: string;
  hora: string;
  barberoName: string;
  servicioName: string;
  estado: string;
  notas?: string;
}

interface BookingsSectionProps {
  bookings: BookingItem[];
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ bookings }) => (
  <section className="page-content container animate-fade-in-up">
    <div className="section-heading">
      <h1>Mis Citas</h1>
      <p>Revisa tus próximas reservas y accede a la información de cada barbero.</p>
    </div>
    <div className="grid gap-4">
      {bookings.map((item) => (
        <BookingCard
          key={item.id}
          dateTime={`${item.fecha} ${item.hora}`}
          barberName={item.barberoName}
          serviceName={item.servicioName}
          status={item.estado}
          notes={item.notas}
        />
      ))}
    </div>
  </section>
);

export default BookingsSection;
