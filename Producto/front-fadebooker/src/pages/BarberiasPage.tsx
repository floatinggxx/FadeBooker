import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { barberService } from '@/lib/api/barberService';
import BarberCard from '@/components/ui/BarberCard';

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
    <div className="page-content container">
      <div className="section-heading">
        <h1>Barberías cercanas</h1>
        <p>Busca por nombre, especialidad o barbería y accede a tu corte ideal.</p>
      </div>

      <div className="card-surface mb-6">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar barbería, especialidad o correo"
          className="input-field"
        />
      </div>

      {filteredBarbers.length ? (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          {filteredBarbers.map((barber: any) => (
            <BarberCard key={barber.id} barber={barber} />
          ))}
        </div>
      ) : (
        <div className="card-surface page-message">No se encontraron barberías con ese término. Prueba otro filtro.</div>
      )}
    </div>
  );
};

export default BarberiasPage;
