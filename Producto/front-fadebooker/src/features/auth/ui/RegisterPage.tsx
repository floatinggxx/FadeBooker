import React from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '@/lib/api/authService';
import { useNavigate } from 'react-router-dom';

type FormData = { nombre: string; email: string; password: string };

const RegisterPage: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await authService.register(data);
      alert('Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error en registro');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('nombre')} placeholder="Nombre" className="w-full border p-2 rounded" />
        <input {...register('email')} placeholder="Correo" className="w-full border p-2 rounded" />
        <input {...register('password')} type="password" placeholder="Contraseña" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterPage;
