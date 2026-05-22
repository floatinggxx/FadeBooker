import React, { useRef, useState } from 'react';
import ProfileDetailRow from '../molecules/ProfileDetailRow';
import { Camera, User, Loader2 } from 'lucide-react';

interface ProfileSectionProps {
  name: string;
  email: string;
  role: string;
  createdAt: string;
  fotoUrl?: string;
  onUpdate: () => void;
  onUploadPhoto: (file: string) => Promise<void>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ name, email, role, createdAt, fotoUrl, onUpdate, onUploadPhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await onUploadPhoto(reader.result as string);
      } catch (error: any) {
        console.error('Error al subir foto:', error);
        const detail = error.response?.data?.error || error.message || "";
        alert(`No se pudo subir la foto. ${detail}`);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Usar un placeholder robusto (data URI de un SVG de usuario si el archivo no existe)
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
            <ProfileDetailRow label="Nombre Completo" value={name} />
            <ProfileDetailRow label="Correo Electrónico" value={email} />
            <ProfileDetailRow label="Miembro desde" value={createdAt ? new Date(createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'} />
            <div className="mt-8 pt-8 border-t-2 border-slate-50">
              <button onClick={onUpdate} className="button button-accent button-glow w-full md:w-auto">
                Actualizar Información
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
