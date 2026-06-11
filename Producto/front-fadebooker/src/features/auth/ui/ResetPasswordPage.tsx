import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

type FormData = { 
  nuevaContrasena: string; 
  confirmarContrasena: string;
};

const ResetPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const password = watch('nuevaContrasena');

  const onSubmit = async (data: FormData) => {
    if (!token) {
      alert('Token de recuperación faltante');
      return;
    }

    setLoading(true);
    try {
      await api.post('/usuarios/reset-password', { 
        token, 
        nuevaContrasena: data.nuevaContrasena 
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <section className="page-content container auth-page">
        <div className="auth-card">
          <h1>Enlace inválido</h1>
          <p className="auth-subtitle">El enlace de recuperación es inválido o ha expirado.</p>
          <div className="mt-8 text-center">
            <Link to="/forgot-password" title="Solicitar nuevo enlace" className="button button-primary">Solicitar nuevo enlace</Link>
          </div>
        </div>
      </section>
    );
  }

  if (isSuccess) {
    return (
      <section className="page-content container auth-page">
        <div className="auth-card">
          <h1>¡Contraseña actualizada!</h1>
          <p className="auth-subtitle">Tu contraseña ha sido cambiada correctamente. Serás redirigido al inicio de sesión en unos segundos.</p>
          <div className="mt-8 text-center">
            <Link to="/login" className="button button-primary">Ir al inicio de sesión</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-content container auth-page">
      <div className="auth-card">
        <h1>Nueva contraseña</h1>
        <p className="auth-subtitle">Ingresa tu nueva contraseña para acceder a FadeBooker.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form mt-8">
          <div className="input-container">
            <div className="input-wrapper">
              <input 
                {...register('nuevaContrasena', { 
                  required: 'La nueva contraseña es obligatoria',
                  minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                  validate: {
                    hasUpperCase: (value) => /[A-Z]/.test(value) || 'Debe incluir una letra mayúscula',
                    hasNumber: (value) => /\d/.test(value) || 'Debe incluir al menos un número',
                  }
                })} 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Nueva contraseña" 
                className={`input-field ${errors.nuevaContrasena ? 'input-error' : ''}`} 
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
            {errors.nuevaContrasena && <span className="error-message">{errors.nuevaContrasena.message}</span>}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <input 
                {...register('confirmarContrasena', { 
                  required: 'Confirma tu contraseña',
                  validate: value => value === password || 'Las contraseñas no coinciden'
                })} 
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmar contraseña" 
                className={`input-field ${errors.confirmarContrasena ? 'input-error' : ''}`} 
                maxLength={64}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmarContrasena && <span className="error-message">{errors.confirmarContrasena.message}</span>}
          </div>

          <button type="submit" disabled={loading} className="button button-primary button-glow">
            {loading ? 'Actualizando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
