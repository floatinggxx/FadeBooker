import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tiendaService } from '@/lib/api/tiendaService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import TiendaCard from '@/components/ui/TiendaCard';
import { Tienda } from '@/types';
import { MapPin, ChevronDown, Search, Navigation, X } from 'lucide-react';
import { regionesChile } from '@/lib/utils/chileData';
import { recommendedTiendas, rmFallbackTiendas } from '@/lib/utils/tiendasFallback';

interface SearchableSelectProps {
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder, icon, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => 
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedLabel = options.find(opt => opt.value === value)?.label || '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 pl-14 pr-12 bg-white border-4 border-white rounded-[2rem] shadow-xl text-left focus:ring-4 focus:ring-blue-100 focus:border-[#3366FF] transition-all text-slate-800 font-bold text-lg disabled:bg-slate-50 disabled:text-slate-400 group h-[84px] flex items-center"
      >
        <div className="absolute left-6 text-[#3366FF] group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="truncate">{selectedLabel || placeholder}</span>
        <div className="absolute right-6 text-slate-300">
          <ChevronDown size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-4 bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 border-b-2 border-slate-50 relative group">
            <div className="relative flex items-center">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3366FF] transition-colors" size={24} />
              <input
                autoFocus
                className="w-full p-5 pl-16 bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-[1.8rem] outline-none font-bold text-slate-700 h-[80px] text-xl transition-all"
                placeholder="Escribe para buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-8 py-5 hover:bg-slate-50 font-bold transition-colors flex items-center justify-between ${value === opt.value ? 'text-[#3366FF] bg-blue-50/50' : 'text-slate-600'}`}
                >
                  {opt.label}
                  {value === opt.value && <div className="w-2 h-2 bg-[#3366FF] rounded-full"></div>}
                </button>
              ))
            ) : (
              <div className="px-8 py-10 text-center text-slate-400 font-bold">
                No se encontraron resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const BarberiasPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedRegionId, setSelectedRegionId] = useState<number | ''>('');
  const [selectedComuna, setSelectedComuna] = useState('');
  const [search, setSearch] = useState('');

  const selectedRegion = useMemo(() => {
    return regionesChile.find(r => r.id === selectedRegionId);
  }, [selectedRegionId]);

  const isRegionMetropolitana = selectedRegion?.nombre === 'Región Metropolitana de Santiago';

  const { data: tiendas, isLoading, error } = useQuery({
    queryKey: ['tiendas', selectedComuna],
    queryFn: () => tiendaService.listTiendas(selectedComuna),
    enabled: !!selectedComuna && !isRegionMetropolitana,
  });

  const tiendasData = useMemo(() => {
    if (!selectedComuna) return recommendedTiendas;
    if (isRegionMetropolitana) return rmFallbackTiendas;
    return tiendas || [];
  }, [selectedComuna, isRegionMetropolitana, tiendas]);

  const filteredTiendas = useMemo(() => {
    let result = tiendasData;

    if (selectedComuna) {
      result = result.filter(t => t.ciudad === selectedComuna);
    }

    if (!isRegionMetropolitana && user?.rol === 'Barbero' && user.id_tienda) {
      result = result.filter(t => Number(t.id_tienda) === Number(user.id_tienda));
    }

    return result.filter(t => 
      t.nombre_tienda.toLowerCase().includes(search.toLowerCase())
    );
  }, [tiendasData, selectedComuna, search, user, isRegionMetropolitana]);

  const { data: allTiendas } = useQuery({
    queryKey: ['all-tiendas'],
    queryFn: () => tiendaService.listTiendas(''),
    enabled: !!selectedComuna && !isRegionMetropolitana && filteredTiendas.length === 0 && !isLoading,
  });

  const sugerencias = useMemo(() => {
    if (filteredTiendas.length > 0) return [];
    if (isRegionMetropolitana) return rmFallbackTiendas.slice(0, 2);
    return allTiendas?.slice(0, 2) || [];
  }, [filteredTiendas, allTiendas, isRegionMetropolitana]);

  if (error && !isRegionMetropolitana) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#E5E7EB]">
        <div className="text-center bg-white p-10 rounded-[3rem] shadow-xl max-w-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Error al cargar datos</h2>
            <p className="text-slate-500 font-bold mb-6">Error en la conexión con el servidor.</p>
            <button onClick={() => window.location.reload()} className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-rose-600 active:bg-rose-700 transition-all">REINTENTAR</button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E5E7EB] pt-12 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
             <div className="h-12 w-1.5 bg-[#3366FF] rounded-full"></div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">
               Barberías premium con reserva rápida
             </h2>
          </div>
          <p className="text-slate-500 font-bold text-lg mb-10 uppercase tracking-tighter">
            Busca por comuna y encuentra barberías reales y de prueba en todo Santiago.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <SearchableSelect 
              placeholder="Selecciona Región"
              icon={<Navigation size={22} />}
              value={selectedRegionId}
              onChange={(val) => {
                setSelectedRegionId(val);
                setSelectedComuna('');
              }}
              options={regionesChile.map(r => ({ label: r.nombre, value: r.id }))}
            />

            <SearchableSelect 
              placeholder="Selecciona Comuna"
              icon={<MapPin size={22} />}
              value={selectedComuna}
              onChange={(val) => setSelectedComuna(val)}
              disabled={!selectedRegionId}
              options={selectedRegion?.comunas.map(c => ({ label: c, value: c })) || []}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3">
               <div className="h-8 w-1 bg-[#3366FF] rounded-full"></div>
               <h1 className="text-4xl font-black text-slate-900 leading-none">Barberías Premium</h1>
            </div>
            <p className="text-slate-500 mt-4 font-bold text-base uppercase tracking-widest flex items-center gap-2">
              <span className="bg-white px-3 py-1 rounded-full text-[#3366FF] shadow-sm border border-slate-100">
                {filteredTiendas.length}
              </span>
              resultados encontrados {selectedComuna && `en ${selectedComuna}`}
            </p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <input 
              type="text"
              placeholder="Buscar por nombre..."
              className="w-full p-5 pl-14 bg-white border-4 border-transparent rounded-[2rem] focus:border-[#3366FF] focus:ring-0 transition-all shadow-lg font-bold text-slate-700 h-[72px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3366FF] transition-colors" size={24} />
          </div>
        </div>

        {isLoading && !isRegionMetropolitana ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-96 bg-white animate-pulse rounded-[3rem] shadow-sm"></div>
            ))}
          </div>
        ) : (
          <>
            {filteredTiendas.length > 0 ? (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredTiendas.map((tienda) => (
                  <TiendaCard key={tienda.id_tienda} tienda={tienda} />
                ))}
              </div>
            ) : (
              <div className="space-y-16">
                <div className="col-span-full py-20 text-center bg-white rounded-[4rem] shadow-2xl relative overflow-hidden px-8">
                    <div className="absolute top-0 left-0 w-full h-2 bg-rose-500"></div>
                    <div className="bg-rose-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 text-rose-500 rotate-3 shadow-md">
                        <Search size={48} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-4">No hay barberías en esta zona</h3>
                    <p className="text-slate-500 font-bold text-xl max-w-lg mx-auto leading-relaxed">
                        Actualmente no tenemos socios registrados en <span className="text-rose-500">"{selectedComuna || 'esta ubicación'}"</span>.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <button 
                            onClick={() => {setSelectedRegionId(''); setSelectedComuna('')}}
                            className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black hover:scale-105 transition-transform shadow-xl shadow-slate-200"
                        >
                            Ver Todas
                        </button>
                    </div>
                </div>

                {sugerencias.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 px-2">
                    <div className="flex items-center gap-4 mb-10 overflow-hidden">
                        <div className="p-4 bg-[#3366FF]/10 text-[#3366FF] rounded-3xl shadow-sm border border-blue-50">
                            <Navigation size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 leading-none">Barberías Recomendadas</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-tighter text-sm mt-2">Opciones destacadas en otras comunas</p>
                        </div>
                        <div className="flex-1 h-[2px] bg-slate-100 ml-4"></div>
                    </div>
                    
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                        {sugerencias.map(tienda => (
                            <TiendaCard key={tienda.id_tienda} tienda={tienda} isSuggested={true} />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BarberiasPage;
