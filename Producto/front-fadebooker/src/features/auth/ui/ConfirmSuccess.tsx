import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const ConfirmSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="page-content container auth-page">
      <div className="auth-card" style={{ maxWidth: 540, margin: '48px auto', padding: 28 }}>
        <h1 style={{ textAlign: 'left' }}>Correo confirmado</h1>
        <p className="auth-subtitle">Tu correo ha sido verificado correctamente. Ya puedes iniciar sesión y disfrutar de FadeBooker.</p>
        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <Button onClick={() => navigate('/login')} variant="primary">Ir a iniciar sesión</Button>
          <Button onClick={() => navigate('/')} variant="secondary">Volver al inicio</Button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmSuccess;
