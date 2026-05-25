import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { tiendaService } from '@/lib/api/tiendaService';
import { PLACEHOLDERS, FALLBACK_URLS } from '@/lib/utils/placeholders';
import { rmFallbackTiendas } from '@/lib/utils/tiendasFallback';
import { STUDIO_DANGER_BARBERS } from '@/lib/data/studioDangerData';

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

  const fallbackTienda = useMemo(() => {
    if (!id) return null;
    return rmFallbackTiendas.find((item) => String(item.id_tienda) === String(id)) || null;
  }, [id]);

  if (loadingTienda || loadingBarberos) return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E7EB]">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-rose-500 rounded-full animate-spin"></div>
    </div>
  );
  
  const isStudioDangerFallback = id === '101' && Array.isArray(barberos) && barberos.length === 0;
  const barberosToRender = isStudioDangerFallback ? STUDIO_DANGER_BARBERS : barberos || [];
  const tiendaData = tienda || fallbackTienda;

  if (!tiendaData) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#E5E7EB]">
      <div className="text-center bg-white p-10 rounded-[3rem] shadow-xl max-w-sm">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Tienda no encontrada</h2>
        <Link to="/barberias" className="text-rose-500 font-bold hover:underline">Volver a la búsqueda</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] pt-12 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Shop Section */}
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-center bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/40">
          <div className="overflow-hidden rounded-[2.5rem] shadow-2xl">
            <img
              src={tiendaData.foto_portada_url || PLACEHOLDERS.TIENDA}
              alt={tiendaData.nombre_tienda}
              className="w-full h-full min-h-[420px] object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== FALLBACK_URLS.TIENDA) {
                  target.src = FALLBACK_URLS.TIENDA;
                }
              }}
            />
          </div>

          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-[#2563EB] px-5 py-2 text-xs font-black uppercase tracking-[0.35em] text-white shadow-lg shadow-sky-300/10">
                StudioDanger
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-black uppercase tracking-[0.25em] text-slate-600">
                <Star size={14} className="text-amber-400" />
                {tiendaData.calificacion_promedio?.toFixed(1) || '5.0'}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight text-slate-900">{tiendaData.nombre_tienda}</h1>
              <p className="text-xl leading-relaxed text-slate-600 max-w-xl">
                Barbería premium en Quilicura especializada en cortes de diseño, barba premium y atención personalizada con ambiente moderno.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 font-black">Ubicación</p>
                <p className="mt-3 text-lg font-black text-slate-900">{tiendaData.ciudad}, Región Metropolitana</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 font-black">Horario</p>
                <p className="mt-3 text-lg font-black text-slate-900">Lun - Vie 09:00 - 19:00</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-slate-900 px-10 py-4 text-base font-black text-white transition hover:bg-slate-800">
                Información
              </button>
              <button className="rounded-full border border-slate-200 bg-white px-10 py-4 text-base font-black text-slate-900 transition hover:bg-slate-50">
                Ubicación
              </button>
            </div>
          </div>
        </div>

        {/* Barbers Selection Section */}
        <section className="space-y-6">
          <div className="mb-12 text-center md:text-left">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-10 w-1.5 bg-rose-500 rounded-full"></div>
              <h2 className="text-4xl font-black text-slate-900">Reserva tu cita</h2>
            </div>
            <p className="text-slate-500 font-bold text-lg uppercase tracking-tight ml-5">Paso 3: Selecciona tu barbero de confianza</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-start">
            {/* "Cualquier Barbero" Card */}
            <div className="rounded-[3rem] bg-[#3366FF] p-10 text-center group hover:scale-[1.02] transition-all cursor-pointer shadow-2xl shadow-blue-200/50 relative overflow-hidden flex flex-col justify-center items-center">
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

                <Link
                  to="/studiodeanger/reservar"
                  className="w-full py-6 bg-white text-[#3366FF] rounded-[2rem] font-black text-xl hover:bg-rose-500 hover:text-white active:bg-rose-600 active:text-white transition-all shadow-xl"
                >
                    Ver disponibilidad
                </Link>
            </div>

            {/* List of Barbers */}
            {barberosToRender && barberosToRender.length > 0 ? (
                barberosToRender.map((barbero) => {
                  const bookingLink = isStudioDangerFallback
                    ? `/studiodeanger/reservar?barberoId=${barbero.id_barbero || barbero.id}`
                    : `/barbero/${barbero.id_barbero || barbero.id}`;
                  return (
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
                            to={bookingLink} 
                            className="block w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-[#3366FF] hover:text-white active:bg-blue-700 active:text-white transition-all shadow-xl shadow-slate-200 hover:shadow-blue-200 hover:-translate-y-2 active:translate-y-0"
                        >
                            Ver disponibilidad
                        </Link>
                    </div>
                  );
                })
            ) : (
                <div className="rounded-[3rem] border border-dashed border-slate-300 bg-white/80 p-12 text-center text-slate-500 shadow-lg shadow-slate-200/30">
                    <p className="text-base font-black uppercase tracking-[0.35em] text-slate-400 mb-4">Barberos disponibles</p>
                    <p className="text-xl font-black text-slate-900">Aún no hay barberos registrados en esta tienda.</p>
                    <p className="mt-4 text-sm leading-relaxed">Revisa otra barbería o vuelve más tarde para conocer los barberos disponibles en StudioDanger.</p>
                </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TiendaDetailPage;
