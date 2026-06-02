import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import api from '@/lib/api';
import { bookingService } from '@/lib/api/bookingService';

vi.mock('@/lib/api');

const mockedApiGet = vi.mocked(api.get);

describe('bookingService.getCitasProximas', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 26, 10, 0, 0));
    mockedApiGet.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve solo citas futuras según la fecha y hora actuales', async () => {
    mockedApiGet.mockResolvedValueOnce({
      data: [
        { id: 1, fecha: '2026-05-26', hora: '09:00', estado: 'confirmada' },
        { id: 2, fecha: '2026-05-26', hora: '11:00', estado: 'confirmada' },
        { id: 3, fecha: '2026-05-27', hora: '08:00', estado: 'confirmada' },
      ],
    });

    const result = await bookingService.getCitasProximas(42);

    expect(mockedApiGet).toHaveBeenCalledWith('/citas', {
      params: { clienteId: 42, estado: 'confirmada' },
    });
    expect(result).toEqual([
      { id: 2, fecha: '2026-05-26', hora: '11:00', estado: 'confirmada' },
      { id: 3, fecha: '2026-05-27', hora: '08:00', estado: 'confirmada' },
    ]);
  });
});
