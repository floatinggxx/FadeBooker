import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api/userService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: userService.getPerfil,
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: userService.updatePerfil,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-profile'] }),
  });

  if (isLoading) return <div className="page-content container page-message">Cargando perfil...</div>;

  return (
    <div className="page-content container">
      <div className="section-heading">
        <h1>Mi Perfil</h1>
        <p>Administra tus datos personales y accede rápidamente a tus próximas citas.</p>
      </div>
      <div className="profile-card card-surface">
        <div className="profile-item">
          <strong>Nombre</strong>
          <span>{data?.nombre || user?.nombre || 'No registrado'}</span>
        </div>
        <div className="profile-item">
          <strong>Email</strong>
          <span>{data?.email || user?.email || 'No registrado'}</span>
        </div>
        <div className="profile-item">
          <strong>Rol</strong>
          <span>{data?.rol || user?.rol || 'cliente'}</span>
        </div>
        <div className="profile-item">
          <strong>Registrado en</strong>
          <span>{data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Fecha no disponible'}</span>
        </div>
        <button onClick={() => mutation.mutate({ nombre: data?.nombre })} className="button button-accent button-glow">Actualizar perfil</button>
      </div>
    </div>
  );
};

export default ProfilePage;
