import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewModal from '@/components/molecules/ReviewModal';
import { NotificationProvider } from '@/context/NotificationContext';

vi.mock('@/lib/api/bookingService', () => ({
  bookingService: {
    dejarResena: vi.fn(),
  },
}));

import { bookingService } from '@/lib/api/bookingService';
const dejarResenaMock = bookingService.dejarResena as any;

describe('ReviewModal', () => {
  beforeEach(() => {
    dejarResenaMock.mockReset();
  });

  it('envía la reseña predeterminada cuando el comentario está vacío', async () => {
    dejarResenaMock.mockResolvedValueOnce({});
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    render(
      <NotificationProvider>
        <ReviewModal
          isOpen
          onClose={onClose}
          onSuccess={onSuccess}
          bookingId={123}
          barberName="Juan"
        />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(dejarResenaMock).toHaveBeenCalledWith(123, {
        puntuacion: 5,
        comentario: 'Sin comentarios',
      });
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('envía el comentario personalizado cuando el usuario lo ingresa', async () => {
    dejarResenaMock.mockResolvedValueOnce({});
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    render(
      <NotificationProvider>
        <ReviewModal
          isOpen
          onClose={onClose}
          onSuccess={onSuccess}
          bookingId={456}
          barberName="María"
        />
      </NotificationProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Cuéntanos tu experiencia/i), {
      target: { value: 'Excelente servicio' },
    });
    fireEvent.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(dejarResenaMock).toHaveBeenCalledWith(456, {
        puntuacion: 5,
        comentario: 'Excelente servicio',
      });
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('no llama a onSuccess cuando el envío de reseña falla', async () => {
    dejarResenaMock.mockRejectedValueOnce(new Error('API error'));
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    render(
      <NotificationProvider>
        <ReviewModal
          isOpen
          onClose={onClose}
          onSuccess={onSuccess}
          bookingId={789}
          barberName="Lola"
        />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(dejarResenaMock).toHaveBeenCalled();
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
