import { ListFilter, Circle, CheckCircle2 } from 'lucide-react';
import { StatSkeleton } from './Skeleton';

interface StatsProps {
    total: number;
    active: number;
    completed: number;
    loading: boolean;
}

export const Stats = ({ total, active, completed, loading }: StatsProps) => {
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (loading) {
        return (
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="stat-card fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <ListFilter size={16} className="text-slate-600 sm:hidden" />
                        <ListFilter size={20} className="text-slate-600 hidden sm:block" />
                    </div>
                    {total > 0 && (
                        <span className="text-[10px] sm:text-xs font-medium text-slate-400">{completionPercentage}%</span>
                    )}
                </div>
                <p className="text-xl sm:text-3xl font-bold text-slate-900">{total}</p>
                <p className="text-xs sm:text-sm text-slate-500">Total</p>
            </div>

            <div className="stat-card fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Circle size={16} className="text-amber-600 sm:hidden" />
                        <Circle size={20} className="text-amber-600 hidden sm:block" />
                    </div>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-slate-900">{active}</p>
                <p className="text-xs sm:text-sm text-slate-500">Active</p>
            </div>

            <div className="stat-card fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-emerald-600 sm:hidden" />
                        <CheckCircle2 size={20} className="text-emerald-600 hidden sm:block" />
                    </div>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-slate-900">{completed}</p>
                <p className="text-xs sm:text-sm text-slate-500">Done</p>
            </div>
        </div>
    );
};
