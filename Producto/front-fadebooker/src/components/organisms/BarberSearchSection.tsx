import React from 'react';
import BarberCard from '../ui/BarberCard';
import SearchInput from '../molecules/SearchInput';

interface BarberSearchSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  barbers: any[];
}

const BarberSearchSection: React.FC<BarberSearchSectionProps> = ({ search, onSearchChange, barbers }) => (
  <section className="page-content container animate-fade-in-up">
    <div className="section-heading">
      <h1>Barberías cercanas</h1>
      <p>Busca por nombre, especialidad o barbería y accede a tu corte ideal.</p>
    </div>
    <div className="card-surface mb-6">
      <SearchInput value={search} onChange={onSearchChange} placeholder="Buscar barbería, especialidad o correo" />
    </div>
    {barbers.length ? (
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        {barbers.map((barber) => (
          <BarberCard key={barber.id} barber={barber} />
        ))}
      </div>
    ) : (
      <div className="card-surface page-message">No se encontraron barberías con ese término. Prueba otro filtro.</div>
    )}
  </section>
);

export default BarberSearchSection;
