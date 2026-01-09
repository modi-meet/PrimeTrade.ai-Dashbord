import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useToast';
import { Header } from '../components/Header';
import { Stats } from '../components/Stats';
import { TaskList } from '../components/TaskList';
import { Toast } from '../components/Toast';
import { Spinner } from '../components/Spinner';

export const Dashboard = () => {
    const { user } = useAuth();
    const { tasks, loading, stats, fetchTasks, addTask, toggleTask, deleteTask } = useTasks();
    const { toast, showToast, hideToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
    const [isAdding, setIsAdding] = useState(false);
    const { register, handleSubmit, reset } = useForm<{ title: string }>();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Keyboard shortcut: Cmd/Ctrl + K to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search-input')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleAddTask = async (data: { title: string }) => {
        if (!data.title.trim()) return;
        setIsAdding(true);
        try {
            await addTask(data.title);
            reset();
            showToast('Task created successfully', 'success');
        } catch {
            showToast('Failed to create task', 'error');
        } finally {
            setIsAdding(false);
        }
    };

    const handleToggle = async (task: any) => {
        try {
            await toggleTask(task);
        } catch {
            showToast('Failed to update task', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id);
            showToast('Task deleted', 'success');
        } catch {
            showToast('Failed to delete task', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <Header />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Welcome */}
                <div className="mb-6 sm:mb-8 fade-in">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                        Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500">
                        {stats.active === 0 && stats.total > 0
                            ? "All tasks completed! 🎉"
                            : `You have ${stats.active} task${stats.active !== 1 ? 's' : ''} in progress.`}
                    </p>
                </div>

                <Stats {...stats} loading={loading} />

                {/* Add Task */}
                <div className="card p-3 sm:p-4 mb-4 sm:mb-6 fade-in" style={{ animationDelay: '0.4s' }}>
                    <form onSubmit={handleSubmit(handleAddTask)} className="flex gap-2 sm:gap-3">
                        <input
                            type="text"
                            {...register('title')}
                            placeholder="What needs to be done?"
                            className="input-field flex-1"
                            autoComplete="off"
                        />
                        <button type="submit" disabled={isAdding} className="btn-primary flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                            {isAdding ? <Spinner size="sm" className="border-white/30 border-t-white" /> : <Plus size={18} />}
                            <span className="hidden sm:inline">{isAdding ? 'Adding...' : 'Add Task'}</span>
                        </button>
                    </form>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6 fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-9 sm:pl-11"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="input-field w-full sm:w-40"
                    >
                        <option value="all">All tasks</option>
                        <option value="active">In progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <TaskList
                    tasks={tasks}
                    loading={loading}
                    searchQuery={searchQuery}
                    filterStatus={filterStatus}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />

                {/* Footer hint - desktop only */}
                <p className="hidden lg:block text-center text-slate-400 text-xs mt-8">
                    Pro tip: Press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px]">⌘K</kbd> to quickly search your tasks
                </p>
            </main>
        </div>
    );
};
