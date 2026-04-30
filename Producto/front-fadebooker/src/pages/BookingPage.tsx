import React from 'react';
import BookingForm from '@/components/booking/BookingForm';

const BookingPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Reserva</h1>
      <BookingForm onSuccess={() => { window.location.href = '/bookings'; }} />
    </div>
  );
};

export default BookingPage;
