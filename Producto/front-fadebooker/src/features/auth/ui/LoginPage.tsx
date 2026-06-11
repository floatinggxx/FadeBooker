import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '@/lib/api/authService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { parseError } from '@/lib/utils/errorParser';

type FormData = { email: string; password: string };

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { login, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: FormData) => {
    try {
      const resp = await authService.login(data.email, data.password);
      if (resp?.token) {
        login({ 
          id: resp.id, 
          nombre: resp.nombre, 
          email: resp.email, 
          rol: resp.rol,
          id_tienda: resp.id_tienda,
          id_barbero: resp.id_barbero
        }, resp.token);
        showNotification(`¡Bienvenido de nuevo, ${resp.nombre}!`, 'success');
        navigate(from, { replace: true });
      } else {
        showNotification('Respuesta inválida del servidor', 'error');
      }
    } catch (err: any) {
      showNotification(parseError(err), 'error');
    }
  };

  return (
    <section className="page-content container auth-page">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>
        <p className="auth-subtitle">Accede a tu cuenta para gestionar tus citas y ver las mejores barberías.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="input-container">
            <input 
              {...register('email', { 
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido'
                }
              })} 
              placeholder="Correo electrónico" 
              className={`input-field ${errors.email ? 'input-error' : ''}`} 
              maxLength={100}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <input 
                {...register('password', { required: 'La contraseña es obligatoria' })} 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Contraseña" 
                className={`input-field ${errors.password ? 'input-error' : ''}`} 
                maxLength={64}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <div className="flex justify-end mb-4">
            <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: '#3366FF', fontWeight: 600 }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="button button-primary button-glow">Entrar</button>
          
          <div className="flex justify-center items-center gap-1 mt-6 text-sm">
            <span className="text-slate-500">¿Aún no tienes cuenta?</span>
            <Link to="/register" style={{ color: '#3366FF', fontWeight: 700 }}>Regístrate</Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
