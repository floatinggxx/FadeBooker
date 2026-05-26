import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tiendaService } from '@/lib/api/tiendaService';

const reasons = [
  { title: 'Agenda rápida', subtitle: 'Reserva en segundos sin filas ni llamadas.' },
  { title: 'Cerca de ti', subtitle: 'Encuentra barberías según tu ubicación y horario.' },
  { title: 'Reseñas reales', subtitle: 'Elige con confianza gracias a opiniones verificadas.' },
  { title: 'Recomendación IA', subtitle: 'Recibe sugerencias de estilo basadas en tu perfil.' }
];

const WhyChooseSection: React.FC = () => {
  const { data: topBarbers, isLoading: loadingTop } = useQuery({
    queryKey: ['top-tiendas'],
    queryFn: async () => {
      const data = await tiendaService.listTiendas();
      return data
        .filter((t: any) => Number(t.calificacion_promedio) > 0)
        .sort((a: any, b: any) => Number(b.calificacion_promedio) - Number(a.calificacion_promedio))
        .slice(0, 5)
        .map((t: any) => ({
          name: t.nombre_tienda,
          score: Number(t.calificacion_promedio).toFixed(1)
        }));
    }
  });

  return (
    <section className="container animate-fade-in-up">
      <div className="why-choose-grid mb-10">
        <div className="why-choose-panel">
          <div className="section-heading">
            <h2>¿Por qué elegir FadeBooker?</h2>
            <p>Una plataforma diseñada para que tus reservas sean más rápidas, seguras y fáciles de administrar.</p>
          </div>
          <div className="why-choose-list">
            {reasons.map((item) => (
              <div key={item.title} className="why-choose-item">
                <span className="why-choose-dot" aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="why-choose-card">
          <div className="why-choose-card-top">
            <span className="tag-pill">Top recomendado</span>
            <h3>Reseñas reales. Resultados seguros.</h3>
            <p>Compara barberías de manera clara, con datos de calidad, imágenes y valoraciones actualizadas.</p>
          </div>
          <div className="why-choose-stat-grid">
            <div className="why-choose-stat">
              <strong>150+</strong>
              <p>Barberías verificadas</p>
            </div>
            <div className="why-choose-stat">
              <strong>4.9</strong>
              <p>Calif. promedio</p>
            </div>
            <div className="why-choose-stat">
              <strong>+1.200</strong>
              <p>Reservas completadas</p>
            </div>
          </div>
          <div className="top-barber-list">
            <h4>Barberías destacadas</h4>
            {loadingTop ? (
              <div className="animate-pulse space-y-4 pt-4">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl" />)}
              </div>
            ) : topBarbers?.map((barber: any) => (
              <div key={barber.name} className="top-barber">
                <span>{barber.name}</span>
                <strong>{barber.score}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
