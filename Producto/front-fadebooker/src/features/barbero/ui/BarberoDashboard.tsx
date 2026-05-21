import React, { useState } from 'react';
import { useBarberoDashboard } from '../hooks/useBarberoDashboard';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { TrendingUp, Calendar, Scissors, DollarSign, Clock, Plus, LayoutDashboard, Store, Users } from 'lucide-react';
import BarberoManualBooking from './BarberoManualBooking';
import TiendaConfig from './TiendaConfig';
import BarberosManager from '@/features/barberos/ui/BarberosManager';

const BarberoDashboard: React.FC = () => {
    const { user } = useAuth();
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
    const [showManualBooking, setShowManualBooking] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'tienda' | 'equipo'>('dashboard');
    
    // Obtenemos el ID del barbero desde el objeto de usuario (inyectado en login/perfil)
    const idBarbero = user?.id_barbero; 

    const { stats, bookings, info, isLoading, refetch } = useBarberoDashboard(idBarbero as number, period);

    if (!idBarbero) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="text-center bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-md border-8 border-white">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Acceso Denegado</h2>
                    <p className="text-slate-500 font-bold mb-8">No se encontró información de barbero vinculada a tu cuenta.</p>
                </div>
            </div>
        );
    }

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-[#3366FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10" role="main">
            {showManualBooking && (
                <BarberoManualBooking 
                    onClose={() => setShowManualBooking(false)} 
                    onSuccess={() => {
                        setShowManualBooking(false);
                        refetch();
                    }}
                />
            )}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Bienvenido, {info?.nombre || user?.nombre}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {user?.rol === 'Dueño' && (
                            <nav className="flex bg-white p-2 rounded-2xl shadow-lg border-2 border-slate-100" aria-label="Navegación del Panel">
                                <button 
                                    onClick={() => setActiveTab('dashboard')}
                                    aria-current={activeTab === 'dashboard' ? 'page' : undefined}
                                    className={`px-6 py-3 rounded-xl flex items-center gap-2 font-black text-xs uppercase transition-all ${activeTab === 'dashboard' ? 'bg-[#3366FF] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <LayoutDashboard size={16} aria-hidden="true" /> Agenda
                                </button>
                                <button 
                                    onClick={() => setActiveTab('tienda')}
                                    aria-current={activeTab === 'tienda' ? 'page' : undefined}
                                    className={`px-6 py-3 rounded-xl flex items-center gap-2 font-black text-xs uppercase transition-all ${activeTab === 'tienda' ? 'bg-[#3366FF] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <Store size={16} aria-hidden="true" /> Mi Barbería
                                </button>
                                <button 
                                    onClick={() => setActiveTab('equipo')}
                                    aria-current={activeTab === 'equipo' ? 'page' : undefined}
                                    className={`px-6 py-3 rounded-xl flex items-center gap-2 font-black text-xs uppercase transition-all ${activeTab === 'equipo' ? 'bg-[#3366FF] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <Users size={16} aria-hidden="true" /> Equipo
                                </button>
                            </nav>
                        )}
                        <button 
                            onClick={() => setShowManualBooking(true)}
                            aria-label="Registrar nueva cita manual"
                            className="flex items-center gap-3 bg-[#16a34a] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-[#15803d] transition-all"
                        >
                            <Plus size={24} aria-hidden="true" />
                            CITA MANUAL
                        </button>
                    </div>
                </header>

                {activeTab === 'dashboard' ? (
                    <section aria-labelledby="stats-heading">
                        <h2 id="stats-heading" className="sr-only">Estadísticas y Agenda</h2>
                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <article className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                                    <DollarSign size={80} className="text-[#3366FF]" aria-hidden="true" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">Ingresos {period === 'day' ? 'Hoy' : period === 'week' ? 'Semana' : 'Mes'}</p>
                                    <h3 className="text-4xl font-black text-slate-900 mb-6">
                                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(stats?.ingresos || 0)}
                                    </h3>
                                    <div className="flex gap-2" role="group" aria-label="Cambiar período de estadísticas">
                                        {['day', 'week', 'month'].map((p) => (
                                            <button 
                                                key={p}
                                                onClick={() => setPeriod(p as any)}
                                                aria-pressed={period === p}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${period === p ? 'bg-[#3366FF] text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                            >
                                                {p === 'day' ? 'Día' : p === 'week' ? 'Sem' : 'Mes'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </article>

                            <article className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                                    <Scissors size={80} className="text-[#3366FF]" aria-hidden="true" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">Servicios Realizados</p>
                                    <h3 className="text-4xl font-black text-slate-900">{stats?.totalServicios || 0}</h3>
                                    <p className="text-[#16a34a] font-bold text-sm mt-2 flex items-center gap-1">
                                        <TrendingUp size={16} aria-hidden="true" /> +12% vs anterior
                                    </p>
                                </div>
                            </article>

                            <article className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                                    <Clock size={80} className="text-[#3366FF]" aria-hidden="true" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">Próxima Cita en</p>
                                    <h3 className="text-4xl font-black text-slate-900">45 Min</h3>
                                    <p className="text-slate-500 font-bold text-sm mt-2">Corte & Barba - Juan P.</p>
                                </div>
                            </article>
                        </div>

                        {/* Agenda */}
                        <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-8 border-white">
                            <div className="p-10 border-b-4 border-slate-50 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-10 bg-rose-500 rounded-full" aria-hidden="true"></div>
                                    <h3 className="text-3xl font-black text-slate-900">Agenda del Día</h3>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
                                     <Calendar size={20} className="text-[#3366FF] ml-2" aria-hidden="true" />
                                     <span className="font-black text-slate-900 mr-2">{new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}</span>
                                </div>
                            </div>

                            <div className="p-4 overflow-x-auto">
                                <table className="w-full text-left">
                                    <caption className="sr-only">Lista de citas agendadas para hoy</caption>
                                    <thead>
                                        <tr className="text-slate-400 font-black text-xs uppercase tracking-widest">
                                            <th className="px-8 py-6">Hora</th>
                                            <th className="px-8 py-6">Cliente</th>
                                            <th className="px-8 py-6">Servicio</th>
                                            <th className="px-8 py-6">Estado</th>
                                            <th className="px-8 py-6">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-slate-50">
                                        {bookings && bookings.length > 0 ? bookings.map((booking: any) => (
                                            <tr key={booking.id_cita} className="group hover:bg-slate-50 transition-colors">
                                                <td className="px-8 py-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-3 bg-blue-50 text-[#3366FF] rounded-2xl">
                                                            <Clock size={20} />
                                                        </div>
                                                        <span className="font-black text-slate-900 text-xl">{booking.fecha_hora_inicio.substring(11, 16)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <span className="font-bold text-slate-900 text-lg">{booking.cliente?.nombre || 'Cliente Manual'}</span>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <span className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{booking.servicio?.nombre || 'Corte'}</span>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                        booking.estado === 'completada' ? 'bg-green-100 text-green-600' :
                                                        booking.estado === 'cancelada' ? 'bg-red-100 text-red-600' :
                                                        'bg-blue-100 text-blue-600'
                                                    }`}>
                                                        {booking.estado}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <button className="text-[#3366FF] font-black text-xs uppercase tracking-widest hover:text-rose-500 transition-colors">
                                                        DETALLES
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <Calendar size={48} className="text-slate-200 mb-4" />
                                                        <p className="text-slate-400 font-bold italic text-xl">No hay citas agendadas para hoy.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                ) : activeTab === 'tienda' ? (
                    <TiendaConfig />
                ) : (
                    <BarberosManager />
                )}
            </div>
        </main>
    );
};

export default BarberoDashboard;
