import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { promocionService } from '@/lib/api/promocionService';
import { CheckCircle, Globe2, Link as LinkIcon, Briefcase, Trash2, PlusCircle } from 'lucide-react';
import { Promocion } from '@/types';

const initialFormState = {
  empresa: '',
  tipoProducto: '',
  url: '',
  descripcion: '',
};

const validarUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const PromocionesManager: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id_usuario || user?.id;
  const [form, setForm] = useState(initialFormState);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userId) {
      setPromociones(promocionService.listPromociones(userId));
    }
  }, [userId]);

  const formIsValid = useMemo(() => {
    return (
      form.empresa.trim().length >= 3 &&
      form.tipoProducto.trim().length >= 3 &&
      validarUrl(form.url)
    );
  }, [form]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (form.empresa.trim().length < 3) {
      nextErrors.empresa = 'Ingresa el nombre de la empresa o marca.';
    }
    if (form.tipoProducto.trim().length < 3) {
      nextErrors.tipoProducto = 'Describe el tipo de producto o servicio.';
    }
    if (!validarUrl(form.url)) {
      nextErrors.url = 'Ingresa un enlace válido (https://...).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!userId) return;

    const nuevaPromocion = promocionService.addPromocion(userId, {
      empresa: form.empresa.trim(),
      tipoProducto: form.tipoProducto.trim(),
      url: form.url.trim(),
      descripcion: form.descripcion.trim(),
    });

    setPromociones((prev) => [nuevaPromocion, ...prev]);
    setForm(initialFormState);
    setErrors({});
  };

  const handleRemove = (id: string) => {
    if (!userId) return;
    const updated = promocionService.removePromocion(userId, id);
    setPromociones(updated);
  };

  return (
    <section className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-[#3366FF] px-8 py-8 text-white">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div>
              <h1 className="text-4xl font-black">Promociones de Productos</h1>
              <p className="mt-3 max-w-2xl text-slate-100 leading-relaxed">
                Comparte tu empresa, tipo de producto y el enlace a tu página web para que los clientes vean tus promociones.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-white/10 px-5 py-4 text-sm font-bold uppercase tracking-[0.24em]">
              <Briefcase size={20} aria-hidden="true" />
              {user?.rol || 'Usuario'}
            </div>
          </div>
        </div>

        <div className="p-8 grid gap-8 md:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900">Nueva Promoción</h2>
              <p className="text-slate-500 mt-2">Completa el formulario para publicar un anuncio rápido y moderno.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="empresa" className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">Empresa</label>
                <input
                  id="empresa"
                  value={form.empresa}
                  onChange={(event) => handleChange('empresa', event.target.value)}
                  placeholder="Nombre de la empresa o marca"
                  className={`input-field w-full ${errors.empresa ? 'input-error' : ''}`}
                />
                {errors.empresa && <p className="text-rose-500 text-sm">{errors.empresa}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="tipoProducto" className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">Tipo de producto</label>
                <input
                  id="tipoProducto"
                  value={form.tipoProducto}
                  onChange={(event) => handleChange('tipoProducto', event.target.value)}
                  placeholder="Ej. Grooming, Aftershave, Aceite para barba"
                  className={`input-field w-full ${errors.tipoProducto ? 'input-error' : ''}`}
                />
                {errors.tipoProducto && <p className="text-rose-500 text-sm">{errors.tipoProducto}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">Enlace web</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <LinkIcon size={18} aria-hidden="true" />
                  </span>
                  <input
                    id="url"
                    value={form.url}
                    onChange={(event) => handleChange('url', event.target.value)}
                    placeholder="https://www.tuempresa.cl/producto"
                    className={`input-field w-full pl-12 ${errors.url ? 'input-error' : ''}`}
                  />
                </div>
                {errors.url && <p className="text-rose-500 text-sm">{errors.url}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="descripcion" className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">Descripción</label>
                <textarea
                  id="descripcion"
                  value={form.descripcion}
                  onChange={(event) => handleChange('descripcion', event.target.value)}
                  placeholder="Describe brevemente el producto o la oferta (opcional)"
                  rows={4}
                  className="input-field w-full min-h-[120px] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!formIsValid}
                className="button button-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircle size={18} className="inline mr-2" />
                Publicar promoción
              </button>
            </form>
          </div>

          <aside className="rounded-[2.5rem] border border-slate-100 bg-slate-50 p-6">
            <h3 className="text-xl font-black text-slate-900 mb-4">Consejos rápidos</h3>
            <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 text-emerald-500" size={18} aria-hidden="true" />
                Usa títulos claros y directos en tu empresa o producto.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 text-emerald-500" size={18} aria-hidden="true" />
                Incluye un enlace de página web activo para que los clientes lleguen directo.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 text-emerald-500" size={18} aria-hidden="true" />
                Aprovecha la descripción para destacar un beneficio rápido.
              </li>
            </ul>
          </aside>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <p className="text-slate-500 uppercase tracking-[0.24em] text-xs font-black">Promociones activas</p>
            <h2 className="text-3xl font-black text-slate-900">Tus anuncios publicados</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-xl">
            Aquí puedes editar la información de tus promociones y compartirlas directamente con tus clientes.
          </p>
        </div>

        {promociones.length === 0 ? (
          <div className="rounded-[3rem] border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-400 font-bold mb-4">Aún no tienes promociones guardadas.</p>
            <p className="text-slate-500">Crea un anuncio para que tus productos aparezcan aquí.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {promociones.map((promocion) => (
              <article key={promocion.id} className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4 mb-5">
                  <div>
                    <p className="text-slate-400 uppercase tracking-[0.24em] text-xs font-black">{promocion.tipoProducto}</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-2">{promocion.empresa}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(promocion.id)}
                    className="p-3 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                    aria-label={`Eliminar promoción de ${promocion.empresa}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6 min-h-[3rem]">{promocion.descripcion || 'Sin descripción adicional.'}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={promocion.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#3366FF] px-5 py-3 text-sm font-black text-white hover:bg-[#2647c2] transition-colors"
                  >
                    <Globe2 size={16} aria-hidden="true" /> Visitar sitio
                  </a>
                  <span className="text-slate-400 text-xs uppercase tracking-[0.24em] font-black">Publicado {new Date(promocion.creadoEn).toLocaleDateString('es-CL')}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default PromocionesManager;
