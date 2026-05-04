import React from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '@/lib/api/authService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

type FormData = { email: string; password: string };

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { login } = useAuth();

  const onSubmit = async (data: FormData) => {
    try {
      const resp = await authService.login(data.email, data.password);
      // resp expected: { user, token }
      if (resp?.token && resp?.user) {
        login(resp.user, resp.token);
      } else {
        alert('Respuesta inválida del servidor');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error en login');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('email')} placeholder="Correo" className="w-full border p-2 rounded" />
        <input {...register('password')} type="password" placeholder="Contraseña" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;
