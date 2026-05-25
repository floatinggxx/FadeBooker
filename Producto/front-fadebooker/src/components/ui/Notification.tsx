import React from 'react';
import { useNotification } from '@/context/NotificationContext';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 max-w-md w-full sm:w-96">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={clsx(
            "flex items-start p-4 rounded-xl shadow-lg border animate-in slide-in-from-right-full duration-300",
            {
              "bg-white border-green-100 text-green-800": n.type === 'success',
              "bg-white border-red-100 text-red-800": n.type === 'error',
              "bg-white border-blue-100 text-blue-800": n.type === 'info',
              "bg-white border-amber-100 text-amber-800": n.type === 'warning',
            }
          )}
        >
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {n.type === 'success' && <CheckCircle className="text-green-500" size={20} />}
            {n.type === 'error' && <XCircle className="text-red-500" size={20} />}
            {n.type === 'info' && <Info className="text-blue-500" size={20} />}
            {n.type === 'warning' && <AlertCircle className="text-amber-500" size={20} />}
          </div>
          <div className="flex-1 text-sm font-medium">
            {n.message}
          </div>
          <button
            onClick={() => removeNotification(n.id)}
            className="flex-shrink-0 ml-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
