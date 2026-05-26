import React, { useState } from 'react';
import StepCard from '../molecules/StepCard';
import { clsx } from 'clsx';
import { User, Store } from 'lucide-react';

const clientSteps = [
  { step: '1', title: 'Regístrate e inicia sesión', description: 'Crea tu usuario con correo y contraseña, luego accede a todo el contenido exclusivo.' },
  { step: '2', title: 'Explora barberías', description: 'Busca por nombre, especialidad o barrio y conoce la valoración de cada lugar.' },
  { step: '3', title: 'Agenda tu cita', description: 'Elige el barbero, selecciona la fecha y confirma tu reserva con un solo clic.' }
];

const barberSteps = [
  { step: '1', title: 'Registra tu tienda', description: 'Crea tu perfil profesional y sube fotos de tu local para atraer a nuevos clientes.' },
  { step: '2', title: 'Personaliza servicios y costos', description: 'Define los cortes que ofreces, sus tiempos y precios de manera independiente.' },
  { step: '3', title: 'Recibe clientes', description: 'Empieza a recibir reservas a través de la aplicación y gestiona tu agenda digital.' }
];

const HowItWorksSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cliente' | 'barbero'>('cliente');

  return (
    <section className="container animate-fade-in-up py-10">
      <div className="section-heading text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 mb-4">¿Cómo funciona?</h2>
        <p className="text-slate-500 font-bold max-w-2xl mx-auto">Una experiencia diseñada para conectar a los mejores profesionales con clientes que valoran el estilo.</p>
      </div>

      <div className="flex justify-center mb-16 px-4">
        <div className="inline-flex bg-slate-100 p-2 rounded-[2.5rem] shadow-inner">
          <button
            onClick={() => setActiveTab('cliente')}
            className={clsx(
              "flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all",
              activeTab === 'cliente' ? "bg-white text-[#3366FF] shadow-xl" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <User size={20} />
            Soy Cliente
          </button>
          <button
            onClick={() => setActiveTab('barbero')}
            className={clsx(
              "flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all",
              activeTab === 'barbero' ? "bg-white text-rose-500 shadow-xl" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Store size={20} />
            Soy Barbero/Dueño
          </button>
        </div>
      </div>

      <div className="step-grid mb-8 min-h-[300px]">
        {(activeTab === 'cliente' ? clientSteps : barberSteps).map((item) => (
          <StepCard 
            key={item.step} 
            step={item.step} 
            title={item.title} 
            description={item.description} 
          />
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
