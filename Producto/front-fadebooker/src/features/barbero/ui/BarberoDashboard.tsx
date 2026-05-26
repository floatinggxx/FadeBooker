import React, { useState, useMemo } from 'react';
import { useBarberoDashboard } from '../hooks/useBarberoDashboard';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useNotification } from '@/context/NotificationContext';
import { TrendingUp, Calendar, Scissors, DollarSign, Clock, Plus, LayoutDashboard, Store, Users, Search, Filter, X, CheckCircle, XCircle, Info, Phone } from 'lucide-react';
import BarberoManualBooking from './BarberoManualBooking';
import TiendaConfig from './TiendaConfig';
import BarberosManager from '@/features/barberos/ui/BarberosManager';
import ServiciosManager from './ServiciosManager';
import { bookingService } from '@/lib/api/bookingService';

const BarberoDashboard: React.FC = () => {
    const { user } = useAuth();
    const { showNotification } = useNotification();
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
    const [showManualBooking, setShowManualBooking] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'tienda' | 'equipo' | 'servicios'>('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isUpdating, setIsUpdating] = useState(false);
    // Obtenemos el ID del barbero desde el objeto de usuario (inyectado en login/perfil)
    const idBarbero = user?.id_barbero; 
    
    // Solo enviamos idTienda si el usuario es Dueño para que el hook use el endpoint de tienda
    const idTienda = user?.rol === 'Dueño' ? user?.id_tienda : undefined;

    const { stats, bookings, info, isLoading, refetch } = useBarberoDashboard(idBarbero as number, period, idTienda as number);

    const filteredBookings = useMemo(() => {
        if (!bookings) return [];
        return bookings.filter((booking: any) => {
            const matchesSearch = 
                (booking.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (booking.cliente_apellido?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (booking.servicio_nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (booking.fecha_hora_inicio?.includes(searchTerm));
            
            const matchesStatus = statusFilter === 'all' || booking.estado === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchTerm, statusFilter]);

    const handleUpdateStatus = async (id: number, nuevoEstado: string) => {
        if (!id) {
            showNotification("ID de cita no válido", "error");
            return;
        }
        setIsUpdating(true);
        try {
            await bookingService.cambiarEstadoCita(id, nuevoEstado);
            showNotification(`Cita ${nuevoEstado} correctamente`, "success");
            setSelectedBooking(null);
            refetch();
        } catch (err: any) {
            console.error("Error al actualizar estado:", err);
            // Capturar mensaje del backend (validateRequest o error explícito)
            const errorData = err.response?.data;
            const msg = errorData?.error || errorData?.message || err.message || "Error al actualizar el estado";
            showNotification(msg, "error");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRegisterCashPayment = async (id: number) => {
        if (!id) return;
        setIsUpdating(true);
        try {
            await bookingService.registrarPagoEfectivo(id);
            showNotification("Pago registrado correctamente (Efectivo)", "success");
            setSelectedBooking(null);
            refetch();
        } catch (err: any) {
            console.error("Error al registrar pago:", err);
            const msg = err.response?.data?.error || "Error al registrar pago";
            showNotification(msg, "error");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!idBarbero && user?.rol !== 'Dueño') {
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
                                <button 
                                    onClick={() => setActiveTab('servicios')}
                                    aria-current={activeTab === 'servicios' ? 'page' : undefined}
                                    className={`px-6 py-3 rounded-xl flex items-center gap-2 font-black text-xs uppercase transition-all ${activeTab === 'servicios' ? 'bg-[#3366FF] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <Scissors size={16} aria-hidden="true" /> Servicios
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
                                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(stats?.ingresos || stats?.ingresosHoy || 0)}
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
                                    <h3 className="text-4xl font-black text-slate-900">{stats?.totalServicios || stats?.serviciosHoy || 0}</h3>
                                    <p className="text-[#16a34a] font-bold text-sm mt-2 flex items-center gap-1">
                                        <TrendingUp size={16} aria-hidden="true" /> Real
                                    </p>
                                </div>
                            </article>

                            <article className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                                    <Clock size={80} className="text-[#3366FF]" aria-hidden="true" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">Próxima Cita</p>
                                    <h3 className="text-3xl font-black text-slate-900">
                                        {stats?.proximaCita ? stats.proximaCita.fecha_hora_inicio.substring(11, 16) : 'Sin citas'}
                                    </h3>
                                    <p className="text-slate-500 font-bold text-sm mt-2">
                                        {stats?.proximaCita ? `${stats.proximaCita.nombre_servicio} - ${stats.proximaCita.cliente_nombre}` : 'Día tranquilo'}
                                    </p>
                                </div>
                            </article>
                        </div>

                        {/* Agenda */}
                        <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-8 border-white">
                            <div className="p-10 border-b-4 border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-10 bg-rose-500 rounded-full" aria-hidden="true"></div>
                                    <h3 className="text-3xl font-black text-slate-900">Agenda del Día</h3>
                                </div>
                                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-64">
                                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Buscar cliente, servicio o hora..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#3366FF] transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <select 
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="appearance-none bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-10 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#3366FF] transition-all"
                                        >
                                            <option value="all">Filtro Estado</option>
                                            <option value="confirmada">Confirmada</option>
                                            <option value="pendiente">Pendiente</option>
                                            <option value="completada">Completada</option>
                                            <option value="cancelada">Cancelada</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
                                        <Calendar size={20} className="text-[#3366FF] ml-2" aria-hidden="true" />
                                        <span className="font-black text-slate-900 mr-2">{new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 overflow-x-auto">
                                <table className="w-full text-left">
                                    <caption className="sr-only">Lista de citas agendadas para hoy</caption>
                                    <thead>
                                        <tr className="text-slate-400 font-black text-xs uppercase tracking-widest">
                                            <th className="px-8 py-6">Hora {period !== 'day' && 'y Fecha'}</th>
                                            <th className="px-8 py-6">Cliente</th>
                                            <th className="px-8 py-6">Servicio</th>
                                            <th className="px-8 py-6">Pago</th>
                                            <th className="px-8 py-6">Estado</th>
                                            <th className="px-8 py-6">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-slate-50">
                                        {filteredBookings && filteredBookings.length > 0 ? filteredBookings.map((booking: any) => (
                                            <tr key={booking.id_cita} className="group hover:bg-slate-50 transition-colors">
                                                <td className="px-8 py-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-3 bg-blue-50 text-[#3366FF] rounded-2xl">
                                                            <Clock size={20} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-slate-900 text-xl">
                                                                {booking.fecha_hora_inicio ? booking.fecha_hora_inicio.substring(11, 16) : 'N/A'}
                                                            </span>
                                                            {period !== 'day' && (
                                                                <span className="text-slate-400 text-[10px] font-black uppercase">
                                                                    {booking.fecha_hora_inicio ? new Date(booking.fecha_hora_inicio).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }) : ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <span className="font-bold text-slate-900 text-lg">
                                                        {booking.cliente_nombre ? `${booking.cliente_nombre} ${booking.cliente_apellido || ''}` : (booking.cliente?.nombre || 'Cliente Manual')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <span className="bg-slate-100 text-[#3366FF] px-4 py-2 rounded-xl text-xs font-black uppercase border-2 border-white shadow-sm inline-block max-w-[220px] truncate" title={booking.servicio_nombre || booking.servicio?.nombre || 'Corte'}>
                                                        {booking.servicio_nombre || booking.servicio?.nombre || 'Corte'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase border-2 ${
                                                        booking.estado_pago === 'pagado' 
                                                        ? 'bg-green-50 text-green-600 border-green-100' 
                                                        : booking.estado_pago === 'abonado' 
                                                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                                                        : 'bg-slate-50 text-slate-400 border-slate-100'
                                                    }`}>
                                                        {booking.estado_pago || 'Pendiente'}
                                                    </span>
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
                                                    <button 
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="text-[#3366FF] font-black text-xs uppercase tracking-widest hover:text-rose-500 transition-colors"
                                                    >
                                                        DETALLES
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <Calendar size={48} className="text-slate-200 mb-4" />
                                                        <p className="text-slate-400 font-bold italic text-xl">No hay citas que coincidan con los filtros.</p>
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
                ) : activeTab === 'servicios' ? (
                    <ServiciosManager />
                ) : (
                    <BarberosManager />
                )}
            </div>

            {/* Modal de Detalles de Cita */}
            {selectedBooking && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden border-8 border-white animate-scale-in">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-10 bg-[#3366FF] rounded-full"></div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Detalles de Cita</h2>
                                </div>
                                <button onClick={() => setSelectedBooking(null)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem]">
                                    <div className="p-4 bg-white shadow-lg rounded-2xl text-[#3366FF]">
                                        <Calendar size={32} />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Fecha y Hora</p>
                                        <p className="text-2xl font-black text-slate-900">
                                            {new Date(selectedBooking.fecha_hora_inicio).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
                                        </p>
                                        <p className="text-slate-500 font-bold">{selectedBooking.fecha_hora_inicio.substring(11, 16)} hrs</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 border-4 border-slate-50 rounded-[2.5rem]">
                                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Cliente</p>
                                        <p className="font-black text-slate-900 text-lg">
                                            {selectedBooking.cliente_nombre ? `${selectedBooking.cliente_nombre} ${selectedBooking.cliente_apellido || ''}` : 'Cliente Manual'}
                                        </p>
                                        {selectedBooking.cliente_telefono && (
                                            <p className="text-slate-500 font-bold flex items-center gap-2 mt-1">
                                                <Phone size={14} /> {selectedBooking.cliente_telefono}
                                            </p>
                                        )}
                                    </div>
                                    <div className="p-6 border-4 border-slate-50 rounded-[2.5rem]">
                                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Servicio</p>
                                        <p className="font-black text-slate-900 text-lg">{selectedBooking.servicio_nombre || 'Corte'}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[#3366FF] font-black">${selectedBooking.monto_total}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                                                selectedBooking.estado_pago === 'pagado' 
                                                ? 'bg-green-100 text-green-600' 
                                                : selectedBooking.estado_pago === 'abonado' 
                                                ? 'bg-blue-100 text-blue-600' 
                                                : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                {selectedBooking.estado_pago || 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {selectedBooking.estado_pago !== 'pagado' && selectedBooking.estado !== 'cancelada' && (
                                    <div className="p-6 bg-[#3366FF]/5 rounded-[2.5rem] border-4 border-[#3366FF]/10">
                                        <p className="text-[#3366FF] font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <DollarSign size={14} /> Gestión de Pago
                                        </p>
                                        <button 
                                            disabled={isUpdating}
                                            onClick={() => handleRegisterCashPayment(selectedBooking.id_cita || selectedBooking.id)}
                                            className="w-full bg-white text-[#3366FF] border-2 border-[#3366FF] py-3 rounded-xl font-black text-xs hover:bg-[#3366FF] hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <DollarSign size={14} /> MARCAR COMO PAGADO (EFECTIVO)
                                        </button>
                                    </div>
                                )}

                                {selectedBooking.notas && (
                                    <div className="p-6 bg-rose-50/50 rounded-[2.5rem] border-4 border-rose-50">
                                        <p className="text-rose-400 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Info size={14} /> Notas
                                        </p>
                                        <p className="text-slate-600 font-bold italic">{selectedBooking.notas}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                {selectedBooking.estado === 'confirmada' && (
                                    <>
                                        <button 
                                            disabled={isUpdating || new Date(selectedBooking.fecha_hora_inicio) > new Date()}
                                            onClick={() => handleUpdateStatus(selectedBooking.id_cita || selectedBooking.id, 'completada')}
                                            className={`flex-1 py-5 rounded-2xl font-black shadow-xl transition-all flex items-center justify-center gap-3 ${
                                                new Date(selectedBooking.fecha_hora_inicio) > new Date() 
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                                : 'bg-[#16a34a] text-white shadow-green-100 hover:bg-[#15803d]'
                                            }`}
                                            title={new Date(selectedBooking.fecha_hora_inicio) > new Date() ? "No se puede completar una cita futura" : ""}
                                        >
                                            <CheckCircle size={20} /> COMPLETAR
                                        </button>
                                        <button 
                                            disabled={isUpdating}
                                            onClick={() => handleUpdateStatus(selectedBooking.id_cita || selectedBooking.id, 'cancelada')}
                                            className="flex-1 bg-white text-rose-500 border-4 border-rose-50 py-5 rounded-2xl font-black hover:bg-rose-50 transition-all flex items-center justify-center gap-3"
                                        >
                                            <XCircle size={20} /> CANCELAR
                                        </button>
                                    </>
                                )}
                                {selectedBooking.estado !== 'confirmada' && (
                                    <button 
                                        onClick={() => setSelectedBooking(null)}
                                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition-all"
                                    >
                                        CERRAR
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default BarberoDashboard;
