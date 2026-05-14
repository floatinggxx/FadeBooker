import React from 'react';
import ProfileDetailRow from '../molecules/ProfileDetailRow';

interface ProfileSectionProps {
  name: string;
  email: string;
  role: string;
  createdAt: string;
  onUpdate: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ name, email, role, createdAt, onUpdate }) => (
  <section className="page-content container animate-fade-in-up">
    <div className="section-heading">
      <h1>Mi Perfil</h1>
      <p>Administra tus datos personales y accede rápidamente a tus próximas citas.</p>
    </div>
    <div className="profile-card card-surface">
      <ProfileDetailRow label="Nombre" value={name} />
      <ProfileDetailRow label="Email" value={email} />
      <ProfileDetailRow label="Rol" value={role} />
      <ProfileDetailRow label="Registrado en" value={createdAt} />
      <button onClick={onUpdate} className="button button-accent button-glow">Actualizar perfil</button>
    </div>
  </section>
);

export default ProfileSection;
