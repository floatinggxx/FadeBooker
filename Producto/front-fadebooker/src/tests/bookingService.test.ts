import { describe, it, expect, vi } from 'vitest';
import { bookingService } from '@/lib/api/bookingService';
import api from '@/lib/api';

vi.mock('@/lib/api');

describe('bookingService Integration', () => {
  it('debe llamar al endpoint de reseña con los datos correctos', async () => {
    const mockData = { puntuacion: 4.5, comentario: 'Genial' };
    const citaId = 123;
    
    vi.mocked(api.post).mockResolvedValue({ data: { id: 1, mensaje: 'OK' } });

    await bookingService.dejarResena(citaId, mockData);

    expect(api.post).toHaveBeenCalledWith(`/citas/${citaId}/resena`, mockData);
  });
});


