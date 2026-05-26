import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ChevronLeft } from 'lucide-react';

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'success' | 'failure' | 'pending'>('pending');

  useEffect(() => {
    if (location.pathname.includes('exitoso')) {
      setStatus('success');
    } else if (location.pathname.includes('fallido')) {
      setStatus('failure');
    } else {
      setStatus('pending');
    }
  }, [location.pathname]);

  const config = {
    success: {
      icon: <CheckCircle className="text-green-500 w-20 h-20" />,
      title: '¡Pago Exitoso!',
      message: 'Tu cita ha sido confirmada y el pago procesado correctamente.',
      buttonClass: 'bg-green-500 hover:bg-green-600'
    },
    failure: {
      icon: <XCircle className="text-red-500 w-24 h-24 animate-bounce" />,
      title: '⚠️ Pago No Completado',
      message: 'Parece que hubo un problema o decidiste cancelar el pago. \n\n¡No te preocupes! Tu reserva sigue registrada en estado "Pendiente". Puedes intentarlo más tarde o pagar directamente el día de tu cita.',
      buttonClass: 'bg-red-500 hover:bg-black'
    },
    pending: {
      icon: <Clock className="text-yellow-500 w-20 h-20" />,
      title: 'Pago Pendiente',
      message: 'Estamos procesando tu pago. Te avisaremos cuando se confirme.',
      buttonClass: 'bg-yellow-500 hover:bg-yellow-600'
    }
  };

  const current = config[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-[2.5rem] shadow-xl p-10 max-w-md w-full text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          {current.icon}
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">{current.title}</h1>
        <p className="text-gray-500 font-medium mb-10 leading-relaxed whitespace-pre-line">
          {current.message}
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/bookings')}
            className={`w-full py-4 rounded-2xl text-white font-bold transition-all shadow-lg ${current.buttonClass}`}
          >
            Ver mis citas
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-2xl text-gray-400 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
           <ChevronLeft size={20} /> Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
