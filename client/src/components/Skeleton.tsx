interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => {
    return <div className={`skeleton ${className}`} />;
};

export const TaskSkeleton = () => {
    return (
        <div className="task-item">
            <Skeleton className="w-5 h-5 rounded-md" />
            <Skeleton className="h-5 flex-1" />
        </div>
    );
};

export const StatSkeleton = () => {
    return (
        <div className="stat-card">
            <Skeleton className="w-8 h-8 rounded-lg mb-3" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
};
