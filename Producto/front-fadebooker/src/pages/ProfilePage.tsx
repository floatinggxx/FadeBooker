import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api/userService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import ProfileSection from '@/components/organisms/ProfileSection';

const ProfilePage: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: userService.getPerfil,
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: userService.updatePerfil,
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });

  const photoMutation = useMutation({
    mutationFn: userService.uploadFoto,
    onSuccess: (result) => {
      queryClient.setQueryData(['my-profile'], (old: any) => ({
        ...old,
        fotoUrl: (result as any).fotoUrl
      }));
      
      // Actualizar el contexto de auth para que se vea en el Header/Sidebar
      updateUser({ fotoUrl: (result as any).fotoUrl } as any);
      
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });

  if (isLoading) return <div className="page-content container page-message">Cargando perfil...</div>;

  return (
    <ProfileSection
      name={`${data?.nombre || user?.nombre || 'No registrado'} ${data?.apellido || user?.apellido || ''}`}
      firstName={data?.nombre || user?.nombre || ''}
      lastName={data?.apellido || user?.apellido || ''}
      email={data?.email || user?.email || 'No registrado'}
      phone={data?.telefono || user?.telefono || ''}
      role={data?.rol || user?.rol || 'Cliente'}
      fotoUrl={(data?.fotoUrl as any) || ((user as any)?.fotoUrl as any)}
      createdAt={data?.createdAt || user?.createdAt || ''}
      isUpdating={mutation.isPending}
      onUpdate={async (newData) => {
        await mutation.mutateAsync(newData);
      }}
      onUploadPhoto={async (base64) => {
        await photoMutation.mutateAsync(base64);
      }}
    />
  );
};

export default ProfilePage;
