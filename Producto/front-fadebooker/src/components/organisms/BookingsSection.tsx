import React from 'react';
import BookingCard from '../molecules/BookingCard';

interface BookingItem {
  id: number;
  fecha: string;
  hora: string;
  barberoName: string;
  clienteName: string;
  servicioName: string;
  estado: string;
  notas?: string;
  isBarberoView?: boolean;
  montoTotal?: number;
  pagoAbono?: number;
  createdAt?: string;
}

interface BookingsSectionProps {
  bookings: BookingItem[];
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ bookings }) => (
  <div className="grid gap-8">
    {bookings.map((item) => (
      <BookingCard
        key={item.id}
        id={item.id}
        dateTime={`${item.fecha} ${item.hora}`}
        barberName={item.barberoName}
        clienteName={item.clienteName}
        serviceName={item.servicioName}
        status={item.estado}
        notes={item.notas}
        isBarberoView={item.isBarberoView}
        montoTotal={item.montoTotal}
        pagoAbono={item.pagoAbono}
        createdAt={item.createdAt}
      />
    ))}
  </div>
);

export default BookingsSection;
