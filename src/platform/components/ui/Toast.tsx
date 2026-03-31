import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle2 className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />
    };

    const styles = {
        success: 'border-green-100 bg-green-50',
        error: 'border-red-100 bg-red-50',
        info: 'border-blue-100 bg-blue-50'
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg animate-slideUp pointer-events-auto min-w-[300px] max-w-md ${styles[type]}`}>
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <p className="text-sm font-medium text-slate-800 flex-1">{message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
