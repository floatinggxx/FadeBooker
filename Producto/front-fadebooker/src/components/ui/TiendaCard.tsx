import React from 'react';
import { Tienda } from '@/types';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { PLACEHOLDERS, FALLBACK_URLS } from '@/lib/utils/placeholders';

interface TiendaCardProps {
  tienda: Tienda;
  isSuggested?: boolean;
}

const TiendaCard: React.FC<TiendaCardProps> = ({ tienda, isSuggested }) => {
  const fotoUrl = tienda.foto_portada_url || PLACEHOLDERS.TIENDA;
  const ratingValue = Number(tienda.calificacion_promedio);
  const hasRating = ratingValue > 0;

  return (
    <article className="group bg-white border border-slate-200 hover:border-[#3366FF]/20 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500 relative flex flex-col">
      {/* Badge Suggested */}
      {isSuggested && (
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-[#3366FF] text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg animate-pulse">
          <ShieldCheck size={16} /> RECOMENDADO
        </div>
      )}

      {/* Rating Badge */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black text-slate-900 shadow-xl">
        <Star size={16} className={hasRating ? "text-yellow-500 fill-yellow-500" : "text-slate-300"} />
        {hasRating ? ratingValue.toFixed(1) : <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Sin identificar</span>}
      </div>

      {/* Image Container */}
      <Link to={`/tienda/${tienda.id_tienda}`} className="relative h-64 overflow-hidden bg-slate-100 block">
        <img 
            src={fotoUrl} 
            alt={tienda.nombre_tienda} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== FALLBACK_URLS.TIENDA) {
                target.src = FALLBACK_URLS.TIENDA;
              }
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent"></div>
      </Link>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex-1">
            <Link to={`/tienda/${tienda.id_tienda}`}>
                <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight group-hover:text-[#3366FF] transition-colors">
                    {tienda.nombre_tienda}
                </h3>
            </Link>
            
            <p className="text-slate-400 font-bold uppercase tracking-tighter text-[11px] mb-6 flex items-center gap-2">
                <MapPin size={14} className="text-rose-500 shrink-0" />
                <span className="truncate">{tienda.direccion}, {tienda.ciudad}</span>
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
                <span className="bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border border-slate-100">
                    Corte Masculino
                </span>
                <span className="bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border border-slate-100">
                    Barba Premium
                </span>
            </div>
        </div>

        <Link 
            to={`/tienda/${tienda.id_tienda}`} 
            className="flex items-center justify-between w-full py-5 px-8 bg-[#1D4ED8] text-white rounded-[2rem] font-black text-xl hover:bg-[#2563EB] active:bg-[#1E40AF] transition-all group-hover:shadow-2xl translate-z-0"
        >
          VER TIENDA
          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default TiendaCard;
