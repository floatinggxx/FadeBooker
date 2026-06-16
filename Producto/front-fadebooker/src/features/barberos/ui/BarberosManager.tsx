import React, { useState, useEffect } from 'react';
import { barberService } from '@/lib/api/barberService';
import { authService } from '@/lib/api/authService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { 
    UserPlus, 
    Scissors, 
    Trash2, 
    ShieldCheck, 
    ShieldAlert, 
    MoreVertical, 
    Plus,
    Mail,
    Phone,
    User,
    Award,
    Briefcase,
    X,
    Check
} from 'lucide-react';
import { Barbero } from '@/types';
import { parseError } from '@/lib/utils/errorParser';

const BarberosManager: React.FC = () => {
    const { user } = useAuth();
    const [barberos, setBarberos] = useState<Barbero[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state for new barber
    const [newBarber, setNewBarber] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        contrasena: '', // No hardcoded password
        especialidad: 'Corte Clásico',
        anos_experiencia: 1,
        tarifa_base: 0
    });

    const fetchBarberos = async () => {
        if (user?.id_tienda) {
            try {
                const data = await barberService.listBarberosByTienda(Number(user.id_tienda));
                setBarberos(data);
            } catch (error) {
                console.error('Error fetching barberos:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchBarberos();
    }, [user]);

    const handleAddBarber = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Paso 1: Registrar Usuario con rol Barbero
            const registerData = {
                nombre: newBarber.nombre,
                apellido: newBarber.apellido,
                email: newBarber.email,
                telefono: newBarber.telefono,
                contrasena: newBarber.contrasena,
                rol: 'Barbero' as const
            };
            
            const registeredUser = await authService.register(registerData);
            const userId = registeredUser.id_usuario || (registeredUser as any).id;

            // Paso 2: Crear entidad Barbero vinculada a la tienda del dueño
            await barberService.createBarbero({
                id_usuario: Number(userId),
                id_tienda: Number(user?.id_tienda),
                especialidad: newBarber.especialidad,
                anos_experiencia: newBarber.anos_experiencia,
                tarifa_base: newBarber.tarifa_base,
                activo: 1,
                nombre: newBarber.nombre, // Para display inmediato
                apellido: newBarber.apellido
            } as any);

            alert('Barbero registrado exitosamente');
            setShowAddModal(false);
            fetchBarberos();
            setNewBarber({
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                contrasena: '',
                especialidad: 'Corte Clásico',
                anos_experiencia: 1,
                tarifa_base: 0
            });
        } catch (error: any) {
            console.error('Error registering barber:', error);
            const friendly = parseError(error);
            alert(`Error: ${friendly}`);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleBarberoStatus = async (barbero: Barbero) => {
        try {
            const newStatus = barbero.activo ? 0 : 1;
            await barberService.updateBarbero(Number(barbero.id_barbero), { activo: newStatus });
            setBarberos(prev => prev.map(b => 
                b.id_barbero === barbero.id_barbero ? { ...b, activo: newStatus } : b
            ));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (isLoading) return <div className="p-10 text-center font-bold text-slate-400" role="status">Cargando equipo de barberos...</div>;

    return (
        <section className="bg-white rounded-[3.5rem] shadow-2xl border-8 border-white p-10 animate-fade-in" aria-labelledby="barberos-heading">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-[#3366FF] rounded-full" aria-hidden="true"></div>
                    <div>
                        <h2 id="barberos-heading" className="text-3xl font-black text-slate-900">Gestión de Equipo</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Administra los barberos de tu tienda</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-3 bg-[#3366FF] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                    <UserPlus size={20} aria-hidden="true" />
                    AÑADIR BARBERO
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {barberos.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200">
                        <User size={64} className="text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest">No hay barberos registrados aún</p>
                    </div>
                ) : (
                    barberos.map((barbero) => (
                        <article 
                            key={barbero.id_barbero}
                            className={`relative group bg-white p-6 rounded-[2.5rem] shadow-xl border-4 transition-all hover:scale-[1.02] ${barbero.activo ? 'border-white' : 'border-slate-100 opacity-75'}`}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-slate-50 shadow-md">
                                        <img 
                                            src={barbero.foto_perfil_url || '/images/barber-placeholder.jpg'} 
                                            alt={barbero.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className={`absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg ${barbero.activo ? 'bg-green-500' : 'bg-slate-400'}`}>
                                        {barbero.activo ? <ShieldCheck size={14} className="text-white" /> : <ShieldAlert size={14} className="text-white" />}
                                    </div>
                                </div>
                                <button className="p-2 text-slate-300 hover:text-slate-600">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">{barbero.nombre} {barbero.apellido}</h3>
                                    <p className="text-[#3366FF] font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                                        <Scissors size={12} /> {barbero.especialidad}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <div className="bg-slate-50 p-2 rounded-lg" title="Años de experiencia">
                                            <Award size={14} className="text-slate-400" />
                                            <span className="text-[10px] font-black ml-1">{barbero.anos_experiencia}y</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => toggleBarberoStatus(barbero)}
                                        className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${barbero.activo ? 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500' : 'bg-[#16a34a] text-white hover:bg-[#15803d]'}`}
                                    >
                                        {barbero.activo ? 'Desactivar' : 'Activar'}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>

            {/* Modal Añadir Barbero */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-modal-title">
                    <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border-8 border-white animate-appear">
                        <div className="p-8 border-b-4 border-slate-50 flex justify-between items-center">
                            <h2 id="add-modal-title" className="text-2xl font-black text-slate-900">Registrar Nuevo Barbero</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddBarber} className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3366FF]" size={18} />
                                        <input 
                                            required
                                            value={newBarber.nombre}
                                            onChange={e => setNewBarber({...newBarber, nombre: e.target.value})}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3366FF] focus:bg-white rounded-2xl font-bold text-slate-900 outline-none transition-all"
                                            placeholder="Nombre"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Apellido</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3366FF]" size={18} />
                                        <input 
                                            required
                                            value={newBarber.apellido}
                                            onChange={e => setNewBarber({...newBarber, apellido: e.target.value})}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3366FF] focus:bg-white rounded-2xl font-bold text-slate-900 outline-none transition-all"
                                            placeholder="Apellido"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3366FF]" size={18} />
                                        <input 
                                            required
                                            type="email"
                                            value={newBarber.email}
                                            onChange={e => setNewBarber({...newBarber, email: e.target.value})}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3366FF] focus:bg-white rounded-2xl font-bold text-slate-900 outline-none transition-all"
                                            placeholder="email@ejemplo.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Teléfono</label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3366FF]" size={18} />
                                        <input 
                                            required
                                            value={newBarber.telefono}
                                            onChange={e => setNewBarber({...newBarber, telefono: e.target.value})}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3366FF] focus:bg-white rounded-2xl font-bold text-slate-900 outline-none transition-all"
                                            placeholder="+56 9..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Especialidad</label>
                                    <div className="relative">
                                        <Scissors className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3366FF]" size={18} />
                                        <input 
                                            required
                                            value={newBarber.especialidad}
                                            onChange={e => setNewBarber({...newBarber, especialidad: e.target.value})}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3366FF] focus:bg-white rounded-2xl font-bold text-slate-900 outline-none transition-all"
                                            placeholder="Ej. Fade, Barba..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Experiencia (Años)</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3366FF]" size={18} />
                                        <input 
                                            required
                                            type="number"
                                            value={newBarber.anos_experiencia}
                                            onChange={e => setNewBarber({...newBarber, anos_experiencia: Number(e.target.value)})}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#3366FF] focus:bg-white rounded-2xl font-bold text-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 flex items-start gap-4">
                                <ShieldCheck className="text-[#3366FF] mt-1" size={24} />
                                <div>
                                    <p className="text-slate-900 font-extrabold text-sm">Contraseña Temporal</p>
                                    <p className="text-slate-500 font-bold text-xs mt-1">Se ha generado una clave temporal: <code className="bg-white px-2 py-1 rounded text-[#3366FF]">Pass123*</code>. El barbero deberá cambiarla en su primer inicio de sesión.</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-[#16a34a] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-green-100 hover:bg-[#15803d] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? 'REGISTRANDO...' : 'CONFIRMAR REGISTRO'}
                                    <Check size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default BarberosManager;