import React from 'react';
import { Barbero } from '@/types';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Scissors } from 'lucide-react';
import { PLACEHOLDERS, FALLBACK_URLS } from '@/lib/utils/placeholders';

interface BarberCardProps {
  barber: Barbero;
}

const BarberCard: React.FC<BarberCardProps> = ({ barber }) => {
  const fotoUrl = barber.foto_perfil_url || PLACEHOLDERS.BARBERO;
  const rating = barber.calificacion_promedio || 4.9;

  return (
    <article className="group bg-white border-4 border-white hover:border-[#3366FF]/20 rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 relative flex flex-col">
      {/* Rating Badge */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black text-slate-900 shadow-xl">
        <Star size={16} className="text-yellow-500 fill-yellow-500" />
        {rating}
      </div>

      {/* Image Container */}
      <Link to={`/barbero/${barber.id_barbero || barber.id}`} className="relative h-72 overflow-hidden bg-slate-100 block">
        <img
            src={fotoUrl || PLACEHOLDERS.BARBERO}
            alt={barber.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== FALLBACK_URLS.BARBERO) {
                target.src = FALLBACK_URLS.BARBERO;
              }
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-6 left-8 flex items-center gap-3">
            <div className="p-3 bg-[#3366FF] text-white rounded-2xl shadow-lg shadow-blue-500/30">
                <Scissors size={20} />
            </div>
            <div>
                <p className="text-white font-black text-xs uppercase tracking-widest">{barber.especialidad || 'Máster Barbero'}</p>
                <p className="text-blue-100/80 font-bold text-[11px]">{barber.anos_experiencia || 5}+ años exper.</p>
            </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex-1">
            <Link to={`/barbero/${barber.id_barbero || barber.id}`}>
                <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight group-hover:text-[#3366FF] transition-colors">
                    {barber.nombre}
                </h3>
            </Link>
            
            <p className="text-slate-400 font-bold text-sm mb-8 line-clamp-2">
                Experto en transformaciones de estilo y asesoría de imagen personalizada.
            </p>
        </div>

        <Link 
            to={`/barbero/${barber.id_barbero || barber.id}`} 
            className="flex items-center justify-between w-full py-5 px-8 bg-slate-100 text-slate-900 rounded-[2rem] font-black text-xl hover:bg-[#3366FF] hover:text-white active:bg-blue-700 active:text-white transition-all group-hover:shadow-2xl"
        >
          VER PERFIL
          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default BarberCard;
