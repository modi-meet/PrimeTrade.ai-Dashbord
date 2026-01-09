import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import type { ITask } from '../types';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Check, LogOut, Search, ListFilter, CheckCircle2, Circle } from 'lucide-react';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
    const { register, handleSubmit, reset } = useForm<{ title: string }>();

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async (data: { title: string }) => {
        if (!data.title.trim()) return;
        try {
            const response = await api.post('/tasks', { title: data.title });
            setTasks([response.data, ...tasks]);
            reset();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const toggleTask = async (task: ITask) => {
        try {
            const response = await api.put(`/tasks/${task._id}`, {
                isCompleted: !task.isCompleted,
            });
            setTasks(tasks.map((t) => (t._id === task._id ? response.data : t)));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter((t) => t._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
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

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <span className="text-slate-900 font-bold text-lg tracking-tight hidden sm:block">PrimeTrade</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-100 rounded-full">
                                <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="btn-icon"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome & Stats */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
                        Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-slate-500">Here's your task overview for today.</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="stat-card">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <ListFilter size={16} className="text-slate-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                        <p className="text-sm text-slate-500">Total tasks</p>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                                <Circle size={16} className="text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
                        <p className="text-sm text-slate-500">In progress</p>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <CheckCircle2 size={16} className="text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
                        <p className="text-sm text-slate-500">Completed</p>
                    </div>
                </div>

                {/* Add Task */}
                <div className="card p-4 mb-6">
                    <form onSubmit={handleSubmit(addTask)} className="flex gap-3">
                        <input
                            type="text"
                            {...register('title')}
                            placeholder="What needs to be done?"
                            className="input-field flex-1"
                        />
                        <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap">
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add Task</span>
                        </button>
                    </form>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-11"
                        />
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

                {/* Task List */}
                <div className="card overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Loading tasks...</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <ListFilter size={24} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500">
                                {searchQuery || filterStatus !== 'all'
                                    ? 'No matching tasks found.'
                                    : 'No tasks yet. Create one above!'}
                            </p>
                        </div>
                    ) : (
                        <ul>
                            {filteredTasks.map((task) => (
                                <li key={task._id} className="task-item group">
                                    <button
                                        onClick={() => toggleTask(task)}
                                        className={`checkbox ${task.isCompleted ? 'checkbox-checked' : 'checkbox-unchecked'}`}
                                    >
                                        {task.isCompleted && <Check size={12} strokeWidth={3} />}
                                    </button>
                                    <span
                                        className={`flex-1 text-[15px] ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                                            }`}
                                    >
                                        {task.title}
                                    </span>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="opacity-0 group-hover:opacity-100 btn-icon text-slate-400 hover:text-rose-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
};
