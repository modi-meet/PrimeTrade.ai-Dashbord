import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import type { ITask } from '../types';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Check, LogOut, Search, ListFilter, CheckCircle2, Circle, Inbox } from 'lucide-react';
import { Toast, ToastType } from '../components/Toast';
import { Spinner } from '../components/Spinner';
import { EmptyState } from '../components/EmptyState';
import { TaskSkeleton, StatSkeleton } from '../components/Skeleton';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const { register, handleSubmit, reset } = useForm<{ title: string }>();

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            showToast('Failed to load tasks', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

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

    const addTask = async (data: { title: string }) => {
        if (!data.title.trim()) return;
        setIsAdding(true);
        try {
            const response = await api.post('/tasks', { title: data.title });
            setTasks([response.data, ...tasks]);
            reset();
            showToast('Task created successfully', 'success');
        } catch (error) {
            showToast('Failed to create task', 'error');
        } finally {
            setIsAdding(false);
        }
    };

    const toggleTask = async (task: ITask) => {
        // Optimistic update
        const previousTasks = tasks;
        setTasks(tasks.map((t) => (t._id === task._id ? { ...t, isCompleted: !t.isCompleted } : t)));

        try {
            await api.put(`/tasks/${task._id}`, { isCompleted: !task.isCompleted });
        } catch (error) {
            setTasks(previousTasks);
            showToast('Failed to update task', 'error');
        }
    };

    const deleteTask = async (id: string) => {
        const previousTasks = tasks;
        setTasks(tasks.filter((t) => t._id !== id));

        try {
            await api.delete(`/tasks/${id}`);
            showToast('Task deleted', 'success');
        } catch (error) {
            setTasks(previousTasks);
            showToast('Failed to delete task', 'error');
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterStatus === 'all' ||
            (filterStatus === 'active' && !task.isCompleted) ||
            (filterStatus === 'completed' && task.isCompleted);
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.isCompleted).length,
        active: tasks.filter((t) => !t.isCompleted).length,
    };

    const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">

                            <span className="text-slate-900 font-bold text-lg tracking-tight hidden sm:block">PrimeTrade</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-500">
                                <kbd className="px-1 py-0.5 bg-white rounded shadow-sm text-[10px]">⌘K</kbd>
                                <span>to search</span>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                                <div className="tooltip-trigger relative">
                                    <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="tooltip -bottom-8 left-1/2 -translate-x-1/2">{user?.email}</div>
                                </div>
                                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
                            </div>
                            <button onClick={logout} className="btn-icon ml-1" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome */}
                <div className="mb-8 fade-in">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                        Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-slate-500">
                        {stats.active === 0 && stats.total > 0
                            ? "All tasks completed! 🎉"
                            : `You have ${stats.active} task${stats.active !== 1 ? 's' : ''} in progress.`}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {loading ? (
                        <>
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </>
                    ) : (
                        <>
                            <div className="stat-card fade-in" style={{ animationDelay: '0.1s' }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                        <ListFilter size={20} className="text-slate-600" />
                                    </div>
                                    {stats.total > 0 && (
                                        <span className="text-xs font-medium text-slate-400">{completionPercentage}%</span>
                                    )}
                                </div>
                                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                                <p className="text-sm text-slate-500">Total tasks</p>
                            </div>
                            <div className="stat-card fade-in" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                        <Circle size={20} className="text-amber-600" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-slate-900">{stats.active}</p>
                                <p className="text-sm text-slate-500">In progress</p>
                            </div>
                            <div className="stat-card fade-in" style={{ animationDelay: '0.3s' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <CheckCircle2 size={20} className="text-emerald-600" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
                                <p className="text-sm text-slate-500">Completed</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Add Task */}
                <div className="card p-4 mb-6 fade-in" style={{ animationDelay: '0.4s' }}>
                    <form onSubmit={handleSubmit(addTask)} className="flex gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                {...register('title')}
                                placeholder="What needs to be done? (⌘N)"
                                className="input-field pr-4"
                                autoComplete="off"
                            />
                        </div>
                        <button type="submit" disabled={isAdding} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                            {isAdding ? <Spinner size="sm" className="border-white/30 border-t-white" /> : <Plus size={18} />}
                            <span className="hidden sm:inline">{isAdding ? 'Adding...' : 'Add Task'}</span>
                        </button>
                    </form>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6 fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Search tasks... (⌘K)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-11 pr-4"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="input-field w-full sm:w-44"
                    >
                        <option value="all">All tasks</option>
                        <option value="active">In progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Task List */}
                <div className="card overflow-hidden fade-in" style={{ animationDelay: '0.6s' }}>
                    {loading ? (
                        <div>
                            <TaskSkeleton />
                            <TaskSkeleton />
                            <TaskSkeleton />
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <EmptyState
                            icon={searchQuery || filterStatus !== 'all' ? Search : Inbox}
                            title={searchQuery || filterStatus !== 'all' ? 'No matching tasks' : 'No tasks yet'}
                            description={
                                searchQuery || filterStatus !== 'all'
                                    ? 'Try adjusting your search or filter to find what you are looking for.'
                                    : 'Create your first task using the form above to get started.'
                            }
                        />
                    ) : (
                        <ul>
                            {filteredTasks.map((task, index) => (
                                <li
                                    key={task._id}
                                    className="task-item group slide-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <button
                                        onClick={() => toggleTask(task)}
                                        className={`checkbox ${task.isCompleted ? 'checkbox-checked' : 'checkbox-unchecked'}`}
                                        aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                                    >
                                        {task.isCompleted && <Check size={12} strokeWidth={3} />}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <span
                                            className={`block text-[15px] truncate ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                                                }`}
                                        >
                                            {task.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {task.isCompleted && (
                                            <span className="badge-success text-[10px] hidden sm:inline-flex">Done</span>
                                        )}
                                        <button
                                            onClick={() => deleteTask(task._id)}
                                            className="opacity-0 group-hover:opacity-100 btn-icon text-slate-400 hover:text-rose-500 transition-opacity"
                                            aria-label="Delete task"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer hint - hidden on mobile */}
                <p className="hidden sm:block text-center text-slate-400 text-xs mt-8">
                    Pro tip: Press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px]">⌘K</kbd> to quickly search your tasks
                </p>
            </main>
        </div>
    );
};
