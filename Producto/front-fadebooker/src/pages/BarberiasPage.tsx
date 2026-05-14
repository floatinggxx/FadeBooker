import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { barberService } from '@/lib/api/barberService';
import BarberSearchSection from '@/components/organisms/BarberSearchSection';

const BarberiasPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['barbers'],
    queryFn: barberService.listBarberos,
  });

  const filteredBarbers = useMemo(() => {
    if (!data) return [];
    const lower = search.toLowerCase();
    return data.filter((barber: any) =>
      barber.nombre?.toLowerCase().includes(lower)
      || barber.especialidad?.toLowerCase().includes(lower)
      || barber.email?.toLowerCase().includes(lower)
    );
  }, [data, search]);

  if (isLoading) return <div className="page-content container page-message">Cargando barberías...</div>;
  if (error) return (
    <div className="page-content container page-message">
      <h2>Error al cargar barberías</h2>
      <p>Verifica que el backend esté corriendo y que la base de datos esté conectada. El panel necesita la API de barberías para mostrar los resultados.</p>
      <p className="mt-4 text-sm">{(error as any)?.message || 'Error desconocido en la conexión.'}</p>
    </div>
  );

  return (
    <BarberSearchSection search={search} onSearchChange={setSearch} barbers={filteredBarbers} />
  );
};

export default BarberiasPage;
