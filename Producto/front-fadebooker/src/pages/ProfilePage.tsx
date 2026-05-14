import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api/userService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import ProfileSection from '@/components/organisms/ProfileSection';

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
    <ProfileSection
      name={data?.nombre || user?.nombre || 'No registrado'}
      email={data?.email || user?.email || 'No registrado'}
      role={data?.rol || user?.rol || 'cliente'}
      createdAt={data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Fecha no disponible'}
      onUpdate={() => mutation.mutate({ nombre: data?.nombre })}
    />
  );
};

export default ProfilePage;
