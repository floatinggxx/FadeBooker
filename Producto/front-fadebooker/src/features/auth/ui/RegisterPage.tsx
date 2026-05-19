import React from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '@/lib/api/authService';
import { useNavigate } from 'react-router-dom';

type FormData = { nombre: string; apellido: string; email: string; contrasena: string; rol: 'Cliente' | 'Barbero' };

const RegisterPage: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { rol: 'Cliente', apellido: '' } });
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await authService.register(data);
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
        <p className="auth-subtitle">Regístrate como cliente para ver barberías cercanas, agendar citas y gestionar tu perfil.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <input {...register('nombre', { required: true })} placeholder="Nombre" className="input-field" />
          <input {...register('apellido', { required: true })} placeholder="Apellido" className="input-field" />
          <input {...register('email', { required: true })} placeholder="Correo electrónico" className="input-field" />
          <input {...register('contrasena', { required: true, minLength: 6 })} type="password" placeholder="Contraseña" className="input-field" />
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
