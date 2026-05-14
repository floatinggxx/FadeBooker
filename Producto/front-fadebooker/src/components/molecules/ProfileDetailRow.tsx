import React from 'react';

interface ProfileDetailRowProps {
  label: string;
  value: string;
}

const ProfileDetailRow: React.FC<ProfileDetailRowProps> = ({ label, value }) => (
  <div className="profile-item animate-fade-in-up">
    <strong>{label}</strong>
    <span>{value}</span>
  </div>
);

export default ProfileDetailRow;
