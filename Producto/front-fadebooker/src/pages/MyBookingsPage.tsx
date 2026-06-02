import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/lib/api/bookingService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import BookingsSection from '@/components/organisms/BookingsSection';
import { Search, Filter, X } from 'lucide-react';

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user ? Number(user.id_usuario || user.id) : undefined;
  const isBarbero = user?.rol === 'Barbero' || user?.rol === 'Dueño';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-bookings', userId, user?.rol],
    queryFn: () => {
      if (isBarbero && user?.id_barbero) {
        return bookingService.getCitasByBarbero(Number(user.id_barbero));
      }
      return bookingService.getCitasByCliente(userId as number);
    },
    enabled: !!userId,
  });

  const filteredAppointments = useMemo(() => {
    if (!data) return [];
    
    return data.filter((c: any) => {
      const barberoNombre = (c.barbero_nombre && c.barbero_apellido) 
        ? `${c.barbero_nombre} ${c.barbero_apellido}` 
        : c.barbero_nombre || c.barbero?.nombre || '';
      
      const clienteNombre = (c.cliente_nombre && c.cliente_apellido)
        ? `${c.cliente_nombre} ${c.cliente_apellido}`
        : c.cliente_nombre || '';

      const servicioNombre = c.servicio_nombre || c.nombre_servicio || c.servicio?.nombre || '';
      
      const searchMatch = 
        barberoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servicioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id_cita?.toString().includes(searchTerm);

      const statusMatch = statusFilter === 'all' || c.estado.toLowerCase() === statusFilter.toLowerCase();
      
      return searchMatch && statusMatch;
    }).sort((a: any, b: any) => {
      const dateA = a.fecha_hora_inicio ? new Date(a.fecha_hora_inicio).getTime() : new Date(`${a.fecha} ${a.hora}`).getTime();
      const dateB = b.fecha_hora_inicio ? new Date(b.fecha_hora_inicio).getTime() : new Date(`${b.fecha} ${b.hora}`).getTime();
      return dateB - dateA;
    });
  }, [data, searchTerm, statusFilter]);

  if (!userId) {
    return <div className="page-content container text-center py-20">Inicia sesión para ver tus citas y gestionar tus reservas.</div>;
  }

  if (isLoading) return (
    <div className="page-content container flex flex-col items-center justify-center py-24">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3366FF] mb-4"></div>
      <p className="text-slate-500 font-bold">Cargando tus citas...</p>
    </div>
  );
  
  if (error) return <div className="page-content container text-center py-20 text-red-500">Error al cargar tus citas.</div>;

  return (
    <div className="min-h-screen bg-slate-50/30">
      <section className="page-content container py-16">
        <div className="section-heading mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Mis Citas</h1>
            <p className="text-xl text-slate-500 mt-4">Consulta el historial y las próximas reservas de tu cuenta.</p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Buscador */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3366FF] transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Buscar por barbero, servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-10 py-4 bg-white border-2 border-slate-100 rounded-2xl w-full sm:w-64 outline-none focus:border-[#3366FF] transition-all font-medium text-slate-700"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filtro de Estado */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-12 pr-10 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-[#3366FF] transition-all font-bold text-slate-700 appearance-none min-w-[180px]"
              >
                <option value="all">Todos los estados</option>
                <option value="confirmada">Confirmada</option>
                <option value="pendiente">Pendiente de Pago</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAppointments.length ? (
          <BookingsSection
            bookings={filteredAppointments.map((c: any) => ({
              id: c.id_cita || c.id,
              fecha: c.fecha_hora_inicio ? c.fecha_hora_inicio.split('T')[0] : c.fecha,
              hora: c.fecha_hora_inicio ? c.fecha_hora_inicio.split('T')[1].substring(0, 5) : c.hora,
              barberoName: (c.barbero_nombre && c.barbero_apellido) 
                ? `${c.barbero_nombre} ${c.barbero_apellido}` 
                : c.barbero_nombre || (c.barbero?.nombre || 'No especificado'),
              clienteName: (c.cliente_nombre && c.cliente_apellido)
                ? `${c.cliente_nombre} ${c.cliente_apellido}`
                : c.cliente_nombre || 'Cliente',
              servicioName: c.servicio_nombre || c.nombre_servicio || (c.servicio?.servicio?.nombre || c.servicio?.nombre || 'Sin datos'),
              estado: c.estado,
              notas: c.notas,
              isBarberoView: isBarbero,
              montoTotal: c.monto_total,
              pagoAbono: c.pago_abono
            }))}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[4rem] shadow-xl border-2 border-slate-50 border-dashed">
            <p className="text-3xl font-black text-slate-900 mb-4">No se encontraron citas</p>
            <p className="text-slate-500 mb-8 max-w-sm">Prueba ajustando los filtros o el término de búsqueda para encontrar lo que buscas.</p>
            {(searchTerm || statusFilter !== 'all') && (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="text-[#3366FF] font-black uppercase tracking-widest text-sm hover:underline"
              >
                LIMPIAR FILTROS
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyBookingsPage;
