import React, { useRef, useState, useEffect } from 'react';
import ProfileDetailRow from '../molecules/ProfileDetailRow';
import { Camera, User, Loader2, Save, X, Phone, Mail, UserIcon } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

interface ProfileSectionProps {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  fotoUrl?: string;
  isUpdating?: boolean;
  onUpdate: (data: { nombre: string; apellido: string; telefono: string }) => Promise<void>;
  onUploadPhoto: (file: string) => Promise<void>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  name, 
  firstName, 
  lastName, 
  email, 
  phone, 
  role, 
  createdAt, 
  fotoUrl, 
  isUpdating: isUpdatingExternal,
  onUpdate, 
  onUploadPhoto 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nombre: firstName,
    apellido: lastName,
    telefono: phone
  });
  const { showNotification } = useNotification();

  useEffect(() => {
    setEditData({
      nombre: firstName,
      apellido: lastName,
      telefono: phone
    });
  }, [firstName, lastName, phone]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Por favor selecciona una imagen válida.', 'warning');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await onUploadPhoto(reader.result as string);
        showNotification('Foto de perfil actualizada correctamente.', 'success');
      } catch (error: any) {
        console.error('Error al subir foto:', error);
        const detail = error.response?.data?.error || error.message || "";
        showNotification(`No se pudo subir la foto. ${detail}`, 'error');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(editData);
      setIsEditing(false);
      showNotification('Información actualizada correctamente.', 'success');
    } catch (error: any) {
      showNotification(error.response?.data?.error || 'Error al actualizar información', 'error');
    }
  };

  const placeholderImg = "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=random&size=256";

  return (
    <section className="page-content container animate-fade-in-up">
      <div className="section-heading">
        <h1>Mi Perfil</h1>
        <p>Administra tus datos personales y accede rápidamente a tus próximas citas.</p>
      </div>
      
      <div className="profile-layout grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="profile-sidebar col-span-1">
          <div className="card-surface p-8 flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-slate-50 shadow-xl relative bg-slate-100">
                {fotoUrl ? (
                  <img 
                    key={fotoUrl}
                    src={fotoUrl} 
                    alt={name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = placeholderImg;
                    }}
                  />
                ) : (
                  <img src={placeholderImg} alt="Sin foto" className="w-full h-full object-cover opacity-50" />
                )}
                
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="text-white animate-spin" size={48} />
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-2 right-2 p-4 bg-[#3366FF] text-white rounded-full shadow-lg hover:bg-blue-700 transition-all group-hover:scale-110 active:scale-95"
                title="Cambiar foto de perfil"
              >
                <Camera size={24} />
              </button>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900">{name}</h2>
            <span className="px-4 py-1 bg-blue-100 text-[#3366FF] rounded-full text-xs font-black uppercase tracking-widest mt-2">
              {role}
            </span>
          </div>
        </div>

        <div className="profile-details col-span-2">
          <div className="profile-card card-surface h-full">
            {!isEditing ? (
              <>
                <ProfileDetailRow label="Nombre Completo" value={name} />
                <ProfileDetailRow label="Correo Electrónico" value={email} />
                <ProfileDetailRow label="Teléfono" value={phone || 'No especificado'} />
                <ProfileDetailRow label="Miembro desde" value={createdAt ? new Date(createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'} />
                
                <div className="mt-8 pt-8 border-t-2 border-slate-50">
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="button button-accent button-glow w-full md:w-auto"
                  >
                    Actualizar Información
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <UserIcon size={16} /> Nombre
                    </label>
                    <input
                      type="text"
                      value={editData.nombre}
                      onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                      className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-[#3366FF] outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <UserIcon size={16} /> Apellido
                    </label>
                    <input
                      type="text"
                      value={editData.apellido}
                      onChange={(e) => setEditData({ ...editData, apellido: e.target.value })}
                      className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-[#3366FF] outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Phone size={16} /> Teléfono
                  </label>
                  <input
                    type="tel"
                    value={editData.telefono}
                    onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                    placeholder="+56 9 ..."
                    className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-[#3366FF] outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isUpdatingExternal}
                    className="button button-primary flex items-center justify-center gap-2 flex-1"
                  >
                    {isUpdatingExternal ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Guardar Cambios
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({ nombre: firstName, apellido: lastName, telefono: phone });
                    }}
                    className="button button-secondary flex items-center justify-center gap-2 flex-1"
                  >
                    <X size={20} />
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
