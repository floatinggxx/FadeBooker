import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { barberoService } from '../services/barberoService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { Calendar, Clock, User, Scissors, Check, X, Search, Phone, Mail } from 'lucide-react';

interface ManualBookingProps {
    onClose: () => void;
    onSuccess: () => void;
}

const BarberoManualBooking: React.FC<ManualBookingProps> = ({ onClose, onSuccess }) => {
    const { user } = useAuth();
    
    // Cargar step persistido
    const [step, setStep] = useState(() => {
        try {
            const saved = localStorage.getItem('barbero_manual_booking_step');
            return saved ? parseInt(saved) : 1;
        } catch {
            return 1;
        }
    });
    
    const [loading, setLoading] = useState(false);
    const [servicios, setServicios] = useState<any[]>([]);
    const [availability, setAvailability] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Refs para evitar llamadas duplicadas
    const serviciosLoadedRef = React.useRef(false);
    const availabilityLoadedRef = React.useRef<Record<string, boolean>>({});
    
    // Cargar datos persistidos o usar valores por defecto
    const [formData, setFormData] = useState(() => {
        try {
            const saved = localStorage.getItem('barbero_manual_booking');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error cargando datos guardados:', e);
        }
        return {
            id_barbero: user?.id_barbero,
            id_tienda: user?.id_tienda, 
            id_servicio: '',
            cliente_nombre: '',
            cliente_email: '',
            cliente_telefono: '',
            fecha: new Date().toISOString().split('T')[0],
            hora: '',
            notas: '',
            metodo_pago: 'efectivo'
        };
    });

    // Guardar datos en localStorage cuando cambian
    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                localStorage.setItem('barbero_manual_booking', JSON.stringify(formData));
            } catch (e) {
                console.error('Error guardando datos:', e);
            }
        }, 500); // Debounce para no guardar en cada tecla

        return () => clearTimeout(timer);
    }, [formData]);

    // Guardar step en localStorage cuando cambia
    useEffect(() => {
        try {
            localStorage.setItem('barbero_manual_booking_step', step.toString());
        } catch (e) {
            console.error('Error guardando step:', e);
        }
    }, [step]);

    const validateFormat = () => {
        const newErrors: Record<string, string> = {};
        
        // Validar Nombre
        if (formData.cliente_nombre.length < 3) {
            newErrors.nombre = 'Nombre demasiado corto';
        }

        // Validar Teléfono (Formato Chileno: +569... o 9...)
        const phoneRegex = /^(\+56|0)?9[0-9]{8}$/;
        if (!phoneRegex.test(formData.cliente_telefono)) {
            newErrors.telefono = 'Formato: 9XXXXXXXX o +569XXXXXXXX';
        }

        // Validar Email (opcional pero si existe debe ser válido)
        if (formData.cliente_email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.cliente_email)) {
                newErrors.email = 'Email inválido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (formData.id_barbero && !serviciosLoadedRef.current) {
            const loadServicios = async () => {
                try {
                    // Cachear servicios en sessionStorage para evitar recargas
                    const cacheKey = `servicios_${formData.id_barbero}`;
                    const cached = sessionStorage.getItem(cacheKey);
                    
                    if (cached) {
                        setServicios(JSON.parse(cached));
                        serviciosLoadedRef.current = true;
                        return;
                    }

                    // Solo mostrar loading si no hay cache
                    setLoading(true);
                    const response = await api.get(`/barberos/${formData.id_barbero}/servicios`);
                    const data = response.data || [];
                    setServicios(data);
                    sessionStorage.setItem(cacheKey, JSON.stringify(data));
                    serviciosLoadedRef.current = true;
                } catch (err) {
                    console.error("Error cargando servicios", err);
                } finally {
                    setLoading(false);
                }
            };
            loadServicios();
        }
    }, [formData.id_barbero]);

    useEffect(() => {
        if (formData.id_barbero && formData.fecha) {
            const cacheKey = `availability_${formData.id_barbero}_${formData.fecha}`;
            
            // Si ya fue cargada esta fecha, no hacer nada
            if (availabilityLoadedRef.current[cacheKey]) {
                return;
            }

            const loadAvailability = async () => {
                try {
                    // Cachear disponibilidad en sessionStorage por fecha
                    const cached = sessionStorage.getItem(cacheKey);
                    
                    if (cached) {
                        setAvailability(JSON.parse(cached));
                        availabilityLoadedRef.current[cacheKey] = true;
                        return;
                    }

                    // Solo mostrar loading si no hay cache
                    setLoading(true);
                    const response = await api.get(`/barberos/${formData.id_barbero}/disponibilidad?fecha=${formData.fecha}`);
                    const data = response.data || [];
                    setAvailability(data);
                    sessionStorage.setItem(cacheKey, JSON.stringify(data));
                    availabilityLoadedRef.current[cacheKey] = true;
                } catch (err) {
                    console.error("Error cargando disponibilidad", err);
                } finally {
                    setLoading(false);
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
            
            // Validar que tengamos todos los IDs necesarios
            const finalIdBarbero = user?.id_barbero || formData.id_barbero;
            const finalIdTienda = user?.id_tienda || formData.id_tienda;

            if (!finalIdBarbero || !finalIdTienda) {
                throw new Error("Falta información del barbero o la tienda.");
            }

            await barberoService.manualBooking({
                ...formData,
                id_barbero: finalIdBarbero,
                id_tienda: finalIdTienda,
                fecha_hora_inicio: `${formData.fecha} ${formData.hora}:00`,
                monto_total: selectedService?.precio_barbero || selectedService?.precio_base || 0,
                pago_abono: 0,
                metodo_pago: formData.metodo_pago,
                estado: 'confirmada',
                origen: 'manual'
            });
            
            // Limpiar datos guardados cuando la cita se crea exitosamente
            localStorage.removeItem('barbero_manual_booking');
            localStorage.removeItem('barbero_manual_booking_step');
            serviciosLoadedRef.current = false;
            availabilityLoadedRef.current = {};
            onSuccess();
        } catch (err: any) {
            console.error("Error agendando", err);
            const errorMsg = err.response?.data?.error || err.message || "Error desconocido al agendar";
            alert(`No se pudo crear la cita: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white animate-appear">
                <div className="p-8 border-b-4 border-slate-50 flex justify-between items-center">
                    <h2 id="modal-title" className="text-2xl font-black text-slate-900">Agendar Cita Manual</h2>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('barbero_manual_booking');
                            localStorage.removeItem('barbero_manual_booking_step');
                            serviciosLoadedRef.current = false;
                            availabilityLoadedRef.current = {};
                            onClose();
                        }}
                        aria-label="Cerrar modal"
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <X size={24} className="text-slate-400" aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <fieldset className="space-y-4">
                                <legend className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Información del Cliente</legend>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <label htmlFor="cliente_nombre" className="sr-only">Nombre completo</label>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                                            <User className={`${errors.nombre ? 'text-rose-500' : 'text-[#3366FF]'}`} size={20} aria-hidden="true" />
                                        </div>
                                        <input 
                                            id="cliente_nombre"
                                            type="text" 
                                            required
                                            autoComplete="off"
                                            className={`w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 outline-none transition-all ${errors.nombre ? 'border-rose-200 bg-rose-50' : 'border-transparent focus:ring-4 focus:ring-blue-100'}`}
                                            placeholder="Nombre completo del cliente"
                                            value={formData.cliente_nombre}
                                            onChange={e => setFormData({...formData, cliente_nombre: e.target.value})}
                                        />
                                        {errors.nombre && <p className="text-rose-500 text-[10px] font-black uppercase mt-1 ml-4">{errors.nombre}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <label htmlFor="cliente_telefono" className="sr-only">Teléfono</label>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                                                <Phone className={`${errors.telefono ? 'text-rose-500' : 'text-slate-400'}`} size={18} />
                                            </div>
                                            <input 
                                                id="cliente_telefono"
                                                type="tel" 
                                                className={`w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 outline-none transition-all ${errors.telefono ? 'border-rose-200 bg-rose-50' : 'border-transparent focus:ring-4 focus:ring-blue-100'}`}
                                                placeholder="9 1234 5678"
                                                value={formData.cliente_telefono}
                                                onChange={e => setFormData({...formData, cliente_telefono: e.target.value.replace(/\s/g, '')})}
                                            />
                                            {errors.telefono && <p className="text-rose-500 text-[10px] font-black uppercase mt-1 ml-2">{errors.telefono}</p>}
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="cliente_email" className="sr-only">Email (opcional)</label>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                                                <Mail className={`${errors.email ? 'text-rose-500' : 'text-slate-400'}`} size={18} />
                                            </div>
                                            <input 
                                                id="cliente_email"
                                                type="email" 
                                                className={`w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 outline-none transition-all ${errors.email ? 'border-rose-200 bg-rose-50' : 'border-transparent focus:ring-4 focus:ring-blue-100'}`}
                                                placeholder="correo@ejemplo.com"
                                                value={formData.cliente_email}
                                                onChange={e => setFormData({...formData, cliente_email: e.target.value})}
                                            />
                                            {errors.email && <p className="text-rose-500 text-[10px] font-black uppercase mt-1 ml-2">{errors.email}</p>}
                                        </div>
                                    </div>
                                </div>
                            </fieldset>

                            <div>
                                <label htmlFor="id_servicio" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Servicio de la Barbería</label>
                                <div className="relative">
                                    <Scissors className="absolute left-4 top-4 text-[#3366FF]" size={20} aria-hidden="true" />
                                    <select 
                                        id="id_servicio"
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

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Forma de Pago</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['efectivo', 'transferencia', 'mercadopago'].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setFormData({...formData, metodo_pago: method})}
                                            className={`py-4 px-4 rounded-2xl font-black text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                                                formData.metodo_pago === method
                                                    ? 'bg-[#3366FF] text-white border-[#3366FF] shadow-lg shadow-blue-100'
                                                    : 'bg-white text-slate-600 border-slate-50 hover:bg-slate-50'
                                            }`}
                                        >
                                            {method === 'efectivo' ? 'Efectivo' : method === 'transferencia' ? 'Transferencia' : 'Mercado Pago'}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Selecciona cómo pagará el cliente. Si eliges efectivo o transferencia, podrás registrar el pago cuando ocurra en la barbería.
                                </p>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        if(validateFormat()) setStep(2);
                                    }}
                                    disabled={!formData.cliente_nombre || !formData.id_servicio}
                                    className="w-full bg-[#3366FF] text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-rose-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    SIGUIENTE PASO
                                    <Check size={20} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fecha" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Fecha de Cita</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-4 text-[#3366FF]" size={20} aria-hidden="true" />
                                        <input 
                                            id="fecha"
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
                                    <label htmlFor="hora" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Bloque Horario</label>
                                    <div className="relative">
                                        <div className="bg-slate-50 rounded-[2rem] p-4 border-2 border-slate-100">
                                            <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-2">
                                                {availability.map(slot => (
                                                    <button
                                                        key={slot.hora}
                                                        type="button"
                                                        disabled={!slot.disponible}
                                                        onClick={() => setFormData({...formData, hora: slot.hora.substring(0, 5)})}
                                                        className={`py-3 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 border-2 ${
                                                            formData.hora === slot.hora.substring(0, 5) 
                                                                ? 'bg-[#3366FF] text-white border-[#3366FF] shadow-lg shadow-blue-100' 
                                                                : !slot.disponible 
                                                                    ? 'bg-rose-100 text-rose-600 border-rose-200 cursor-not-allowed opacity-90' 
                                                                    : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-50 hover:border-slate-100'
                                                        }`}
                                                        title={!slot.disponible ? `Ocupado: ${slot.detalle || 'Cita programada'}` : `Reservar a las ${slot.hora.substring(0, 5)}`}
                                                    >
                                                        <Clock size={14} className={!slot.disponible ? 'text-rose-500' : ''} />
                                                        {slot.hora.substring(0, 5)}
                                                    </button>
                                                ))}
                                                {availability.length === 0 && (
                                                    <p className="col-span-2 text-center py-10 text-slate-400 font-bold italic">No hay horarios disponibles</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <style>{`
                                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                            `}</style>

                            <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100" aria-labelledby="resume-heading">
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
