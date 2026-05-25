import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/features/auth/hooks/useAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from '@/context/NotificationContext';
import Notification from '@/components/ui/Notification';

import HomePage from '@/pages/HomePage';
import BarberiasPage from '@/pages/BarberiasPage';
import TiendaDetailPage from '@/pages/TiendaDetailPage';
import StudioDangerPage from '@/pages/StudioDangerPage';
import StudioDangerBookingPage from '@/pages/StudioDangerBookingPage';
import BarberDetailPage from '@/pages/BarberDetailPage';
import MyBookingsPage from '@/pages/MyBookingsPage';
import BookingPage from '@/pages/BookingPage';
import ProfilePage from '@/pages/ProfilePage';
import DashboardPage from '@/pages/DashboardPage';
import HelpPage from '@/pages/HelpPage';
import PaymentResultPage from '@/pages/PaymentResultPage';
import BarberDashboardPage from '@/pages/BarberDashboardPage';
import PromocionesPage from '@/pages/PromocionesPage';
import LoginPage from '@/features/auth/ui/LoginPage';
import RegisterPage from '@/features/auth/ui/RegisterPage';
import ForgotPasswordPage from '@/features/auth/ui/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/ui/ResetPasswordPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace state={{ from: location }} />;
};

const BarberoRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user?.rol !== 'Barbero' && user?.rol !== 'Dueño') return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

const ProviderRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user?.rol !== 'Barbero' && user?.rol !== 'Dueño' && user?.rol !== 'Proveedor') return <Navigate to="/" replace />;

  return <>{children}</>;
};

import { Menu, X } from 'lucide-react';

const AppHeader = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  // Close menu when location changes
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="site-header">
      <div className="container header-container">
        <div className="brand">
          <Link to="/" className="brand-logo-link">
            <img src="/images/logo.png" alt="Logo FadeBooker" className="brand-logo-image" />
            <div className="brand-text">
              <span className="brand-title">FadeBooker</span>
              <span className="brand-subtitle">Reserva cortes y gestiona tu estilo.</span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:text-[#3366FF] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className={`header-right ${isMenuOpen ? 'mobile-open' : ''}`}>
          <nav className="header-links">
            <Link to="/" className="link-button">Inicio</Link>
            <Link to="/barberias" className="link-button">Barberías</Link>
            {isAuthenticated ? (
              <>
                {(user?.rol === 'Barbero' || user?.rol === 'Dueño') && (
                  <>
                    <Link to="/barber-dashboard" className="link-button text-[#3366FF] font-black">
                      {user?.rol === 'Dueño' ? 'Panel Dueño' : 'Panel Barbero'}
                    </Link>
                  </>
                )}
                {(user?.rol === 'Barbero' || user?.rol === 'Dueño' || user?.rol === 'Proveedor') && (
                  <Link to="/promociones" className="link-button">Promociones</Link>
                )}
                <Link to="/bookings" className="link-button">Citas</Link>
                <Link to="/profile" className="link-button">Mi perfil</Link>
                <button onClick={logout} className="button button-secondary w-full md:w-auto">Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" className="button button-primary w-full md:w-auto">Ingresar</Link>
                <Link to="/register" className="button button-secondary w-full md:w-auto">Registrarme</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="flex flex-col min-h-screen">
              <AppHeader />
              <main className="app-main flex-grow">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                  <Route path="/barber-dashboard" element={<BarberoRoute><BarberDashboardPage /></BarberoRoute>} />
                  <Route path="/promociones" element={<ProviderRoute><PromocionesPage /></ProviderRoute>} />
                  <Route path="/barbero/:id" element={<BarberDetailPage />} />
                  <Route path="/tienda/:id" element={<TiendaDetailPage />} />
                  <Route path="/studiodeanger" element={<StudioDangerPage />} />
                  <Route path="/studiodeanger/reservar" element={<StudioDangerBookingPage />} />
                  <Route path="/booking/new" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
                  <Route path="/bookings" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                  <Route path="/barberias" element={<BarberiasPage />} />
                  <Route path="/pago-exitoso" element={<PaymentResultPage />} />
                  <Route path="/pago-fallido" element={<PaymentResultPage />} />
                  <Route path="/pago-pendiente" element={<PaymentResultPage />} />
                  <Route path="/ayuda" element={<HelpPage />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Notification />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
