import { Check, Trash2, Search, Inbox } from 'lucide-react';
import type { ITask } from '../types';
import { EmptyState } from './EmptyState';
import { TaskSkeleton } from './Skeleton';

interface TaskListProps {
    tasks: ITask[];
    loading: boolean;
    searchQuery: string;
    filterStatus: 'all' | 'active' | 'completed';
    onToggle: (task: ITask) => void;
    onDelete: (id: string) => void;
}

export const TaskList = ({
    tasks,
    loading,
    searchQuery,
    filterStatus,
    onToggle,
    onDelete
}: TaskListProps) => {
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterStatus === 'all' ||
            (filterStatus === 'active' && !task.isCompleted) ||
            (filterStatus === 'completed' && task.isCompleted);
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="card overflow-hidden">
                <TaskSkeleton />
                <TaskSkeleton />
                <TaskSkeleton />
            </div>
        );
    }

    if (filteredTasks.length === 0) {
        return (
            <div className="card overflow-hidden">
                <EmptyState
                    icon={searchQuery || filterStatus !== 'all' ? Search : Inbox}
                    title={searchQuery || filterStatus !== 'all' ? 'No matching tasks' : 'No tasks yet'}
                    description={
                        searchQuery || filterStatus !== 'all'
                            ? 'Try adjusting your search or filter.'
                            : 'Create your first task to get started.'
                    }
                />
            </div>
        );
    }

    return (
        <div className="card overflow-hidden fade-in" style={{ animationDelay: '0.6s' }}>
            <ul>
                {filteredTasks.map((task, index) => (
                    <li
                        key={task._id}
                        className="task-item group slide-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <button
                            onClick={() => onToggle(task)}
                            className={`checkbox ${task.isCompleted ? 'checkbox-checked' : 'checkbox-unchecked'}`}
                            aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                            {task.isCompleted && <Check size={12} strokeWidth={3} />}
                        </button>
                        <div className="flex-1 min-w-0">
                            <span
                                className={`block text-sm sm:text-[15px] truncate ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                                    }`}
                            >
                                {task.title}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {task.isCompleted && (
                                <span className="badge-success hidden sm:inline-flex">Done</span>
                            )}
                            <button
                                onClick={() => onDelete(task._id)}
                                className="opacity-0 group-hover:opacity-100 btn-icon text-slate-400 hover:text-rose-500 transition-opacity"
                                aria-label="Delete task"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
