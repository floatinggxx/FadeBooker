import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingCard from '../components/molecules/BookingCard';
import { NotificationProvider } from '../context/NotificationContext';

// Mock de servicios
vi.mock('@/lib/api/pagoService', () => ({
  pagoService: {
    procesarPago: vi.fn(),
  },
}));

describe('BookingCard Component', () => {
  const defaultProps = {
    id: 1,
    dateTime: '2026-05-26 10:00',
    barberName: 'Juan Barber',
    serviceName: 'Corte Degradado',
    status: 'completada',
    isBarberoView: false,
  };

  it('debe mostrar el botón de "Valorar Servicio" cuando la cita está completada', () => {
    render(
      <NotificationProvider>
        <BookingCard {...defaultProps} />
      </NotificationProvider>
    );

    expect(screen.getByText(/Valorar Servicio/i)).toBeDefined();
  });

  it('no debe mostrar el botón de valorar si el usuario es Barbero', () => {
    render(
      <NotificationProvider>
        <BookingCard {...defaultProps} isBarberoView={true} />
      </NotificationProvider>
    );

    expect(screen.queryByText(/Valorar Servicio/i)).toBeNull();
  });

  it('debe abrir el modal de reseña al hacer clic en valorar', async () => {
    render(
      <NotificationProvider>
        <BookingCard {...defaultProps} />
      </NotificationProvider>
    );

    const btn = screen.getByText(/Valorar Servicio/i);
    fireEvent.click(btn);

    expect(screen.getByText(/Tu Opinión/i)).toBeDefined();
  });
});
