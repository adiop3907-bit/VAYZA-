import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const NotificationToast: React.FC = () => {
  const { notification } = useStore();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  const bgColors = {
    success: 'bg-white/90 border-emerald-300 text-gray-800 shadow-emerald-500/10',
    warning: 'bg-white/90 border-amber-300 text-gray-800 shadow-amber-500/10',
    error: 'bg-white/90 border-rose-300 text-gray-800 shadow-rose-500/10',
    info: 'bg-white/90 border-blue-300 text-gray-800 shadow-blue-500/10',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounceIn shadow-2xl">
      <div className={`p-4 rounded-2xl border backdrop-blur-2xl flex items-start gap-3 shadow-xl ${bgColors[notification.type]}`}>
        {icons[notification.type]}
        <div className="text-xs sm:text-sm font-semibold leading-snug flex-1">
          {notification.message}
        </div>
      </div>
    </div>
  );
};
