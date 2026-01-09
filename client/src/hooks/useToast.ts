import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error';

interface Toast {
    message: string;
    type: ToastType;
}

export const useToast = () => {
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return {
        toast,
        showToast,
        hideToast,
    };
};
