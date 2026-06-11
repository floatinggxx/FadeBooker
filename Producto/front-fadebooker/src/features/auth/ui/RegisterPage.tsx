import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '@/lib/api/authService';
import { tiendaService } from '@/lib/api/tiendaService';
import { serviceService } from '@/lib/api/serviceService';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Scissors, Store, Briefcase, Plus, AlertCircle, Info, Clock, Check } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { parseError } from '@/lib/utils/errorParser';
import { Tienda, Servicio } from '@/types';

type FormData = { 
  nombre: string; 
  apellido: string; 
  email: string; 
  telefono: string;
  contrasena: string; 
  contrasenaConfirm: string;
  rol: 'Cliente' | 'Barbero' | 'Dueño' | 'Proveedor';
  especialidad?: string;
  id_tienda?: number;
  servicios?: number[];
  tienda_nueva?: {
    nombre_tienda: string;
    direccion: string;
    ciudad: string;
  };
  acceptTerms?: boolean;
};

const ESPECIALIDADES_SUGERIDAS = [
  'Degradados (Fade)',
  'Corte Clásico',
  'Barba y Afeitado',
  'Corte a Tijera',
  'Hair Tattoo / Diseño',
  'Colorimetría',
  'Tratamientos Capilares'
];

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState<Servicio[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isRegisteringTienda, setIsRegisteringTienda] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm<FormData>({ 
    defaultValues: { 
      rol: 'Cliente', 
      apellido: '',
      telefono: '+56 9 ',
      servicios: []
    } 
  });
  
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const password = watch('contrasena');
  const rol = watch('rol');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiendasData, serviciosData] = await Promise.all([
          tiendaService.listTiendas(),
          serviceService.listServicios()
        ]);
        setTiendas(tiendasData);
        setServiciosDisponibles(serviciosData);
      } catch (error) {
        console.error('Error fetching data for registration:', error);
      }
    };
    fetchData();
  }, []);

  const handleServiceToggle = (id: number) => {
    setSelectedServices(prev => {
      const updated = prev.includes(id) 
        ? prev.filter(s => s !== id) 
        : [...prev, id];
      setValue('servicios', updated);
      return updated;
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Si borra el prefijo, lo mantenemos
    if (!value.startsWith('+56 9 ')) {
      value = '+56 9 ';
    }
    
    // Solo permitimos números después del prefijo y máximo 8 dígitos (formato: XXXX XXXX)
    const prefix = '+56 9 ';
    const rest = value.slice(prefix.length).replace(/\D/g, '').slice(0, 8);
    
    let formattedRest = '';
    if (rest.length > 4) {
      formattedRest = `${rest.slice(0, 4)} ${rest.slice(4)}`;
    } else {
      formattedRest = rest;
    }
    
    setValue('telefono', prefix + formattedRest);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Limpieza de datos antes de enviar (excluimos contrasenaConfirm)
      const { contrasenaConfirm, ...prepData } = data;
      const registerData: any = { ...prepData };
      
      // Asegurar tipos numéricos para el backend
      if (registerData.id_tienda) {
        registerData.id_tienda = Number(registerData.id_tienda);
      }
      
      if (registerData.anos_experiencia !== undefined && registerData.anos_experiencia !== '') {
        registerData.anos_experiencia = Number(registerData.anos_experiencia);
      } else {
        delete registerData.anos_experiencia;
      }

      // Si el rol es Barbero o si está registrando una tienda
      if (data.rol === 'Barbero' || isRegisteringTienda) {
        registerData.servicios = selectedServices;
        if (isRegisteringTienda) {
          registerData.rol = 'Dueño';
        }
      } else {
        delete registerData.especialidad;
        delete registerData.id_tienda;
        delete registerData.servicios;
        delete registerData.tienda_nueva;
        delete registerData.anos_experiencia;
      }

      await authService.register(registerData);
      showNotification('Registro exitoso. ¡Bienvenido a FadeBooker!', 'success');
      navigate('/login');
    } catch (err: any) {
      showNotification(parseError(err), 'error');
    }
  };

  return (
    <section className="page-content container auth-page">
      <div className="auth-card">
        <h1>Crear cuenta</h1>
        <p className="auth-subtitle">Regístrate para ver barberías cercanas, agendar citas y gestionar tu perfil.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {/* ... existing fields ... */}
          <div className="input-container">
            <input 
              {...register('nombre', { 
                required: 'El nombre es obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
              })} 
              placeholder="Nombre" 
              className={`input-field ${errors.nombre ? 'input-error' : ''}`} 
              maxLength={50}
            />
            {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
          </div>

          <div className="input-container">
            <input 
              {...register('apellido', { required: 'El apellido es obligatorio' })} 
              placeholder="Apellido" 
              className={`input-field ${errors.apellido ? 'input-error' : ''}`} 
              maxLength={50}
            />
            {errors.apellido && <span className="error-message">{errors.apellido.message}</span>}
          </div>

          <div className="input-container">
            <input 
              {...register('email', { 
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido'
                }
              })} 
              placeholder="Correo electrónico" 
              className={`input-field ${errors.email ? 'input-error' : ''}`} 
              maxLength={100}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="input-container">
            <input 
              {...register('telefono', { 
                required: 'El teléfono es obligatorio',
                minLength: { value: 15, message: 'Formato incompleto: +56 9 XXXX XXXX' }
              })} 
              placeholder="Teléfono (+56 9 XXXX XXXX)" 
              className={`input-field ${errors.telefono ? 'input-error' : ''}`}
              onChange={handlePhoneChange}
              maxLength={15}
            />
            {errors.telefono && <span className="error-message">{errors.telefono.message}</span>}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <input 
                {...register('contrasena', { 
                  required: 'La contraseña es obligatoria',
                  minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' }
                })} 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Contraseña" 
                className={`input-field ${errors.contrasena ? 'input-error' : ''}`} 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.contrasena && <span className="error-message">{errors.contrasena.message}</span>}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <input 
                {...register('contrasenaConfirm', { 
                  required: 'Confirma tu contraseña',
                  validate: value => value === password || 'Las contraseñas no coinciden'
                })} 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Confirmar contraseña" 
                className={`input-field ${errors.contrasenaConfirm ? 'input-error' : ''}`} 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.contrasenaConfirm && <span className="error-message">{errors.contrasenaConfirm.message}</span>}
          </div>

          <div className="animate-fade-in py-5 px-6 bg-amber-50/60 rounded-[2rem] border-2 border-amber-100 my-4 flex gap-4">
            <div className="text-3xl shrink-0">💈</div>
            <div>
              <p className="font-black text-slate-900 text-sm leading-tight mb-1">¿Eres dueño de una barbería?</p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">Regístrate como Barbero. Luego podrás registrar y administrar tu barbería.</p>
            </div>
          </div>

          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" value="Cliente" {...register('rol')} defaultChecked /> Cliente
            </label>
            <label className="radio-option">
              <input type="radio" value="Barbero" {...register('rol')} /> Dueño de barbería
            </label>
            <label className="radio-option">
              <input type="radio" value="Proveedor" {...register('rol')} /> Proveedor
            </label>
          </div>

          {rol === 'Proveedor' && (
            <div className="provider-extra-fields animate-fade-in py-6 px-4 bg-blue-50/50 rounded-[2.5rem] border-2 border-blue-100/50 my-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 leading-tight">Perfil de Proveedor</h3>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Insumos y Productos</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/60 p-4 rounded-2xl border border-white">
                  <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Al registrarte como <span className="text-blue-600 font-bold">Proveedor</span>, podrás publicar promociones de tus insumos, máquinas y productos directamente para los profesionales de la barbería.
                  </p>
                </div>
                
                <div className="bg-white/40 p-4 rounded-2xl">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Incluye acceso a:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Check size={14} className="text-green-500" /> Panel de Insumos
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Check size={14} className="text-green-500" /> Gestión de Ofertas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {rol === 'Barbero' && (
            <div className="barber-extra-fields animate-fade-in">
              <div className="section-divider">
                <span>Información Profesional</span>
              </div>
              
              <div className="input-container">
                <div className="input-with-icon">
                  <Briefcase size={18} className="input-icon" />
                  <input 
                    {...register('especialidad', { 
                      required: rol === 'Barbero' ? 'La especialidad es obligatoria' : false 
                    })} 
                    placeholder="Especialidad (ej. Degradados, Barba, Tijera)" 
                    className={`input-field ${errors.especialidad ? 'input-error' : ''}`} 
                    list="specialties-list"
                    maxLength={100}
                  />
                  <datalist id="specialties-list">
                    {ESPECIALIDADES_SUGERIDAS.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>
                {errors.especialidad && <span className="error-message">{errors.especialidad.message}</span>}
              </div>

              <div className="input-container">
                <div className="input-with-icon">
                  <Clock size={18} className="input-icon" />
                  <input 
                    type="number"
                    {...register('anos_experiencia', { valueAsNumber: true })} 
                    placeholder="Años de experiencia" 
                    className="input-field" 
                  />
                </div>
              </div>

              {!isRegisteringTienda ? (
                <div className="input-container">
                  <div className="input-with-icon">
                    <Store size={18} className="input-icon" />
                    <select 
                      {...register('id_tienda', { 
                        required: rol === 'Barbero' && !isRegisteringTienda ? 'Debes seleccionar una barbería' : false 
                      })}
                      className={`input-field ${errors.id_tienda ? 'input-error' : ''}`}
                    >
                      <option value="">Selecciona tu Barbería</option>
                      {tiendas.map(tienda => (
                        <option key={tienda.id_tienda} value={tienda.id_tienda}>
                          {tienda.nombre_tienda} - {tienda.ciudad}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.id_tienda && <span className="error-message">{errors.id_tienda.message}</span>}
                  
                  <button 
                    type="button" 
                    className="link-alt text-sm mt-2 flex items-center gap-1"
                    onClick={() => {
                      setIsRegisteringTienda(true);
                      setValue('id_tienda', undefined);
                    }}
                  >
                    <Plus size={14} /> ¿No aparece tu barbería? Inscríbela aquí
                  </button>
                </div>
              ) : (
                <div className="new-tienda-fields animate-fade-in">
                  <div className="info-alert mb-4">
                    <Info size={20} className="text-blue-500" />
                    <p className="text-sm">
                      Al inscribir tu barbería, quedarás registrado como <strong>Dueño y Administrador</strong>. 
                      Podrás personalizar tu perfil, galería y servicios más tarde.
                    </p>
                  </div>

                  <div className="input-container mb-3">
                    <input 
                      {...register('tienda_nueva.nombre_tienda', { required: isRegisteringTienda ? 'El nombre de la tienda es obligatorio' : false })} 
                      placeholder="Nombre de tu Barbería" 
                      className="input-field" 
                      maxLength={100}
                    />
                  </div>
                  <div className="input-container mb-3">
                    <input 
                      {...register('tienda_nueva.direccion', { required: isRegisteringTienda ? 'La dirección es obligatoria' : false })} 
                      placeholder="Dirección" 
                      className="input-field" 
                      maxLength={150}
                    />
                  </div>
                  <div className="input-container mb-3">
                    <input 
                      {...register('tienda_nueva.ciudad', { required: isRegisteringTienda ? 'La ciudad es obligatoria' : false })} 
                      placeholder="Ciudad" 
                      className="input-field" 
                    />
                  </div>

                  <button 
                    type="button" 
                    className="link-alt text-sm flex items-center gap-1"
                    onClick={() => {
                      setIsRegisteringTienda(false);
                      setValue('tienda_nueva', undefined);
                    }}
                  >
                    Volver a la lista de barberías
                  </button>
                </div>
              )}

              <div className="services-selection">
                <label className="label-text">
                  <Scissors size={20} className="inline mr-2 text-[#e63946]" />
                  Servicios que ofreces:
                </label>
                <p className="text-[11px] text-slate-400 font-bold mb-4 uppercase tracking-wider ml-1">Selecciona todos los que apliquen</p>
                
                <div className="services-list">
                  {serviciosDisponibles.map(servicio => {
                    const isActive = selectedServices.includes(Number(servicio.id_servicio));
                    return (
                      <label 
                        key={servicio.id_servicio} 
                        className={`service-checkbox-item ${isActive ? 'active' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => handleServiceToggle(Number(servicio.id_servicio))}
                        />
                        <div className="flex flex-col">
                          <span className="service-name">{servicio.nombre_servicio || servicio.nombre}</span>
                          {servicio.descripcion && <span className="service-desc">{servicio.descripcion}</span>}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {(rol === 'Barbero' || isRegisteringTienda) && selectedServices.length === 0 && (
                  <div className="flex items-center gap-2 mt-3 text-rose-500 font-bold text-xs animate-shake">
                    <AlertCircle size={14} />
                    <span>Debes seleccionar al menos un servicio</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="button button-primary button-glow"
            disabled={((rol === 'Barbero' || isRegisteringTienda) && selectedServices.length === 0)}
          >
            {isRegisteringTienda ? 'Registrar Tienda y Usuario' : 'Registrar'}
          </button>

          <div className="mt-4 text-sm">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                {...register('acceptTerms', { required: 'Debes aceptar los Términos y Condiciones' })}
                className="mt-1"
              />
              <span>
                He leído y acepto los <Link to="/terms-and-privacy" style={{ color: '#3366FF', fontWeight: 700 }}>Términos y Condiciones / Política de Privacidad</Link>
              </span>
            </label>
            {errors.acceptTerms && <span className="error-message">{errors.acceptTerms.message}</span>}
          </div>

          <div className="flex justify-center items-center gap-1 mt-6 text-sm">
            <span className="text-slate-500">¿Ya tienes cuenta?</span>
            <Link to="/login" style={{ color: '#3366FF', fontWeight: 700 }}>Inicia sesión</Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
