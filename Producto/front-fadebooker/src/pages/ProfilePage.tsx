import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api/userService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(['my-profile'], userService.getPerfil, { enabled: !!user });

  const mutation = useMutation(userService.updatePerfil, {
    onSuccess: () => queryClient.invalidateQueries(['my-profile']),
  });

  if (isLoading) return <div className="p-6">Cargando perfil...</div>;

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
      <div className="space-y-3">
        <div><strong>Nombre:</strong> {data?.nombre || user?.nombre}</div>
        <div><strong>Email:</strong> {data?.email || user?.email}</div>
        <div className="mt-4">
          <button onClick={() => mutation.mutate({ nombre: data?.nombre })} className="bg-green-600 text-white px-4 py-2 rounded">Actualizar nombre (demo)</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
