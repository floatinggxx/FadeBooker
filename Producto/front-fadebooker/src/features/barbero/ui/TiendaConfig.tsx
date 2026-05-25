import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { tiendaService } from '@/lib/api/tiendaService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Store, MapPin, Camera, Save, RefreshCw, Image as ImageIcon, Plus, Trash2, Clock } from 'lucide-react';
import { Tienda } from '@/types';

const TiendaConfig: React.FC = () => {
    const { user } = useAuth();
    const { showNotification } = useNotification();
    const [tienda, setTienda] = useState<Tienda | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);
    const [gallery, setGallery] = useState<string[]>([]);

    const { register, handleSubmit, reset, setValue } = useForm<Partial<Tienda>>();

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
            // 🛡️ Limpieza estricta: No enviar campos de solo lectura o PK
            // Esto evita errores de Azure SQL al intentar actualizar IDENTITY o columnas protegidas
            const { 
                id_tienda, 
                id_dueño, 
                createdAt, 
                updatedAt, 
                calificacion_promedio, 
                este_activa,
                horarios_json, // Evitar si no está mapeado
                ...cleanData 
            } = data as any;

            const updateData = {
                ...cleanData,
                galeria: JSON.stringify(gallery)
            };

            await tiendaService.updateTienda(user.id_tienda, updateData);
            showNotification('¡Datos de la barbería actualizados correctamente!', 'success');
        } catch (error: any) {
            console.error('Error updating tienda:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido';
            showNotification(`Error al guardar cambios: ${errorMsg}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id_tienda) return;

        setIsUploadingLogo(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const result = await tiendaService.updateTiendaPhoto(user.id_tienda!, reader.result as string);
                setTienda(prev => prev ? { ...prev, foto_portada_url: result.fotoUrl } : null);
                setValue('foto_portada_url', result.fotoUrl);
                showNotification('Logo actualizado correctamente', 'success');
            } catch (error: any) {
                console.error('Error uploading logo:', error);
                const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Error de servicio';
                showNotification(`No se pudo subir el logo. ${errorMsg}`, 'error');
            } finally {
                setIsUploadingLogo(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id_tienda) return;

        setIsUploadingGallery(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const result = await tiendaService.updateTiendaGallery(user.id_tienda!, reader.result as string);
                setGallery(prev => [...prev, result.fotoUrl]);
                showNotification('Imagen añadida a la galería', 'success');
            } catch (error: any) {
                console.error('Error uploading gallery image:', error);
                const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Error de servicio';
                showNotification(`Error al subir imagen a la galería. ${errorMsg}`, 'error');
            } finally {
                setIsUploadingGallery(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const removeGalleryImage = (index: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen de la galería?')) {
            setGallery(prev => prev.filter((_, i) => i !== index));
        }
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400" role="status">Cargando datos de la barbería...</div>;

    return (
        <section className="bg-white rounded-[3.5rem] shadow-2xl border-8 border-white p-10 animate-fade-in" aria-labelledby="config-heading">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-10 bg-[#3366FF] rounded-full" aria-hidden="true"></div>
                <h2 id="config-heading" className="text-3xl font-black text-slate-900">Configuración de Barbería</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Columna Izquierda: Logo y Horarios */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="section" aria-labelledby="logo-heading">
                        <h3 id="logo-heading" className="font-black text-slate-900 text-sm uppercase mb-4 flex items-center gap-2">
                            <ImageIcon size={16} className="text-[#3366FF]" aria-hidden="true" /> Logo Principal
                        </h3>
                        <div className="relative group overflow-hidden rounded-[2.5rem] border-4 border-slate-100 shadow-lg" role="img" aria-label="Vista previa del logo de la barbería">
                            <div className="w-full aspect-square bg-slate-100 flex flex-col items-center justify-center">
                                {tienda?.foto_portada_url ? (
                                    <img src={tienda.foto_portada_url} alt="Logo de la tienda" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <Camera size={48} className="text-slate-300 mb-4 mx-auto" aria-hidden="true" />
                                        <span className="text-slate-400 font-bold text-xs">Sin Logo</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <button 
                                        type="button"
                                        onClick={() => document.getElementById('logo-upload')?.click()}
                                        disabled={isUploadingLogo}
                                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2"
                                    >
                                        {isUploadingLogo ? <RefreshCw className="animate-spin" size={14} /> : 'Cambiar Logo'}
                                    </button>
                                    <input 
                                        id="logo-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border-4 border-white shadow-xl" aria-labelledby="hours-heading">
                        <h3 id="hours-heading" className="font-black text-slate-900 text-sm uppercase mb-6 flex items-center gap-2">
                            <RefreshCw size={16} className="text-[#3366FF]" aria-hidden="true" /> Horarios de Atención
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="horario_apertura" className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Apertura</label>
                                    <input 
                                        id="horario_apertura"
                                        type="time"
                                        {...register('horario_apertura')}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-xs focus:ring-2 focus:ring-blue-200 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="horario_cierre" className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cierre</label>
                                    <input 
                                        id="horario_cierre"
                                        type="time"
                                        {...register('horario_cierre')}
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-xs focus:ring-2 focus:ring-blue-200 outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-200">
                                <label htmlFor="dias_laborales" className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Días Laborales</label>
                                <input 
                                    id="dias_laborales"
                                    {...register('dias_laborales')}
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-xs focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="Lunes a Sábado"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Datos y Galería */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-6 bg-slate-50/50 p-8 rounded-[2.5rem]">
                        <h3 className="font-black text-slate-900 text-sm uppercase mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-4">
                            <Store size={18} className="text-[#3366FF]" aria-hidden="true" /> Información General
                        </h3>
                        <input type="hidden" {...register('foto_portada_url')} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="nombre_tienda" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre de la Barbería</label>
                                <div className="relative">
                                    <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} aria-hidden="true" />
                                    <input 
                                        id="nombre_tienda"
                                        {...register('nombre_tienda', { required: 'El nombre es obligatorio' })}
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 focus:border-[#3366FF] rounded-2xl font-bold text-slate-900 outline-none transition-all shadow-sm"
                                        placeholder="Ej. Golden Cuts"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="ciudad" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Ciudad</label>
                                <div className="relative">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} aria-hidden="true" />
                                    <input 
                                        id="ciudad"
                                        {...register('ciudad', { required: 'La ciudad es obligatoria' })}
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 focus:border-[#3366FF] rounded-2xl font-bold text-slate-900 outline-none transition-all shadow-sm"
                                        placeholder="Ej. Santiago"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="direccion" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dirección</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} aria-hidden="true" />
                                <input 
                                    id="direccion"
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
                    </div>

                    {/* Galería Section */}
                    <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border-4 border-white" aria-labelledby="gallery-heading">
                        <div className="flex justify-between items-center mb-6 border-b-2 border-slate-100 pb-4">
                            <h3 id="gallery-heading" className="font-black text-slate-900 text-sm uppercase flex items-center gap-2">
                                <ImageIcon size={18} className="text-[#3366FF]" aria-hidden="true" /> Galería de Fotos
                            </h3>
                            <button 
                                onClick={() => document.getElementById('gallery-upload')?.click()}
                                disabled={isUploadingGallery}
                                aria-label="Añadir nueva foto a la galería"
                                className="flex items-center gap-2 bg-white text-[#3366FF] px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#3366FF] hover:text-white transition-all disabled:opacity-50"
                            >
                                {isUploadingGallery ? <RefreshCw className="animate-spin" size={14} /> : <Plus size={14} aria-hidden="true" />}
                                {isUploadingGallery ? 'SUBIENDO...' : 'Añadir Foto'}
                            </button>
                            <input 
                                id="gallery-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleGalleryUpload}
                            />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6" role="list">
                            {gallery.map((img, idx) => (
                                <div key={idx} role="listitem" className="relative group aspect-square rounded-3xl overflow-hidden shadow-md border-4 border-white bg-white">
                                    <img src={img} alt={`Imagen de galería ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            onClick={() => removeGalleryImage(idx)}
                                            aria-label={`Eliminar imagen ${idx + 1}`}
                                            className="bg-white/90 text-rose-500 p-3 rounded-2xl shadow-xl hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={18} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => document.getElementById('gallery-upload')?.click()}
                                disabled={isUploadingGallery}
                                aria-label="Subir nueva foto"
                                className="aspect-square bg-white rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#3366FF] transition-all group w-full disabled:opacity-50"
                            >
                                {isUploadingGallery ? (
                                    <RefreshCw size={32} className="animate-spin text-[#3366FF]" />
                                ) : (
                                    <>
                                        <Plus size={32} className="text-slate-200 group-hover:text-[#3366FF] mb-2" aria-hidden="true" />
                                        <span className="text-[10px] font-black text-slate-300 group-hover:text-[#3366FF] uppercase">Subir Foto</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default TiendaConfig;