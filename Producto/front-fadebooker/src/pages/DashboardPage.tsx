import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/lib/api/bookingService';
import { Calendar, User, Search, Settings, LogOut, Clock, CheckCircle, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const { data: bookings } = useQuery({
    queryKey: ['my-bookings-summary'],
    queryFn: () => bookingService.getMyBookings(),
  });

  // Filter bookings dynamically
  const upcomingBookings = React.useMemo(() => {
    if (!bookings) return [];
    // Filter appointments with state 'confirmada' or 'Confirmada'
    return bookings
      .filter((b: any) => b.estado?.toLowerCase() === 'confirmada')
      .slice(0, 3);
  }, [bookings]);

  const completedBookingsCount = React.useMemo(() => {
    if (!bookings) return 0;
    // Filter appointments with state 'completada' or 'Completada'
    return bookings.filter((b: any) => b.estado?.toLowerCase() === 'completada').length;
  }, [bookings]);

  const cards = [
    {
      title: 'Mi Perfil',
      description: 'Gestiona tu información personal y foto.',
      icon: <User className="text-[#3366FF]" size={24} />,
      link: '/profile',
      color: 'bg-blue-50'
    },
    {
      title: 'Mis Citas',
      description: 'Revisa tus citas próximas y pasadas.',
      icon: <Calendar className="text-emerald-500" size={24} />,
      link: '/bookings',
      color: 'bg-emerald-50'
    },
    {
      title: 'Explorar',
      description: 'Busca barberías y reserva tu próximo corte.',
      icon: <Search className="text-purple-500" size={24} />,
      link: '/barberias',
      color: 'bg-purple-50'
    },
    {
      title: 'Ayuda',
      description: '¿Tienes dudas? Consulta nuestras guías.',
      icon: <Settings className="text-slate-500" size={24} />,
      link: '/ayuda',
      color: 'bg-slate-50'
    }
  ];

  // Si es proveedor, añadimos tarjeta de promociones
  if (user?.rol === 'Proveedor') {
    cards.splice(1, 0, {
      title: 'Promociones',
      description: 'Publica anuncios y ofertas para barberías.',
      icon: <Ticket className="text-amber-500" size={24} />,
      link: '/promociones',
      color: 'bg-amber-50'
    });
  }

  return (
    <div className="page-content container animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            ¡Hola, <span className="text-[#3366FF]">{user?.nombre || 'Usuario'}</span>!
          </h1>
          <p className="text-slate-500 mt-1">Bienvenido de nuevo a tu panel de control.</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-bold border border-red-100"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Acciones rápidas */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#3366FF] rounded-full"></span>
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cards.map((card, idx) => (
                <Link 
                  key={idx} 
                  to={card.link}
                  className="group p-6 card-surface hover:border-[#3366FF]/30 transition-all flex items-start gap-4"
                >
                  <div className={`p-3 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#3366FF] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-500">{card.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {user?.rol === 'Cliente' && (
            <section className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2">¿Listo para un cambio?</h3>
                <p className="text-slate-300 mb-6 max-w-md">Reserva hoy mismo con los mejores barberos de tu zona y mantén tu estilo al día.</p>
                <Link to="/barberias" className="button button-primary inline-flex items-center gap-2 border-none">
                  <Search size={18} />
                  Buscar Barberías
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            </section>
          )}
        </div>

        {/* Columna Derecha: Resumen de actividad */}
        <div className="space-y-8">
          <section className="card-surface p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="text-[#3366FF]" size={20} />
              Próximas Citas
            </h2>
            
            <div className="space-y-4">
              {upcomingBookings && upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking: any) => (
                  <div key={booking.id_cita} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black uppercase tracking-tighter text-[#3366FF] bg-blue-50 px-2 py-1 rounded">
                        {new Date(booking.fecha_hora_inicio).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(booking.fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800">{booking.nombre_servicio || 'Servicio de Barbería'}</p>
                    <p className="text-sm text-slate-500">{booking.nombre_barberia || 'Barbería'}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="text-slate-300" size={24} />
                  </div>
                  <p className="text-sm text-slate-500">No tienes citas próximas confirmadas.</p>
                  <Link to="/barberias" className="text-xs text-[#3366FF] font-bold mt-2 inline-block">Agendar ahora</Link>
                </div>
              )}
            </div>
            
            <Link to="/bookings" className="block text-center mt-6 text-sm font-bold text-slate-400 hover:text-[#3366FF] transition-colors">
              Ver todas mis citas
            </Link>
          </section>

          <section className="card-surface p-6 bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-emerald-500" size={20} />
              <h2 className="text-lg font-bold">Estado de Cuenta</h2>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <span className="text-sm text-slate-500 font-medium">Citas Realizadas</span>
              <span className="text-xl font-black text-slate-900">{completedBookingsCount}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;