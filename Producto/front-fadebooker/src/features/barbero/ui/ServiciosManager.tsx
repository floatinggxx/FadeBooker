import React, { useState, useEffect } from 'react';
import { servicioService } from '@/lib/api/servicioService';
import { Scissors, Plus, Trash2, Save, Clock, DollarSign, X, Check, RefreshCw } from 'lucide-react';
import { Servicio } from '@/types';

const ServiciosManager: React.FC = () => {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<Servicio>>({
        nombre_servicio: '',
        descripcion: '',
        duracion_minutos: 30,
        precio_base: 10000,
        activo: true
    });

    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchServicios = async () => {
        try {
            const data = await servicioService.getAll();
            setServicios(data);
        } catch (error) {
            console.error('Error fetching servicios:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await servicioService.create(formData);
            setShowAddModal(false);
            setFormData({ nombre_servicio: '', descripcion: '', duracion_minutos: 30, precio_base: 10000, activo: true });
            fetchServicios();
        } catch (error: any) {
            console.error('Error al crear el servicio:', error);
            const errorData = error.response?.data;
            const msg = errorData?.detalles ? errorData.detalles.map((d: any) => d.message).join(', ') : (errorData?.error || 'No se pudo crear el servicio');
            alert(`Error: ${msg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = async (id: number, data: Partial<Servicio>) => {
        try {
            await servicioService.update(id, data);
            setEditingId(null);
            fetchServicios();
        } catch (error) {
            alert('Error al actualizar el servicio');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
            try {
                await servicioService.delete(id);
                fetchServicios();
            } catch (error) {
                alert('No se pudo eliminar el servicio');
            }
        }
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400">Cargando servicios...</div>;

    return (
        <section className="bg-white rounded-[3.5rem] shadow-2xl border-8 border-white p-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-rose-500 rounded-full"></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900">Servicios</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Configura duración y precios base</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-3 bg-rose-500 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-600 transition-all font-inter"
                >
                    <Plus size={20} />
                    NUEVO SERVICIO
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {servicios.map((servicio) => (
                    <div key={servicio.id_servicio} className="group bg-slate-50 hover:bg-white hover:shadow-2xl hover:scale-[1.01] transition-all p-8 rounded-[2.5rem] border-4 border-transparent hover:border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6 flex-1">
                            <div className="p-5 bg-white shadow-lg rounded-2xl text-rose-500">
                                <Scissors size={24} />
                            </div>
                            <div>
                                {editingId === servicio.id_servicio ? (
                                    <input 
                                        className="text-xl font-black text-slate-900 bg-white border-2 border-slate-100 rounded-xl px-4 py-1 mb-2"
                                        defaultValue={servicio.nombre_servicio || servicio.nombre}
                                        onBlur={(e) => handleUpdate(servicio.id_servicio, { nombre_servicio: e.target.value })}
                                        autoFocus
                                    />
                                ) : (
                                    <h3 
                                        className="text-xl font-black text-slate-900 mb-1 cursor-pointer hover:text-[#3366FF]"
                                        onClick={() => setEditingId(servicio.id_servicio)}
                                    >
                                        {servicio.nombre_servicio || servicio.nombre}
                                    </h3>
                                )}
                                <p className="text-slate-500 font-medium text-sm">{servicio.descripcion || 'Sin descripción'}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm">
                                <Clock size={16} className="text-slate-400" />
                                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Duración</span>
                                <input 
                                    type="number" 
                                    className="w-16 font-black text-slate-900 border-none p-0 focus:ring-0"
                                    defaultValue={servicio.duracion_minutos}
                                    onBlur={(e) => handleUpdate(servicio.id_servicio, { duracion_minutos: Number(e.target.value) })}
                                />
                                <span className="font-bold text-slate-400 text-xs">min</span>
                            </div>

                            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm">
                                <DollarSign size={16} className="text-[#3366FF]" />
                                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Precio</span>
                                <input 
                                    type="number" 
                                    className="w-20 font-black text-slate-900 border-none p-0 focus:ring-0"
                                    defaultValue={servicio.precio_base}
                                    onBlur={(e) => handleUpdate(servicio.id_servicio, { precio_base: Number(e.target.value) })}
                                />
                            </div>

                            <button 
                                onClick={() => handleDelete(servicio.id_servicio)}
                                className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de añadir */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-scale-in border-8 border-white">
                        <form onSubmit={handleCreate} className="p-10">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-black text-slate-900">Nuevo Servicio</h2>
                                <button type="button" onClick={() => setShowAddModal(false)} className="p-3 text-slate-400 hover:text-rose-500"><X /></button>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nombre</label>
                                    <input 
                                        required
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold"
                                        value={formData.nombre_servicio}
                                        onChange={e => setFormData({...formData, nombre_servicio: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Descripción</label>
                                    <textarea 
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold"
                                        value={formData.descripcion}
                                        onChange={e => setFormData({...formData, descripcion: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Duración (min)</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold"
                                            value={formData.duracion_minutos}
                                            onChange={e => setFormData({...formData, duracion_minutos: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Precio Base</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold"
                                            value={formData.precio_base}
                                            onChange={e => setFormData({...formData, precio_base: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                disabled={isSaving}
                                className="w-full mt-10 bg-rose-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-600 transition-all flex items-center justify-center gap-3"
                            >
                                {isSaving ? <RefreshCw className="animate-spin" /> : <Save size={20} />}
                                GUARDAR SERVICIO
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ServiciosManager;
