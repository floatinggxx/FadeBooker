import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '@/lib/api/authService';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

type FormData = { 
  nombre: string; 
  apellido: string; 
  email: string; 
  telefono: string;
  contrasena: string; 
  contrasenaConfirm: string;
  rol: 'Cliente' | 'Barbero' 
};

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm<FormData>({ 
    defaultValues: { 
      rol: 'Cliente', 
      apellido: '',
      telefono: '+56 9 '
    } 
  });
  
  const navigate = useNavigate();
  const password = watch('contrasena');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Si borra el prefijo, lo mantenemos
    if (!value.startsWith('+56 9 ')) {
      value = '+56 9 ';
    }
    
    // Solo permitimos números después del prefijo y máximo 8 dígitos (formato: XXXX XXXX)
    const prefix = '+56 9 ';
    const rest = value.slice(prefix.length).replace(/\D/g, '').slice(0, 8);
    
    let formattedRest = '';
    if (rest.length > 4) {
      formattedRest = `${rest.slice(0, 4)} ${rest.slice(4)}`;
    } else {
      formattedRest = rest;
    }
    
    setValue('telefono', prefix + formattedRest);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // No enviamos contrasenaConfirm al API
      const { contrasenaConfirm, ...registerData } = data;
      await authService.register(registerData);
      alert('Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.response?.data?.error || 'Error en registro');
    }
  };

  return (
    <section className="page-content container auth-page">
      <div className="auth-card">
        <h1>Crear cuenta</h1>
        <p className="auth-subtitle">Regístrate para ver barberías cercanas, agendar citas y gestionar tu perfil.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="input-container">
            <input 
              {...register('nombre', { 
                required: 'El nombre es obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
              })} 
              placeholder="Nombre" 
              className={`input-field ${errors.nombre ? 'input-error' : ''}`} 
            />
            {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
          </div>

          <div className="input-container">
            <input 
              {...register('apellido', { required: 'El apellido es obligatorio' })} 
              placeholder="Apellido" 
              className={`input-field ${errors.apellido ? 'input-error' : ''}`} 
            />
            {errors.apellido && <span className="error-message">{errors.apellido.message}</span>}
          </div>

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
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="input-container">
            <input 
              {...register('telefono', { 
                required: 'El teléfono es obligatorio',
                minLength: { value: 15, message: 'Formato incompleto: +56 9 XXXX XXXX' }
              })} 
              placeholder="Teléfono (+56 9 XXXX XXXX)" 
              className={`input-field ${errors.telefono ? 'input-error' : ''}`}
              onChange={handlePhoneChange} 
            />
            {errors.telefono && <span className="error-message">{errors.telefono.message}</span>}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <input 
                {...register('contrasena', { 
                  required: 'La contraseña es obligatoria',
                  minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' }
                })} 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Contraseña" 
                className={`input-field ${errors.contrasena ? 'input-error' : ''}`} 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.contrasena && <span className="error-message">{errors.contrasena.message}</span>}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <input 
                {...register('contrasenaConfirm', { 
                  required: 'Confirma tu contraseña',
                  validate: value => value === password || 'Las contraseñas no coinciden'
                })} 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Confirmar contraseña" 
                className={`input-field ${errors.contrasenaConfirm ? 'input-error' : ''}`} 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.contrasenaConfirm && <span className="error-message">{errors.contrasenaConfirm.message}</span>}
          </div>

          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" value="Cliente" {...register('rol')} defaultChecked /> Cliente
            </label>
            <label className="radio-option">
              <input type="radio" value="Barbero" {...register('rol')} /> Barbero
            </label>
          </div>

          <button type="submit" className="button button-primary button-glow">Registrar</button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
