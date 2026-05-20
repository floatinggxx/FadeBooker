import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { tiendaService } from '@/lib/api/tiendaService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { Store, MapPin, Camera, Save, RefreshCw, Image as ImageIcon, Plus, Trash2, Clock } from 'lucide-react';
import { Tienda } from '@/types';

const TiendaConfig: React.FC = () => {
    const { user } = useAuth();
    const [tienda, setTienda] = useState<Tienda | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [gallery, setGallery] = useState<string[]>([]);

    const { register, handleSubmit, reset } = useForm<Partial<Tienda>>();

    useEffect(() => {
        const fetchTienda = async () => {
            if (user?.id_tienda) {
                try {
                    const data = await tiendaService.getTiendaById(user.id_tienda);
                    setTienda(data);
                    reset(data);
                    
                    // Cargar galería desde JSON si existe
                    if (data.galeria) {
                        try {
                            setGallery(JSON.parse(data.galeria));
                        } catch (e) {
                            console.error('Error parsing gallery:', e);
                            setGallery([]);
                        }
                    } else {
                        // Fallback temporal para visualización
                        setGallery([
                            '/images/slider-1.jpg',
                            '/images/slider-2.jpg',
                            '/images/slider-3.jpg'
                        ]);
                    }
                } catch (error) {
                    console.error('Error fetching tienda:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchTienda();
    }, [user, reset]);

    const onSubmit = async (data: Partial<Tienda>) => {
        if (!user?.id_tienda) return;
        setIsSaving(true);
        try {
            // Incluir galería en el update
            const updateData = {
                ...data,
                galeria: JSON.stringify(gallery)
            };
            await tiendaService.updateTienda(user.id_tienda, updateData);
            alert('¡Datos de la barbería actualizados!');
        } catch (error) {
            console.error('Error updating tienda:', error);
            alert('Error al guardar cambios');
        } finally {
            setIsSaving(false);
        }
    };

    const removeGalleryImage = (index: number) => {
        setGallery(prev => prev.filter((_, i) => i !== index));
    };

    const addImage = () => {
        const url = prompt('Introduce la URL de la imagen:');
        if (url) {
            setGallery(prev => [...prev, url]);
        }
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">Cargando datos de la barbería...</div>;

    return (
        <div className="bg-white rounded-[3.5rem] shadow-2xl border-8 border-white p-10 animate-fade-in">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-10 bg-[#3366FF] rounded-full"></div>
                <h2 className="text-3xl font-black text-slate-900">Configuración de Barbería</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Columna Izquierda: Logo y Horarios */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="section">
                        <h4 className="font-black text-slate-900 text-sm uppercase mb-4 flex items-center gap-2">
                            <ImageIcon size={16} className="text-[#3366FF]" /> Logo Principal
                        </h4>
                        <div className="relative group overflow-hidden rounded-[2.5rem] border-4 border-slate-100 shadow-lg">
                            <div className="w-full aspect-square bg-slate-100 flex flex-col items-center justify-center">
                                {tienda?.foto_portada_url ? (
                                    <img src={tienda.foto_portada_url} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Camera size={48} className="text-slate-300 mb-4" />
                                        <span className="text-slate-400 font-bold text-xs">Sin Logo</span>
                                    </>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const url = prompt('URL del Logo:', tienda?.foto_portada_url || '');
                                            if (url !== null) {
                                                setTienda(prev => prev ? {...prev, foto_portada_url: url} : null);
                                                reset({...tienda, foto_portada_url: url});
                                            }
                                        }}
                                        className="bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest"
                                    >
                                        Cambiar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border-4 border-white shadow-xl">
                        <h4 className="font-black text-slate-900 text-sm uppercase mb-6 flex items-center gap-2">
                            <RefreshCw size={16} className="text-[#3366FF]" /> Horarios de Atención
                        </h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Apertura</label>
                                    <input 
                                        type="time"
                                        {...register('horario_apertura')}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cierre</label>
                                    <input 
                                        type="time"
                                        {...register('horario_cierre')}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-xs"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-200">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Días Laborales</span>
                                <input 
                                    {...register('dias_laborales')}
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-xs"
                                    placeholder="Lunes a Sábado"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Datos y Galería */}
                <div className="lg:col-span-2 space-y-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-slate-50/50 p-8 rounded-[2.5rem]">
                        <h4 className="font-black text-slate-900 text-sm uppercase mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-4">
                            <Store size={18} className="text-[#3366FF]" /> Información General
                        </h4>
                        <input type="hidden" {...register('foto_portada_url')} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre de la Barbería</label>
                                <div className="relative">
                                    <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input 
                                        {...register('nombre_tienda', { required: 'El nombre es obligatorio' })}
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 focus:border-[#3366FF] rounded-2xl font-bold text-slate-900 outline-none transition-all shadow-sm"
                                        placeholder="Ej. Golden Cuts"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Ciudad</label>
                                <div className="relative">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input 
                                        {...register('ciudad', { required: 'La ciudad es obligatoria' })}
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 focus:border-[#3366FF] rounded-2xl font-bold text-slate-900 outline-none transition-all shadow-sm"
                                        placeholder="Ej. Santiago"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dirección</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    {...register('direccion', { required: 'La dirección es obligatoria' })}
                                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 focus:border-[#3366FF] rounded-2xl font-bold text-slate-900 outline-none transition-all shadow-sm"
                                    placeholder="Av. Principal 123"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="flex items-center gap-3 bg-[#3366FF] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all text-xs uppercase tracking-widest"
                            >
                                <Save size={18} />
                                {isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                            </button>
                        </div>
                    </form>

                    {/* Galería Section */}
                    <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border-4 border-white">
                        <div className="flex justify-between items-center mb-6 border-b-2 border-slate-100 pb-4">
                            <h4 className="font-black text-slate-900 text-sm uppercase flex items-center gap-2">
                                <ImageIcon size={18} className="text-[#3366FF]" /> Galería de Fotos
                            </h4>
                            <button 
                                onClick={addImage}
                                className="flex items-center gap-2 bg-white text-[#3366FF] px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#3366FF] hover:text-white transition-all"
                            >
                                <Plus size={14} /> Añadir Foto
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {gallery.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-3xl overflow-hidden shadow-md border-4 border-white bg-white">
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            onClick={() => removeGalleryImage(idx)}
                                            className="bg-white/90 text-rose-500 p-3 rounded-2xl shadow-xl hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div 
                                onClick={addImage}
                                className="aspect-square bg-white rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#3366FF] transition-all group"
                            >
                                <Plus size={32} className="text-slate-200 group-hover:text-[#3366FF] mb-2" />
                                <span className="text-[10px] font-black text-slate-300 group-hover:text-[#3366FF] uppercase">Subir Foto</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TiendaConfig;