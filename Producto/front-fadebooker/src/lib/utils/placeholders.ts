// URL de respaldo (Unsplash) para asegurar una experiencia premium inmediata
export const FALLBACK_URLS = {
  TIENDA: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop',
  BARBERO: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop',
  AVATAR: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1200&auto=format&fit=crop',
};

export const PLACEHOLDERS = {
  TIENDA: FALLBACK_URLS.TIENDA, // Usamos fallback como base hasta tener locales
  BARBERO: FALLBACK_URLS.BARBERO,
  AVATAR: FALLBACK_URLS.AVATAR,
};
