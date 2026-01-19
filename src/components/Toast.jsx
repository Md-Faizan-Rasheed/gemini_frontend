import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'from-green-500 to-emerald-500',
      icon: CheckCircle,
      border: 'border-green-200',
      text: 'text-green-900'
    },
    error: {
      bg: 'from-red-500 to-rose-500',
      icon: AlertCircle,
      border: 'border-red-200',
      text: 'text-red-900'
    },
    warning: {
      bg: 'from-yellow-500 to-amber-500',
      icon: AlertTriangle,
      border: 'border-yellow-200',
      text: 'text-yellow-900'
    },
    info: {
      bg: 'from-blue-500 to-cyan-500',
      icon: Info,
      border: 'border-blue-200',
      text: 'text-blue-900'
    }
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
      <div className={`bg-white rounded-2xl shadow-2xl border-2 ${config.border} overflow-hidden min-w-[320px] max-w-md`}>
        <div className={`h-1.5 bg-gradient-to-r ${config.bg}`} />
        <div className="p-4 flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 pt-1">
            <p className={`font-medium ${config.text} leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;