import React, { useState } from 'react';
import { X, MessageSquare, Phone, Mail, Calendar, DollarSign, Send } from 'lucide-react';
import { bookingService } from '@/lib/api/bookingService';

interface BarbieroCancelBookingModalProps {
    booking: any;
    onClose: () => void;
    onSuccess: () => void;
}

const BarbieroCancelBookingModal: React.FC<BarbieroCancelBookingModalProps> = ({
    booking,
    onClose,
    onSuccess
}) => {
    const [step, setStep] = useState<'message' | 'action'>('message');
    const [loading, setLoading] = useState(false);
    const [cancelMessage, setCancelMessage] = useState('');
    const [notificationChannel, setNotificationChannel] = useState<'sms' | 'email' | 'both'>('both');
    const [refundAction, setRefundAction] = useState<'refund' | 'reschedule' | 'none'>('none');
    const [rescheduleDate, setRescheduleDate] = useState('');

    const handleCancelBooking = async () => {
        if (!cancelMessage.trim()) {
            alert('Por favor, escribe un mensaje para el cliente');
            return;
        }

        setLoading(true);
        try {
            // Enviar cancelación con mensaje
            await bookingService.cancelarCita(
                booking.id_cita || booking.id,
                cancelMessage,
                booking.id_barbero
            );

            // Enviar notificación al cliente
            const notificationData = {
                id_cita: booking.id_cita || booking.id,
                cliente_telefono: booking.cliente_telefono,
                cliente_email: booking.cliente_email,
                cliente_nombre: booking.cliente_nombre,
                mensaje: cancelMessage,
                canales: notificationChannel === 'both' 
                    ? ['sms', 'email'] 
                    : [notificationChannel === 'sms' ? 'sms' : 'email'],
                tipo: 'cancelacion_barbero'
            };

            // Hacer petición para enviar notificación
            try {
                await fetch('/api/notificaciones/enviar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(notificationData)
                });
            } catch (err) {
                console.warn('Error enviando notificación:', err);
            }

            onSuccess();
        } catch (err: any) {
            console.error('Error cancelando cita:', err);
            alert(`Error: ${err.response?.data?.error || 'No se pudo cancelar la cita'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white">
                {/* Header */}
                <div className="p-8 border-b-4 border-slate-50 flex justify-between items-center bg-gradient-to-r from-slate-50 to-transparent">
                    <h2 className="text-2xl font-black text-slate-900">
                        {step === 'message' ? 'Cancelar Cita' : 'Opciones de Recuperación'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Información de la cita */}
                    <div className="bg-slate-50 rounded-[2rem] p-6 space-y-3">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                            Información de la Cita
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 font-bold">Cliente</p>
                                <p className="text-lg font-black text-slate-900">{booking.cliente_nombre}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold">Servicio</p>
                                <p className="text-lg font-black text-slate-900">{booking.servicio_nombre}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold">Fecha y Hora</p>
                                <p className="text-lg font-black text-slate-900">
                                    {new Date(booking.fecha_hora_inicio).toLocaleDateString('es-CL', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold">Monto</p>
                                <p className="text-lg font-black text-[#3366FF]">${booking.monto_total}</p>
                            </div>
                        </div>
                    </div>

                    {step === 'message' ? (
                        <>
                            {/* Mensaje al cliente */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    Mensaje para el Cliente
                                </label>
                                <div className="relative">
                                    <MessageSquare
                                        className="absolute left-4 top-4 text-[#3366FF]"
                                        size={20}
                                    />
                                    <textarea
                                        value={cancelMessage}
                                        onChange={(e) => setCancelMessage(e.target.value)}
                                        placeholder="Explica al cliente por qué se cancela la cita. Ejemplo: Disculpa, tengo una emergencia y necesito reprogramar tu cita..."
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#3366FF] resize-none"
                                        rows={4}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    {cancelMessage.length}/500 caracteres
                                </p>
                            </div>

                            {/* Canal de notificación */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    Notificar al cliente por
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNotificationChannel('sms')}
                                        className={`py-4 px-4 rounded-2xl font-black text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                                            notificationChannel === 'sms'
                                                ? 'bg-[#3366FF] text-white border-[#3366FF] shadow-lg shadow-blue-100'
                                                : 'bg-white text-slate-600 border-slate-50 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Phone size={16} /> SMS
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNotificationChannel('email')}
                                        className={`py-4 px-4 rounded-2xl font-black text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                                            notificationChannel === 'email'
                                                ? 'bg-[#3366FF] text-white border-[#3366FF] shadow-lg shadow-blue-100'
                                                : 'bg-white text-slate-600 border-slate-50 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Mail size={16} /> Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNotificationChannel('both')}
                                        className={`py-4 px-4 rounded-2xl font-black text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                                            notificationChannel === 'both'
                                                ? 'bg-[#3366FF] text-white border-[#3366FF] shadow-lg shadow-blue-100'
                                                : 'bg-white text-slate-600 border-slate-50 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Send size={16} /> Ambos
                                    </button>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl font-black hover:bg-slate-200 transition-all"
                                >
                                    ATRÁS
                                </button>
                                <button
                                    onClick={() => setStep('action')}
                                    className="flex-1 bg-[#3366FF] text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
                                >
                                    SIGUIENTE
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Opciones de acción */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    Opción de Recuperación
                                </label>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => setRefundAction('refund')}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                                            refundAction === 'refund'
                                                ? 'bg-green-50 border-[#16a34a]'
                                                : 'bg-white border-slate-50 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <DollarSign
                                                size={20}
                                                className={refundAction === 'refund' ? 'text-[#16a34a]' : 'text-slate-400'}
                                            />
                                            <div>
                                                <p className="font-black text-slate-900">Devolver Dinero</p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Reembolsar el 100% del monto pagado (${booking.monto_total})
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRefundAction('reschedule')}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                                            refundAction === 'reschedule'
                                                ? 'bg-blue-50 border-[#3366FF]'
                                                : 'bg-white border-slate-50 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Calendar
                                                size={20}
                                                className={refundAction === 'reschedule' ? 'text-[#3366FF]' : 'text-slate-400'}
                                            />
                                            <div>
                                                <p className="font-black text-slate-900">Reagendar</p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Agendar la cita en una nueva fecha sin costo adicional
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRefundAction('none')}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                                            refundAction === 'none'
                                                ? 'bg-slate-100 border-slate-400'
                                                : 'bg-white border-slate-50 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <X
                                                size={20}
                                                className={refundAction === 'none' ? 'text-slate-900' : 'text-slate-400'}
                                            />
                                            <div>
                                                <p className="font-black text-slate-900">Solo Cancelar</p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Cancelar sin devolver dinero ni reagendar
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Botones finales */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setStep('message')}
                                    className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl font-black hover:bg-slate-200 transition-all"
                                >
                                    ATRÁS
                                </button>
                                <button
                                    onClick={handleCancelBooking}
                                    disabled={loading}
                                    className="flex-1 bg-rose-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-rose-100 hover:bg-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'PROCESANDO...' : 'CANCELAR CITA'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BarbieroCancelBookingModal;
