import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { tiendaService } from '@/lib/api/tiendaService';
import { PLACEHOLDERS, FALLBACK_URLS } from '@/lib/utils/placeholders';

const TiendaDetailPage: React.FC = () => {
  const { id } = useParams();
  
  const { data: tienda, isLoading: loadingTienda } = useQuery({
    queryKey: ['tienda', id],
    queryFn: () => tiendaService.getTiendaById(Number(id)),
    enabled: !!id,
  });

  const { data: barberos, isLoading: loadingBarberos } = useQuery({
    queryKey: ['tienda-barberos', id],
    queryFn: () => tiendaService.getBarberosByTienda(Number(id)),
    enabled: !!id,
  });

  if (loadingTienda || loadingBarberos) return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E7EB]">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-rose-500 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!tienda) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#E5E7EB]">
      <div className="text-center bg-white p-10 rounded-[3rem] shadow-xl max-w-sm">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Tienda no encontrada</h2>
        <Link to="/barberias" className="text-rose-500 font-bold hover:underline">Volver a la búsqueda</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E5E7EB] pt-12 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Shop Section */}
        <div className="flex flex-col md:flex-row gap-12 mb-16 bg-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="w-full md:w-1/2">
                <img 
                    src={tienda.foto_portada_url || PLACEHOLDERS.TIENDA} 
                    alt={tienda.nombre_tienda} 
                    className="w-full h-96 object-cover rounded-[2.5rem] shadow-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== FALLBACK_URLS.TIENDA) {
                        target.src = FALLBACK_URLS.TIENDA;
                      }
                    }}
                />
            </div>
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[#3366FF] text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                        PREMIUM SHOP
                    </span>
                    <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-full text-sm font-black border border-yellow-100">
                        ★ {tienda.calificacion_promedio || 5.0}
                    </div>
                </div>
                <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight leading-none">{tienda.nombre_tienda}</h1>
                <p className="text-slate-500 flex items-center gap-3 text-2xl font-medium mb-8">
                    <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {tienda.ciudad}, Región Metropolitana
                </p>
                <div className="flex flex-wrap gap-4">
                    <button className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black shadow-2xl hover:bg-slate-800 active:bg-slate-700 transition-all">
                        Información
                    </button>
                    <button className="px-10 py-5 bg-white border-4 border-slate-100 text-slate-700 rounded-3xl font-black hover:bg-slate-50 active:bg-slate-100 transition-all">
                        Ubicación
                    </button>
                </div>
            </div>
        </div>

        {/* Barbers Selection Section */}
        <div className="mb-12 text-center md:text-left">
            <div className="flex items-center gap-4 mb-3">
               <div className="h-10 w-1.5 bg-rose-500 rounded-full"></div>
               <h2 className="text-4xl font-black text-slate-900">Reserva tu cita</h2>
            </div>
            <p className="text-slate-500 font-bold text-lg uppercase tracking-tight ml-5">Paso 3: Selecciona tu barbero de confianza</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* "Cualquier Barbero" Card */}
            <div className="bg-[#3366FF] p-10 rounded-[3.5rem] text-center group hover:scale-[1.02] transition-all cursor-pointer shadow-2xl shadow-blue-200/50 relative overflow-hidden flex flex-col justify-center items-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                
                <div className="w-24 h-24 bg-white/20 text-white rounded-[2rem] flex items-center justify-center text-4xl shadow-xl backdrop-blur-md mb-8 group-hover:rotate-12 transition-transform">
                   ⚡
                </div>
                
                <div className="flex-1">
                   <h3 className="text-3xl font-black text-white mb-2 leading-tight">Cualquier Barbero</h3>
                   <p className="text-blue-100/80 text-sm font-bold uppercase tracking-widest mb-10">Asignación automática</p>
                </div>
                
                <div className="w-full py-5 bg-white/10 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest border border-white/20 mb-8 backdrop-blur-sm">
                   Disponibilidad Inmediata
                </div>

                <button className="w-full py-6 bg-white text-[#3366FF] rounded-[2rem] font-black text-xl hover:bg-rose-500 hover:text-white active:bg-rose-600 active:text-white transition-all shadow-xl">
                    Seleccionar
                </button>
            </div>

            {/* List of Barbers */}
            {barberos && barberos.length > 0 ? (
                barberos.map(barbero => (
                    <div key={barbero.id_barbero || barbero.id} className="bg-white border-4 border-white p-8 rounded-[3.5rem] text-center shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-[#3366FF]/20 transition-all group relative flex flex-col">
                        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-2xl text-xs font-black border border-slate-100 shadow-xl z-10 transition-transform group-hover:scale-110">
                           <Star size={14} className="text-yellow-500 fill-yellow-500" />
                           {barbero.calificacion || barbero.calificacion_promedio || 4.9}
                        </div>
                        
                        <div className="w-48 h-48 rounded-[3rem] overflow-hidden mx-auto mb-8 shadow-2xl shadow-slate-300/50 relative group-hover:rotate-2 transition-all duration-500 bg-slate-50">
                             <img 
                                src={barbero.foto_perfil_url || barbero.foto || PLACEHOLDERS.BARBERO} 
                                alt={barbero.nombre} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== FALLBACK_URLS.BARBERO) {
                                      target.src = FALLBACK_URLS.BARBERO;
                                    }
                                }}
                             />
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-3xl font-black text-slate-900 mb-1 leading-tight group-hover:text-[#3366FF] transition-colors">
                                {barbero.nombre} {barbero.apellido}
                            </h3>
                            <p className="text-slate-400 font-bold uppercase tracking-tighter text-xs mb-8">{barbero.especialidad || 'MÁSTER BARBERO'}</p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-3 mb-10 bg-[#E8F1FF] text-[#3366FF] py-5 px-4 rounded-[2.2rem] font-black text-[12px] uppercase tracking-tighter border-2 border-blue-50/50 shadow-inner min-h-[72px]">
                           <div className="w-2.5 h-2.5 bg-[#3366FF] rounded-full animate-pulse shadow-[0_0_10px_rgba(51,102,255,0.5)] shrink-0"></div>
                           <span className="leading-tight">Disponible 09 a 18 hrs</span>
                        </div>

                        <Link 
                            to={`/barbero/${barbero.id_barbero || barbero.id}`} 
                            className="block w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-[#3366FF] hover:text-white active:bg-blue-700 active:text-white transition-all shadow-xl shadow-slate-200 hover:shadow-blue-200 hover:-translate-y-2 active:translate-y-0"
                        >
                            Ver Perfil
                        </Link>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-16 text-center text-slate-400 font-bold text-xl italic bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200">
                    Aún no hay barberos registrados en esta tienda.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TiendaDetailPage;
