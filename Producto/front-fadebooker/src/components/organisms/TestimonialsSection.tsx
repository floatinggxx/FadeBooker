import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tiendaService } from '@/lib/api/tiendaService';
import TestimonialCard from '../molecules/TestimonialCard';

const TestimonialsSection: React.FC = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['home-testimonials'],
    queryFn: async () => {
      const data = await tiendaService.listTiendas();
      const allResenas: any[] = [];
      
      // Obtenemos reseñas de las barberías mejor calificadas para el Home
      const topTiendas = data
        .filter((t: any) => Number(t.calificacion_promedio) > 0)
        .sort((a: any, b: any) => Number(b.calificacion_promedio) - Number(a.calificacion_promedio))
        .slice(0, 8);

      for (const tienda of topTiendas) {
        try {
          const tiendaId = tienda?.id_tienda ?? tienda?.id ?? 0;
          const resenas = await tiendaService.getResenasByTienda(tiendaId as string | number);
          const resenasConTienda = resenas.map((r: any) => ({
            name: `${r.nombre} ${r.apellido[0]}.`,
            quote: r.comentario,
            tienda: tienda.nombre_tienda
          }));
          allResenas.push(...resenasConTienda);
        } catch (e) {
          console.error("Error cargando reseñas para Home", e);
        }
      }
      
      // Mostrar hasta 8 si hay suficientes, sino las disponibles
      return allResenas.slice(0, 8);
    }
  });

  return (
    <section className="container mb-8 animate-fade-in-up">
      <div className="section-heading">
        <h2>Testimonios Reales</h2>
        <p>Opiniones verificadas de clientes que ya reservaron en sus barberías favoritas.</p>
      </div>
      <div className="testimonial-grid feature-grid">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="h-40 bg-white animate-pulse rounded-[2rem] shadow-sm"></div>)
        ) : (
          testimonials?.map((item: any, idx: number) => (
            <TestimonialCard key={idx} name={item.name} quote={item.quote} tienda={item.tienda} />
          ))
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
