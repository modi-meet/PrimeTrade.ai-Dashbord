import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 200);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const Icon = type === 'success' ? CheckCircle2 : XCircle;
    const bgColor = type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200';
    const iconColor = type === 'success' ? 'text-emerald-600' : 'text-rose-600';
    const textColor = type === 'success' ? 'text-emerald-800' : 'text-rose-800';

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
                  transition-all duration-200 ${bgColor} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
        >
            <Icon size={20} className={iconColor} />
            <span className={`text-sm font-medium ${textColor}`}>{message}</span>
            <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600">
                <X size={16} />
            </button>
        </div>
    );
};
