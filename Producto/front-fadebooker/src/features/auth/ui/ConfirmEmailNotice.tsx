import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { authService } from '@/lib/api/authService';
import { useNotification } from '@/context/NotificationContext';

const ConfirmEmailNotice: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      (async () => {
        setLoading(true);
        try {
          const res = await authService.confirmEmail(token);
          if (res && res.status === 'success') {
            showNotification('Correo confirmado. Ya puedes iniciar sesión.', 'success');
            navigate('/confirm-email/success');
            return;
          }
          showNotification(res?.message || 'No fue posible confirmar el correo', 'error');
        } catch (err: any) {
          showNotification(err?.response?.data?.message || err?.message || 'Error al confirmar correo', 'error');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []); // run once on mount

  const handleResend = async () => {
    try {
      await authService.resendConfirmation(email);
      showNotification('Correo de confirmación reenviado', 'success');
    } catch (err: any) {
      showNotification(err?.message || 'Error reenviando correo', 'error');
    }
  };

  return (
    <section className="page-content container auth-page">
      <div className="auth-card" style={{ maxWidth: 540, margin: '48px auto', padding: 28 }}>
        <h1 style={{ textAlign: 'left' }}>Confirma tu correo</h1>
        <p className="auth-subtitle">Hemos enviado un correo de verificación a <strong>{email}</strong>. Sigue el enlace en el correo para activar tu cuenta.</p>
        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <Button onClick={handleResend} variant="primary">Reenviar correo</Button>
          <Button onClick={() => navigate('/login')} variant="secondary">Ir al inicio</Button>
        </div>
        {loading && <p style={{ marginTop: 16 }}>Confirmando correo, espera...</p>}
      </div>
    </section>
  );
};

export default ConfirmEmailNotice;
