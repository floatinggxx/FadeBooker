import { Promocion } from '@/types';

const STORAGE_PREFIX = 'fadebooker_promociones_';

const getStorageKey = (userId: string | number) => `${STORAGE_PREFIX}${userId}`;

const parseStoredData = (value: string | null): Promocion[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const promocionService = {
  listPromociones: (userId: string | number): Promocion[] => {
    const raw = localStorage.getItem(getStorageKey(userId));
    return parseStoredData(raw);
  },

  savePromociones: (userId: string | number, promociones: Promocion[]) => {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(promociones));
  },

  addPromocion: (userId: string | number, promocion: Omit<Promocion, 'id' | 'creadoEn'>): Promocion => {
    const promociones = promocionService.listPromociones(userId);
    const nuevaPromocion: Promocion = {
      ...promocion,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      creadoEn: new Date().toISOString(),
    };
    const updated = [nuevaPromocion, ...promociones];
    promocionService.savePromociones(userId, updated);
    return nuevaPromocion;
  },

  removePromocion: (userId: string | number, promocionId: string) => {
    const promociones = promocionService.listPromociones(userId);
    const updated = promociones.filter((item) => item.id !== promocionId);
    promocionService.savePromociones(userId, updated);
    return updated;
  },
};
