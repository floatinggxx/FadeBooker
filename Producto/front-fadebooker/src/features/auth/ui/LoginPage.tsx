import React from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '@/lib/api/authService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

type FormData = { email: string; password: string };

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { login, isAuthenticated } = useAuth();
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
        login({ id: resp.id, nombre: resp.nombre, email: resp.email, rol: resp.rol }, resp.token);
        navigate(from, { replace: true });
      } else {
        alert('Respuesta inválida del servidor');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error en login');
    }
  };

  return (
    <section className="page-content container auth-page">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>
        <p className="auth-subtitle">Accede a tu cuenta para gestionar tus citas y barberos favoritos.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <input {...register('email')} placeholder="Correo electrónico" className="input-field" />
          <input {...register('password')} type="password" placeholder="Contraseña" className="input-field" />
          <button type="submit" className="button button-primary">Entrar</button>
          <div className="form-footnote">
            <span>No tienes cuenta?</span>
            <Link to="/register" className="link-alt">Regístrate</Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
