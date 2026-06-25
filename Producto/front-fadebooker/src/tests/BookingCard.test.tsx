import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookingCard from '../components/molecules/BookingCard';
import { NotificationProvider } from '../context/NotificationContext';

// Mock de servicios
vi.mock('@/lib/api/pagoService', () => ({
  pagoService: {
    procesarPago: vi.fn(),
  },
}));

vi.mock('@/lib/api/bookingService', () => ({
  bookingService: {
    cancelarCita: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      <NotificationProvider>{children}</NotificationProvider>
    </QueryClientProvider>
  );
};

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
    render(<BookingCard {...defaultProps} />, { wrapper: TestWrapper });

    expect(screen.getByText(/Valorar Servicio/i)).toBeDefined();
  });

  it('no debe mostrar el botón de valorar si el usuario es Barbero', () => {
    render(
      <BookingCard {...defaultProps} isBarberoView={true} />,
      { wrapper: TestWrapper }
    );

    expect(screen.queryByText(/Valorar Servicio/i)).toBeNull();
  });

  it('debe abrir el modal de reseña al hacer clic en valorar', async () => {
    render(<BookingCard {...defaultProps} />, { wrapper: TestWrapper });

    const btn = screen.getByText(/Valorar Servicio/i);
    fireEvent.click(btn);

    expect(screen.getByText(/Tu Opinión/i)).toBeDefined();
  });

  it('debe llamar onRemove al pulsar el botón de eliminar', () => {
    const onRemove = vi.fn();
    render(<BookingCard {...defaultProps} onRemove={onRemove} />, { wrapper: TestWrapper });

    fireEvent.click(screen.getByRole('button', { name: /eliminar cita/i }));

    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('debe mostrar la URL y la imagen generada por IA cuando estén disponibles', () => {
    render(
      <BookingCard
        {...defaultProps}
        aiImageUrl="https://example.com/ia-style.jpg"
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText(/diseño ia/i)).toBeDefined();
    expect(screen.getByRole('link', { name: /https:\/\/example\.com\/ia-style\.jpg/i })).toHaveAttribute('href', 'https://example.com/ia-style.jpg');
    expect(screen.getByAltText(/imagen generada por ia/i)).toBeInTheDocument();
  });
});
