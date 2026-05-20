import React, { useState, useEffect } from 'react';
import { barberoService } from '../services/barberoService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { Calendar, Clock, User, Scissors, Check, X } from 'lucide-react';

interface ManualBookingProps {
    onClose: () => void;
    onSuccess: () => void;
}

const BarberoManualBooking: React.FC<ManualBookingProps> = ({ onClose, onSuccess }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [servicios, setServicios] = useState<any[]>([]);
    const [availability, setAvailability] = useState<any[]>([]);
    
    const [formData, setFormData] = useState({
        id_barbero: user?.id_barbero,
        id_tienda: user?.id_tienda, 
        id_servicio: '',
        cliente_nombre: '',
        cliente_email: '',
        cliente_telefono: '',
        fecha: new Date().toISOString().split('T')[0],
        hora: '',
        notas: ''
    });

    useEffect(() => {
        if (formData.id_barbero) {
            const loadServicios = async () => {
                try {
                    // Usar el endpoint específico de servicios del barbero
                    const params = new URLSearchParams();
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/barberos/${formData.id_barbero}/servicios`);
                    const data = await response.json();
                    setServicios(data || []);
                } catch (err) {
                    console.error("Error cargando servicios", err);
                }
            };
            loadServicios();
        }
    }, [formData.id_barbero]);

    useEffect(() => {
        if (formData.id_barbero && formData.fecha) {
            const loadAvailability = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/barberos/${formData.id_barbero}/disponibilidad?fecha=${formData.fecha}`);
                    const data = await response.json();
                    setAvailability(data || []);
                } catch (err) {
                    console.error("Error cargando disponibilidad", err);
                }
            };
            loadAvailability();
        }
    }, [formData.id_barbero, formData.fecha]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const selectedService = servicios.find(s => s.id_servicio == formData.id_servicio);
            await barberoService.manualBooking({
                ...formData,
                id_barbero: user?.id_barbero,
                id_tienda: user?.id_tienda,
                fecha_hora_inicio: `${formData.fecha} ${formData.hora}:00`,
                monto_total: selectedService?.precio_barbero || selectedService?.precio_base || 0,
                // Asegurar que el origen sea manual para estadísticas
                origen: 'manual'
            });
            onSuccess();
        } catch (err) {
            console.error("Error agendando", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white animate-appear">
                <div className="p-8 border-b-4 border-slate-50 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-slate-900">Agendar Cita Manual</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Información del Cliente</label>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-4 text-[#3366FF]" size={20} />
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="Nombre completo"
                                            value={formData.cliente_nombre}
                                            onChange={e => setFormData({...formData, cliente_nombre: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="tel" 
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none"
                                            placeholder="Teléfono"
                                            value={formData.cliente_telefono}
                                            onChange={e => setFormData({...formData, cliente_telefono: e.target.value})}
                                        />
                                        <input 
                                            type="email" 
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none"
                                            placeholder="Email (opcional)"
                                            value={formData.cliente_email}
                                            onChange={e => setFormData({...formData, cliente_email: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Servicio de la Barbería</label>
                                <div className="relative">
                                    <Scissors className="absolute left-4 top-4 text-[#3366FF]" size={20} />
                                    <select 
                                        required
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 appearance-none focus:ring-4 focus:ring-blue-100 outline-none"
                                        value={formData.id_servicio}
                                        onChange={e => setFormData({...formData, id_servicio: e.target.value})}
                                    >
                                        <option value="">Selecciona un servicio</option>
                                        {servicios.map(s => (
                                            <option key={s.id_servicio} value={s.id_servicio}>
                                                {s.nombre_servicio} - ${s.precio_barbero || s.precio_base}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={!formData.cliente_nombre || !formData.id_servicio}
                                    className="w-full bg-[#3366FF] text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-rose-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    SIGUIENTE PASO
                                    <Check size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Fecha de Cita</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-4 text-[#3366FF]" size={20} />
                                        <input 
                                            type="date" 
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none"
                                            value={formData.fecha}
                                            onChange={e => setFormData({...formData, fecha: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Bloque Horario</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-4 text-[#3366FF]" size={20} />
                                        <select 
                                            required
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 appearance-none focus:ring-4 focus:ring-blue-100 outline-none"
                                            value={formData.hora}
                                            onChange={e => setFormData({...formData, hora: e.target.value})}
                                        >
                                            <option value="">Selecciona horario</option>
                                            {availability.map(slot => (
                                                <option key={slot.hora} value={slot.hora.substring(0, 5)} disabled={!slot.disponible}>
                                                    {slot.hora.substring(0, 5)} {slot.disponible ? '' : '(Ocupado)'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Resumen de Cobro</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-900 font-bold">
                                        {servicios.find(s => s.id_servicio == formData.id_servicio)?.nombre_servicio}
                                    </span>
                                    <span className="text-2xl font-black text-[#3366FF]">
                                        ${servicios.find(s => s.id_servicio == formData.id_servicio)?.precio_barbero || servicios.find(s => s.id_servicio == formData.id_servicio)?.precio_base}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl font-black hover:bg-slate-200 transition-all"
                                >
                                    VOLVER
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading || !formData.hora}
                                    className="flex-[2] bg-rose-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-[#3366FF] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? 'AGENDANDO...' : 'CONFIRMAR CITA'}
                                    {!loading && <Check size={20} />}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BarberoManualBooking;
