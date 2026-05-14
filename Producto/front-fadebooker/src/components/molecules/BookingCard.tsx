import React from 'react';

interface BookingCardProps {
  dateTime: string;
  barberName: string;
  serviceName: string;
  status: string;
  notes?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({ dateTime, barberName, serviceName, status, notes }) => (
  <article className="booking-card card-surface animate-fade-in-up">
    <h3>{dateTime}</h3>
    <p><strong>Barbero:</strong> {barberName}</p>
    <p><strong>Servicio:</strong> {serviceName}</p>
    <p><strong>Estado:</strong> {status}</p>
    {notes && <p><strong>Notas:</strong> {notes}</p>}
  </article>
);

export default BookingCard;
