import React from 'react';
import { useNotification } from '@/context/NotificationContext';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 max-w-md w-full sm:w-[400px]">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={clsx(
            "group relative flex items-center p-5 rounded-[2rem] shadow-2xl backdrop-blur-md border-4 transition-all animate-appearance",
            {
              "bg-white/90 border-green-500 text-slate-900": n.type === 'success',
              "bg-white/90 border-rose-500 text-slate-900": n.type === 'error',
              "bg-white/90 border-[#3366FF] text-slate-900": n.type === 'info',
              "bg-white/90 border-amber-500 text-slate-900": n.type === 'warning',
            }
          )}
        >
          <div className={clsx(
            "flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg",
            {
              "bg-green-100 text-green-600": n.type === 'success',
              "bg-rose-100 text-rose-600": n.type === 'error',
              "bg-blue-100 text-[#3366FF]": n.type === 'info',
              "bg-amber-100 text-amber-600": n.type === 'warning',
            }
          )}>
            {n.type === 'success' && <CheckCircle2 size={24} />}
            {n.type === 'error' && <XCircle size={24} />}
            {n.type === 'info' && <Info size={24} />}
            {n.type === 'warning' && <AlertCircle size={24} />}
          </div>
          
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-1">
              {n.type === 'success' ? 'Éxito' : n.type === 'error' ? 'Error' : 'Notificación'}
            </p>
            <p className="text-sm font-black leading-tight">
              {n.message}
            </p>
          </div>

          <button
            onClick={() => removeNotification(n.id)}
            className="flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100"
          >
            <X size={16} />
          </button>
          
          {/* Progress bar indication */}
          <div className={clsx(
            "absolute bottom-0 left-6 right-6 h-1 rounded-full overflow-hidden bg-slate-100/50",
          )}>
            <div className={clsx(
              "h-full animate-[progress_5s_linear]",
              {
                "bg-green-500": n.type === 'success',
                "bg-rose-500": n.type === 'error',
                "bg-blue-500": n.type === 'info',
                "bg-amber-500": n.type === 'warning',
              }
            )} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
