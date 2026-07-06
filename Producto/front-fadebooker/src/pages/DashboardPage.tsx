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
    enabled: user?.rol !== 'Dueño',
  });

  const [bookingsOwnershipWarning, setBookingsOwnershipWarning] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (bookings) {
      console.log('[DashboardPage] bookings from service:', bookings);
      if (user && bookings.some((b: any) => b.id_cliente && Number(b.id_cliente) !== Number(user.id_usuario))) {
        console.warn('[DashboardPage] some bookings do not belong to current user', bookings.filter((b:any)=>b.id_cliente && Number(b.id_cliente) !== Number(user.id_usuario)));
        setBookingsOwnershipWarning('Se detectaron citas que no parecen pertenecer a tu cuenta. Contacta soporte si persiste.');
      } else {
        setBookingsOwnershipWarning(null);
      }
    }
  }, [bookings]);

  const [showAll, setShowAll] = React.useState(false);

  // Filter bookings dynamically: only confirmed future bookings for the logged user
  const upcomingBookings = React.useMemo(() => {
    if (!bookings) return [];
    const ahora = new Date();
    const datos = bookings
      .map((b: any) => ({
        ...b,
        // normalize datetime field used across API versions
        _datetime: b.fecha_hora_inicio ? new Date(b.fecha_hora_inicio) : (b.fecha && b.hora ? new Date(`${b.fecha}T${b.hora}`) : null)
      }))
      .filter((b: any) => {
        if (!b._datetime) return false;
        const estado = (b.estado || '').toLowerCase();
        // only confirmed bookings should be shown here
        if (estado !== 'confirmada') return false;
        // allow a timezone tolerance of up to 3 hours (in ms) to avoid UTC/local shift hiding future slots
        const toleranceMs = 3 * 60 * 60 * 1000;
        return (b._datetime.getTime() - ahora.getTime()) >= -toleranceMs;
      })
      .sort((a: any, b: any) => a._datetime.getTime() - b._datetime.getTime());

    return datos;
  }, [bookings]);

  const completedBookingsCount = React.useMemo(() => {
    if (!bookings) return 0;
    // Filter appointments with state 'completada' or 'Completada'
    return bookings.filter((b: any) => b.estado?.toLowerCase() === 'completada').length;
  }, [bookings]);

  const defaultCards = [
    {
      title: 'Mi Perfil',
      description: 'Gestiona tu información personal y foto.',
      icon: <User className="text-[#3366FF]" size={24} />,
      link: '/profile',
      color: 'bg-blue-50'
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

  const ownerCards = [
    {
      title: 'Mi Perfil',
      description: 'Gestiona tu información personal y foto.',
      icon: <User className="text-[#3366FF]" size={24} />,
      link: '/profile',
      color: 'bg-blue-50'
    },
    // Suscripción y Promociones removidos del dashboard según solicitud
  ];

  const cards = user?.rol === 'Dueño'
    ? ownerCards
    : user?.rol === 'Barbero'
      ? [
          ...defaultCards.slice(0, 1),
          {
            title: 'Mis Citas',
            description: 'Revisa tus citas próximas y pasadas.',
            icon: <Calendar className="text-emerald-500" size={24} />,
            link: '/bookings',
            color: 'bg-emerald-50'
          },
          ...defaultCards.slice(1)
        ]
      : defaultCards;

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
          {user?.rol !== 'Dueño' ? (
            <section className="card-surface p-6">
              {bookingsOwnershipWarning && (
                <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm">
                  {bookingsOwnershipWarning}
                </div>
              )}
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="text-[#3366FF]" size={20} />
                Próximas Citas
              </h2>
              
              <div className="space-y-4">
                {upcomingBookings && upcomingBookings.length > 0 ? (
                  // show up to 5 by default, allow "Ver más" via showAll
                  upcomingBookings.slice(0, showAll ? upcomingBookings.length : 5).map((next: any) => (
                    <div key={next.id_cita} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black uppercase tracking-tighter text-[#3366FF] bg-blue-50 px-2 py-1 rounded">
                          {next._datetime.toLocaleDateString()}
                        </span>
                        <span className="text-xs text-slate-400">
                          {next._datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                        <p className="font-bold text-slate-800">{next.nombre_servicio || next.servicio?.nombre || next.servicio_nombre || 'Servicio de Barbería'}</p>
                        {/* Normalize tienda name/address from multiple possible response shapes */}
                        {(() => {
                          const tiendaObj = next.tienda || {};
                          const displayName = next.tiendaName || next.tienda_nombre || tiendaObj.nombre || tiendaObj.nombre_tienda || tiendaObj.name || next.tienda || 'Barbería';
                          const displayDir = next.tiendaDireccion || next.direccion || tiendaObj.direccion || tiendaObj.address || tiendaObj.direccion_tienda || null;
                          return (
                            <>
                              <p className="text-sm text-slate-500">{displayName}</p>
                              {displayDir ? <p className="text-sm text-slate-400">{displayDir}</p> : <p className="text-sm text-slate-400">—</p>}
                            </>
                          )
                        })()}
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
                
                {(!showAll && upcomingBookings && upcomingBookings.length > 5) && (
                  <div className="text-center mt-4">
                    <button onClick={() => setShowAll(true)} className="text-sm font-bold text-[#3366FF]">Ver más</button>
                  </div>
                )}

                <Link to="/bookings" className="block text-center mt-6 text-sm font-bold text-slate-400 hover:text-[#3366FF] transition-colors">
                  Ver todas mis citas
                </Link>
              </div>
            </section>
          ) : null }

          {/* Estado de Cuenta removed as requested */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;