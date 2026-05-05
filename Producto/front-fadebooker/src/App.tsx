import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/features/auth/hooks/useAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomePage from '@/pages/HomePage';
import BarberDetailPage from '@/pages/BarberDetailPage';
import MyBookingsPage from '@/pages/MyBookingsPage';
import BookingPage from '@/pages/BookingPage';
import ProfilePage from '@/pages/ProfilePage';
import HelpPage from '@/pages/HelpPage';
import LoginPage from '@/features/auth/ui/LoginPage';
import RegisterPage from '@/features/auth/ui/RegisterPage';

const Dashboard = () => {
  const { logout, user } = useAuth();
  return (
    <div className="p-10">
      <h1>Bienvenido, {user?.nombre || 'Usuario'}</h1>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Cerrar Sesión</button>
    </div>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace state={{ from: location }} />;
};

const AppHeader = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="site-header">
      <div className="container header-container">
        <div className="brand">
          <Link to="/" className="brand-title">FadeBooker</Link>
          <p className="brand-subtitle">Agendá tu corte con el mejor barbero.</p>
        </div>
        <div className="header-right">
          {isAuthenticated && (
            <p className="header-greeting">Hola, {user?.nombre}</p>
          )}
          <nav className="header-links">
            <Link to="/" className="link-button link-alt">Inicio</Link>
            <Link to="/barberias" className="link-button">Barberías</Link>
            <Link to="/bookings" className="link-button link-alt">Mis Citas</Link>
            <Link to="/profile" className="link-button link-alt">Mi Perfil</Link>
            <Link to="/ayuda" className="link-button link-alt">Ayuda</Link>
            {isAuthenticated && (
              <button onClick={logout} className="link-button link-outline ml-2">Cerrar sesión</button>
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
      <AuthProvider>
        <BrowserRouter>
          <AppHeader />
          <main className="app-main">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/barbero/:id" element={<BarberDetailPage />} />
              <Route path="/booking/new" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
              <Route path="/bookings" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="/ayuda" element={<HelpPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
