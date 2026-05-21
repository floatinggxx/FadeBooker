import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Clock, Phone } from 'lucide-react';

const StudioDangerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <section className="relative overflow-hidden bg-[#0F172A] text-white pt-24 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_35%)]" />
        <div className="container relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.35em] text-sky-300 font-black">
              PREMIUM SHOP
            </span>

            <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              StudioDanger
            </h1>
            <p className="max-w-xl text-lg text-slate-300 leading-relaxed">
              Barbería premium en Quilicura con cortes de diseño, barba premium y atención especializada. Reserva con facilidad y vive una experiencia diseñada para clientes exigentes.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/tienda/101"
                className="inline-flex items-center justify-center rounded-[2rem] bg-sky-500 px-10 py-5 text-lg font-black text-white shadow-2xl shadow-sky-500/20 transition hover:bg-sky-600"
              >
                Ver perfil
              </Link>
              <Link
                to="/barberias"
                className="inline-flex items-center justify-center rounded-[2rem] border border-slate-200 bg-white/90 px-10 py-5 text-lg font-black text-slate-900 shadow-lg transition hover:bg-white"
              >
                Explorar barberías
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 text-sm text-slate-300">
              <div className="rounded-[2rem] bg-white/5 p-5 border border-white/10">
                <span className="block text-xs uppercase tracking-[0.35em] text-slate-400 font-black">Ubicación</span>
                <p className="mt-3 text-base font-semibold text-white">Av. Las Torres 152</p>
                <p className="text-slate-400">Quilicura, Región Metropolitana</p>
              </div>
              <div className="rounded-[2rem] bg-white/5 p-5 border border-white/10">
                <span className="block text-xs uppercase tracking-[0.35em] text-slate-400 font-black">Horario</span>
                <p className="mt-3 text-base font-semibold text-white">Lun - Sáb</p>
                <p className="text-slate-400">09:00 - 19:00</p>
              </div>
              <div className="rounded-[2rem] bg-white/5 p-5 border border-white/10">
                <span className="block text-xs uppercase tracking-[0.35em] text-slate-400 font-black">Contacto</span>
                <p className="mt-3 text-base font-semibold text-white">+56 9 1234 5678</p>
                <p className="text-slate-400">Atención prioritaria</p>
              </div>
            </div>
          </div>

          <div className="rounded-[3rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/15 backdrop-blur-xl">
            <div className="rounded-[2.5rem] overflow-hidden bg-slate-900">
              <div className="relative h-96 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.3),transparent_35%),linear-gradient(180deg,rgba(15,23,42,1),rgba(15,23,42,0.88))]">
                <div className="absolute inset-0 bg-[url('/images/hero-2.svg')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
                <div className="relative z-10 flex h-full flex-col justify-between p-8">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-800/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-200">StudioDanger</span>
                    <div className="rounded-3xl bg-slate-800/70 px-4 py-2 text-sm text-slate-200">4.9 ★</div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white">Cortes premium con diseño.</h2>
                    <p className="max-w-md text-sm leading-relaxed text-slate-300">Servicio personalizado en un entorno elegante, pensado para quienes buscan un corte con identidad y calidad.</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-6 text-slate-200">
                <div className="rounded-[2rem] bg-slate-950/95 p-6 border border-slate-800">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 font-black">Servicios</p>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li>• Corte de diseño</li>
                    <li>• Barba premium</li>
                    <li>• Afeitado clásico</li>
                  </ul>
                </div>
                <div className="rounded-[2rem] bg-slate-950/95 p-6 border border-slate-800">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 font-black">Ambiente</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">Un espacio moderno, cómodo y con atención a cada detalle para tu mejor experiencia.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-16">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-6">
            <span className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Nuestros servicios</span>
            <h2 className="text-4xl font-black text-slate-900">Soluciones de estilo para cada ocasión.</h2>
            <p className="text-lg leading-relaxed text-slate-600">
              En StudioDanger combinamos técnica y creatividad para entregar cortes impecables, barba de diseño y un ambiente confortable. Cada servicio está pensado para que salgas con una apariencia impecable y una experiencia sin complicaciones.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { title: 'Corte de diseño', description: 'Estilo moderno y acabado definido.' },
              { title: 'Barba y contorno', description: 'Perfilado preciso y tratamiento facial.' },
              { title: 'Afeitado clásico', description: 'Tradición y confort con resultado premium.' },
              { title: 'Reserva express', description: 'Disponibilidad rápida para tus horarios ocupados.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mt-20 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="rounded-[3rem] bg-white p-12 shadow-xl shadow-slate-200">
          <span className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Experiencia premium</span>
          <h2 className="mt-4 text-4xl font-black text-slate-900">Cada visita está diseñada para sorprender.</h2>
          <p className="mt-6 text-slate-600 leading-relaxed">
            StudioDanger es más que una barbería: es un espacio sofisticado con barberos expertos, atención personalizada y resultados consistentes. Desde la bienvenida hasta el acabado final, nos enfocamos en tu comodidad y estilo.
          </p>

          <div className="mt-10 grid gap-4">
            {[
              { label: 'Atención personalizada', detail: 'Asesoría en estilo y productos para mantener tu look.' },
              { label: 'Técnica especializada', detail: 'Cortes creados para el contorno facial y tu rutina diaria.' },
              { label: 'Espacio cuidado', detail: 'Ambiente moderno, limpio y cómodo en Quilicura.' },
            ].map((item) => (
              <div key={item.label} className="rounded-[2rem] border border-slate-200 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">{item.label}</p>
                <p className="mt-3 text-slate-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[3rem] border border-slate-200 bg-white p-10 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="rounded-3xl bg-slate-100 p-4 text-slate-900"><MapPin size={24} /></div>
              <div>
                <p className="font-black text-slate-900">Ubicación</p>
                <p className="text-slate-500">Av. Las Torres 152, Quilicura</p>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-4">
              <div className="rounded-3xl bg-slate-100 p-4 text-slate-900"><Clock size={24} /></div>
              <div>
                <p className="font-black text-slate-900">Horario</p>
                <p className="text-slate-500">Lun - Vie 09:00 - 19:00</p>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-4">
              <div className="rounded-3xl bg-slate-100 p-4 text-slate-900"><Phone size={24} /></div>
              <div>
                <p className="font-black text-slate-900">Contacto</p>
                <p className="text-slate-500">+56 9 1234 5678</p>
              </div>
            </div>
          </div>

          <div className="rounded-[3rem] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400 font-black">Accede a la tienda</p>
            <h3 className="mt-4 text-3xl font-black">Reserva tu corte ahora</h3>
            <p className="mt-4 text-slate-300 leading-relaxed">Consulta barberos, servicios y horarios disponibles. Toda la información está lista para reservar en un solo paso.</p>
            <Link
              to="/tienda/101"
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-sky-500 px-8 py-4 text-base font-black text-white uppercase tracking-[0.25em] hover:bg-sky-400 transition-all"
            >
              Ir a la tienda <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudioDangerPage;
