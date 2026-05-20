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
    
    const [formData, setFormData] = useState({
        id_barbero: user?.id_barbero || 4,
        id_tienda: user?.id_tienda || 1, 
        id_servicio: '',
        cliente_nombre: '',
        fecha: new Date().toISOString().split('T')[0],
        hora: '10:00',
        notas: ''
    });

    useEffect(() => {
        const loadServicios = async () => {
            try {
                const data = await barberoService.getBarberoInfo(formData.id_barbero);
                setServicios(data.servicios || []);
            } catch (err) {
                console.error("Error cargando servicios", err);
            }
        };
        loadServicios();
    }, [formData.id_barbero]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await barberoService.manualBooking({
                ...formData,
                fecha_hora_inicio: `${formData.fecha} ${formData.hora}:00`,
                monto_total: servicios.find(s => s.id_servicio == formData.id_servicio)?.precio || 0
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
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Nombre del Cliente</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-4 text-[#3366FF]" size={20} />
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none"
                                        placeholder="Ej: Juan Pérez"
                                        value={formData.cliente_nombre}
                                        onChange={e => setFormData({...formData, cliente_nombre: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Servicio</label>
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
                                            <option key={s.id_servicio} value={s.id_servicio}>{s.nombre} - ${s.precio}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full bg-[#3366FF] text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-rose-500 transition-all flex items-center justify-center gap-3"
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
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Fecha</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-4 text-[#3366FF]" size={20} />
                                        <input 
                                            type="date" 
                                            required
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none"
                                            value={formData.fecha}
                                            onChange={e => setFormData({...formData, fecha: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Hora</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-4 text-[#3366FF]" size={20} />
                                        <input 
                                            type="time" 
                                            required
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none"
                                            value={formData.hora}
                                            onChange={e => setFormData({...formData, hora: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Notas (Opcional)</label>
                                <textarea 
                                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none min-h-[100px]"
                                    placeholder="Detalles adicionales..."
                                    value={formData.notas}
                                    onChange={e => setFormData({...formData, notas: e.target.value})}
                                />
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
                                    disabled={loading}
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
