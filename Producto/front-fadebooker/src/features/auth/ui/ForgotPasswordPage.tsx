import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';

type FormData = { email: string };

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/usuarios/forgot-password', { email: data.email });
      setIsSubmitted(true);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.response?.data?.error || 'Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="page-content container auth-page">
        <div className="auth-card">
          <h1>Correo enviado</h1>
          <p className="auth-subtitle">
            Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña en unos instantes.
          </p>
          <div className="mt-8 text-center">
            <Link to="/login" className="button button-primary">Volver al inicio</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-content container auth-page">
      <div className="auth-card">
        <h1>Recuperar contraseña</h1>
        <p className="auth-subtitle">Ingresa tu correo electrónico y te enviaremos un enlace para que puedas cambiar tu contraseña.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form mt-8">
          <div className="input-container">
            <input 
              {...register('email', { 
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido'
                }
              })} 
              placeholder="Tu correo electrónico" 
              className={`input-field ${errors.email ? 'input-error' : ''}`} 
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <button type="submit" disabled={loading} className="button button-primary button-glow">
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
          
          <div className="flex justify-center mt-6">
            <Link to="/login" style={{ color: '#3366FF', fontWeight: 700, fontSize: '0.875rem' }}>
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
