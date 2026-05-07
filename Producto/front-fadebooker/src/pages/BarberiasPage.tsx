import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { barberService } from '@/lib/api/barberService';
import BarberCard from '@/components/BarberCard';

const BarberiasPage: React.FC = () => {
  const { data, isLoading, error } = useQuery(['barbers'], barberService.listBarberos);

  if (isLoading) return <div className="p-10">Cargando barberías...</div>;
  if (error) return <div className="p-10 text-red-600">Error al cargar barberías.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Barberías</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {data && data.length ? data.map((b: any) => (
          <BarberCard key={b.id} barber={b} />
        )) : <p>No se encontraron barberías.</p>}
      </div>
    </div>
  );
};

export default BarberiasPage;
