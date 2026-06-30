import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, MapPin, Clock, Camera, MessageSquare, ChevronRight, Scissors } from 'lucide-react';
import { tiendaService } from '@/lib/api/tiendaService';
import { PLACEHOLDERS, FALLBACK_URLS } from '@/lib/utils/placeholders';
import { clsx } from 'clsx';
import { isTiendaOpen, formatHorarioRange } from '@/lib/utils/tienda';

const TiendaDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'servicios' | 'galeria' | 'comentarios'>('servicios');
  
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

  const { data: resenas, isLoading: loadingResenas } = useQuery({
    queryKey: ['tienda-resenas', id],
    queryFn: () => tiendaService.getResenasByTienda(Number(id)),
    enabled: !!id && activeTab === 'comentarios',
  });

  if (loadingTienda || loadingBarberos) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
      <div className="w-16 h-16 border-4 border-slate-700 border-t-sky-500 rounded-full animate-spin"></div>
    </div>
  );
  
  const barberosToRender = barberos || [];
  const tiendaData = tienda;

  if (!tiendaData) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0F172A]">
      <div className="text-center bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] shadow-2xl max-w-sm">
        <h2 className="text-4xl font-black text-white mb-6">Error 404</h2>
        <p className="text-slate-400 mb-8 font-medium">No hemos podido encontrar la barbería solicitada.</p>
        <Link to="/barberias" className="inline-flex items-center gap-2 bg-sky-500 text-white px-8 py-3 rounded-full font-black hover:bg-sky-400 transition-all">
          VOLVER <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );

  // Parse gallery
  let galeria: string[] = [];
  if (tiendaData.galeria) {
    try {
      galeria = typeof tiendaData.galeria === 'string' ? JSON.parse(tiendaData.galeria) : tiendaData.galeria;
    } catch (e) {
      galeria = [];
    }
  }

  // Helper to format time (handles strings like "19:30:00" or Date objects that show up as "1970...")
  const formatTime = (time: any) => {
    if (!time) return '';
    if (typeof time === 'string') {
      // If it's a full ISO string from a Date object starting with 1970
      if (time.startsWith('1970-01-01')) {
        return time.substring(11, 16) + ' hrs';
      }
      // If it's just "HH:mm:ss"
      return time.substring(0, 5) + ' hrs';
    }
    // If it's a Date object
    if (time instanceof Date) {
      return time.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) + ' hrs';
    }
    return time;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section - Inspired by StudioDanger Reference */}
      <section className="relative overflow-hidden bg-[#07112B] text-white pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.1),_transparent_40%)]" />
        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-5 py-2 text-xs font-black uppercase tracking-[0.35em] text-sky-400">
                  BARBERÍA PREMIUM
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-black uppercase tracking-[0.25em] text-slate-300 border border-white/10">
                  <Star size={14} className={Number(tiendaData.calificacion_promedio) > 0 ? "text-amber-400 fill-amber-400" : "text-slate-500"} />
                  {Number(tiendaData.calificacion_promedio) > 0 
                    ? tiendaData.calificacion_promedio?.toFixed(1) 
                    : <span className="text-[10px] text-slate-400">SIN IDENTIFICAR</span>
                  }
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl font-black tracking-tight text-white leading-tight">
                  {tiendaData.nombre_tienda}
                </h1>
                <p className="text-xl leading-relaxed text-slate-400 max-w-xl">
                  {tiendaData.nombre_tienda} redefine el estilo tradicional con técnicas modernas y atención personalizada de primer nivel.
                </p>

                <div className="flex items-center gap-3">
                  {(() => {
                    const s = isTiendaOpen(tiendaData);
                    return (
                      <div className={clsx('px-4 py-2 rounded-2xl font-black text-sm', s.open ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200')}>
                        {s.open ? 'Abierto ahora' : 'Cerrado'} • {formatHorarioRange(tiendaData.horario_apertura as any, tiendaData.horario_cierre as any)}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2.5rem] bg-white/5 p-7 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-sky-500/20 rounded-xl text-sky-400"><MapPin size={20} /></div>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-500 font-black">Ubicación</span>
                  </div>
                  <p className="text-lg font-bold text-white mb-1">{tiendaData.direccion}</p>
                  <p className="text-slate-400 font-medium">{tiendaData.comuna || (tiendaData as any).ciudad}, Chile</p>
                </div>
                <div className="rounded-[2.5rem] bg-white/5 p-7 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400"><Clock size={20} /></div>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-500 font-black">Horario</span>
                  </div>
                  <p className="text-lg font-bold text-white mb-1">
                    {tiendaData.dias_laborales 
                      ? (tiendaData.dias_laborales.length > 20 ? tiendaData.dias_laborales.substring(0, 17) + '...' : tiendaData.dias_laborales)
                      : 'Lunes a Sábado'}
                  </p>
                  <p className="text-slate-400 font-medium">
                    {formatTime(tiendaData.horario_apertura || '10:00')} - {formatTime(tiendaData.horario_cierre || '20:00')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 pt-4">
                <button 
                  onClick={() => setActiveTab('comentarios')}
                  className={clsx(
                    "rounded-full px-10 py-5 text-base font-black transition-all flex items-center gap-3",
                    activeTab === 'comentarios' ? "bg-white text-slate-900 shadow-2xl" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  )}
                >
                  <MessageSquare size={20} /> Comentarios
                </button>
                <button 
                  onClick={() => setActiveTab('galeria')}
                  className={clsx(
                    "rounded-full px-10 py-5 text-base font-black transition-all flex items-center gap-3",
                    activeTab === 'galeria' ? "bg-white text-slate-900 shadow-2xl" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  )}
                >
                  <Camera size={20} /> Galería
                </button>
              </div>
            </div>

            <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white/5 group">
              <img
                src={tiendaData.foto_portada_url || PLACEHOLDERS.TIENDA}
                alt={tiendaData.nombre_tienda}
                className="w-full h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== FALLBACK_URLS.TIENDA) {
                    target.src = FALLBACK_URLS.TIENDA;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <p className="text-white font-black text-2xl drop-shadow-lg">Explora nuestra experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm animate-fade-in">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-10 overflow-x-auto no-scrollbar py-1">
            <button 
              onClick={() => { setActiveTab('servicios'); document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={clsx(
                "py-6 text-sm font-black uppercase tracking-[0.2em] relative transition-colors shrink-0",
                activeTab === 'servicios' ? "text-sky-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Barberos y Reserva
              {activeTab === 'servicios' && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-sky-600 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('galeria')}
              className={clsx(
                "py-6 text-sm font-black uppercase tracking-[0.2em] relative transition-colors shrink-0",
                activeTab === 'galeria' ? "text-sky-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Galería
              {activeTab === 'galeria' && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-sky-600 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('comentarios')}
              className={clsx(
                "py-6 text-sm font-black uppercase tracking-[0.2em] relative transition-colors shrink-0",
                activeTab === 'comentarios' ? "text-sky-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Comentarios
              {activeTab === 'comentarios' && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-sky-600 rounded-full" />}
            </button>
          </div>
        </div>
      </div>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        
        {/* Content Switcher based on Tabs */}
        {activeTab === 'servicios' && (
          <section className="animate-fade-in-up">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-10 w-2 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Selecciona tu barbero</h2>
              </div>
              <p className="text-slate-500 font-bold text-lg uppercase tracking-widest ml-6">Elige el profesional que mejor se adapte a tu estilo</p>
            </div>

            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
              {/* "Cualquier Barbero" Card */}
              <div className="rounded-[3.5rem] bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] p-12 text-center group hover:scale-[1.02] transition-all cursor-pointer shadow-3xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-center items-center h-full min-h-[500px]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
                  
                  <div className="w-28 h-28 bg-white text-blue-600 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl mb-10 group-hover:rotate-12 transition-transform duration-500">
                     ✨
                  </div>
                  
                  <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Próxima Disponibilidad</h3>
                  <p className="text-blue-100/70 text-base font-bold uppercase tracking-[0.25em] mb-12">Asignación automática inteligente</p>
                  
                  <button
                    onClick={() => {
                      if (barberosToRender.length > 0) {
                        navigate(`/barbero/${barberosToRender[0].id_barbero || barberosToRender[0].id}`);
                      } else {
                        alert("No hay barberos registrados actualmente.");
                      }
                    }}
                    className="w-full py-8 bg-white text-blue-700 rounded-[2.5rem] font-black text-2xl hover:bg-slate-50 active:scale-95 transition-all shadow-2xl"
                  >
                      BUSCAR TURNO AHORA
                  </button>
              </div>

              {/* List of Barbers - Grid for more responsiveness */}
              <div className="grid gap-8 sm:grid-cols-2">
                {barberosToRender && barberosToRender.length > 0 ? (
                    barberosToRender.map((barbero) => (
                      <div key={barbero.id_barbero || barbero.id} className="bg-white p-8 rounded-[3.5rem] text-center shadow-xl shadow-slate-200/50 hover:shadow-2xl border-2 border-transparent hover:border-sky-500/10 transition-all group flex flex-col">
                          <div className="relative w-44 h-44 rounded-[3rem] overflow-hidden mx-auto mb-8 shadow-2xl bg-slate-50 border-4 border-white transition-transform group-hover:scale-105 duration-500">
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
                               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-2xl text-[10px] font-black shadow-lg border border-slate-100 flex items-center gap-1">
                                 <Star size={12} className={Number(barbero.calificacion || barbero.calificacion_promedio) > 0 ? "text-yellow-500 fill-yellow-500" : "text-slate-300"} />
                                 {Number(barbero.calificacion || barbero.calificacion_promedio) > 0 
                                   ? (barbero.calificacion || barbero.calificacion_promedio).toFixed(1) 
                                   : "S/I"
                                 }
                               </div>
                          </div>
                          
                          <div className="flex-1 space-y-2">
                              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                  {barbero.nombre} {barbero.apellido}
                              </h3>
                              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] pb-6">{barbero.especialidad || 'MÁSTER BARBERO'}</p>
                          </div>
                          
                          <Link 
                              to={`/barbero/${barbero.id_barbero || barbero.id}`} 
                              className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-lg hover:bg-sky-600 transition-all shadow-lg hover:shadow-sky-500/30 text-center uppercase tracking-wider"
                          >
                              Reservar
                          </Link>
                      </div>
                    ))
                ) : (
                    <div className="sm:col-span-2 rounded-[3.5rem] border-4 border-dashed border-rose-200 bg-rose-50/30 p-16 text-center text-rose-500 shadow-xl shadow-rose-100/20">
                        <Scissors size={48} className="mx-auto mb-6 text-rose-400 opacity-50" />
                        <h3 className="text-2xl font-black text-rose-900 mb-4 tracking-tight">Sin profesionales disponibles</h3>
                        <p className="text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
                            No hay barberos con servicios configurados actualmente en esta tienda. Por favor, revisa otras sedes.
                        </p>
                    </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Gallery Tab Content */}
        {activeTab === 'galeria' && (
          <section className="animate-fade-in-up">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-10 w-2 bg-sky-500 rounded-full"></div>
                <h2 className="text-4xl font-black text-slate-900">Nuestra Galería</h2>
              </div>
              <p className="text-slate-500 font-bold text-lg uppercase tracking-widest ml-6">El arte del recorte plasmado en cada detalle</p>
            </div>
            
            {galeria.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galeria.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-[2rem] overflow-hidden shadow-lg border-2 border-white hover:-translate-y-2 transition-transform duration-500">
                    <img src={img} alt={`Galería ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[4rem] bg-slate-100 p-24 text-center border-4 border-dashed border-slate-200">
                <Camera size={64} className="mx-auto mb-6 text-slate-300" />
                <p className="text-2xl font-black text-slate-400 uppercase tracking-widest">Galería pronto disponible</p>
              </div>
            )}
          </section>
        )}

        {/* Comments Tab Content */}
        {activeTab === 'comentarios' && (
          <section className="animate-fade-in-up">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-10 w-2 bg-sky-500 rounded-full"></div>
                <h2 className="text-4xl font-black text-slate-900">Reseñas de Clientes</h2>
              </div>
              <p className="text-slate-500 font-bold text-lg uppercase tracking-widest ml-6">Lo que dicen sobre {tiendaData.nombre_tienda}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {resenas && resenas.length > 0 ? (
                resenas.map((resena: any) => (
                  <div key={resena.id_resena} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100">
                    <div className="flex gap-1 text-amber-400 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="relative">
                          {/* Estrella de fondo (gris) */}
                          <Star size={20} className="text-slate-200" />
                          
                          {/* Estrella rellena (amber) con clipping para half stars */}
                          <div 
                            className="absolute top-0 left-0 overflow-hidden text-amber-400"
                            style={{ 
                              width: `${Math.max(0, Math.min(100, (resena.puntuacion - (star - 1)) * 100))}%` 
                            }}
                          >
                            <Star size={20} fill="currentColor" />
                          </div>
                        </div>
                      ))}
                      <span className="ml-2 text-slate-400 font-black text-sm">{resena.puntuacion}</span>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed italic mb-8">
                      "{resena.comentario}"
                    </p>
                    <div className="flex items-center gap-4">
                      {resena.foto_perfil_url ? (
                        <img src={resena.foto_perfil_url} className="w-14 h-14 rounded-2xl object-cover" alt={resena.nombre} />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                          {resena.nombre?.[0]}{resena.apellido?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-black text-slate-900">{resena.nombre} {resena.apellido}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                          {new Date(resena.fecha_resena).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 rounded-[3.5rem] bg-slate-50 p-16 text-center border-4 border-dashed border-slate-200">
                  <p className="text-2xl font-black text-slate-400 uppercase tracking-widest mb-4">Aún no hay reseñas</p>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">Esta barbería todavía no recibe comentarios de clientes.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TiendaDetailPage;
