interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-5 h-5 border-2',
        lg: 'w-8 h-8 border-[3px]',
    };

    return (
        <div
            className={`${sizeClasses[size]} border-slate-200 border-t-slate-600 rounded-full animate-spin ${className}`}
        />
    );
};
