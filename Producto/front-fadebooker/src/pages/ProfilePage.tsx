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
        fotoUrl: result.fotoUrl
      }));
      
      // Actualizar el contexto de auth para que se vea en el Header/Sidebar
      updateUser({ fotoUrl: result.fotoUrl });
      
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });

  if (isLoading) return <div className="page-content container page-message">Cargando perfil...</div>;

  return (
    <ProfileSection
      name={`${data?.nombre || user?.nombre || 'No registrado'} ${data?.apellido || user?.apellido || ''}`}
      email={data?.email || user?.email || 'No registrado'}
      role={data?.rol || user?.rol || 'Cliente'}
      fotoUrl={data?.fotoUrl || user?.fotoUrl}
      createdAt={data?.createdAt || user?.createdAt || ''}
      onUpdate={() => {
        const nuevoNombre = prompt('Nuevo nombre:', data?.nombre || user?.nombre || '');
        const nuevoApellido = prompt('Nuevo apellido:', data?.apellido || user?.apellido || '');
        const nuevoTelefono = prompt('Nuevo teléfono:', data?.telefono || user?.telefono || '');
        
        if (nuevoNombre || nuevoApellido || nuevoTelefono) {
          mutation.mutate({ 
            nombre: nuevoNombre || data?.nombre, 
            apellido: nuevoApellido || data?.apellido,
            telefono: nuevoTelefono || data?.telefono
          });
        }
      }}
      onUploadPhoto={async (base64) => {
        await photoMutation.mutateAsync(base64);
      }}
    />
  );
};

export default ProfilePage;
