import { Tienda } from '@/types';

export const recommendedTiendas: Tienda[] = [
  {
    id_tienda: 101,
    nombre_tienda: 'StudioDanger',
    direccion: 'Avenida Las Torres 152',
    ciudad: 'Quilicura',
    foto_portada_url: '/images/hero-2.svg',
    calificacion_promedio: 4.9,
  },
  {
    id_tienda: 102,
    nombre_tienda: 'TutiBarber',
    direccion: 'Avenida Manuel Antonio Matta 1400',
    ciudad: 'Quilicura',
    foto_portada_url: '/images/hero-3.svg',
    calificacion_promedio: 4.8,
  },
];

const RM_COMUNAS = [
  'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'Isla de Maipo',
  'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Lampa', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
  'Lo Prado', 'Macul', 'Maipú', 'María Pinto', 'Melipilla', 'Ñuñoa', 'Padre Hurtado', 'Paine', 'Pedro Aguirre Cerda', 'Peñaflor',
  'Peñalolén', 'Pirque', 'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca',
  'San Bernardo', 'San Joaquín', 'San José de Maipo', 'San Miguel', 'San Pedro', 'Santiago', 'Talagante', 'Til Til', 'Vitacura'
];

export const rmFallbackTiendas: Tienda[] = [
  ...recommendedTiendas,
  ...RM_COMUNAS.filter((comuna) => comuna !== 'Quilicura').map((comuna, index) => ({
    id_tienda: 200 + index,
    nombre_tienda: `Barbería ${comuna}`,
    direccion: `Av. ${comuna} 1234`,
    ciudad: comuna,
    calificacion_promedio: 4.4 + ((index % 5) * 0.1),
  }))
];
