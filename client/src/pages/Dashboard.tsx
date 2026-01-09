import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import type { ITask } from '../types';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Check, LogOut, Search, Filter } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl font-bold text-gray-900">PrimeTrade</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-700 hidden sm:block">{user?.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:block">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="card p-4">
                        <p className="text-sm text-gray-500">Total Tasks</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-sm text-gray-500">Active</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
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
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <Plus size={18} />
                            <span className="hidden sm:block">Add Task</span>
                        </button>
                    </form>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="input-field w-auto"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Task List */}
                <div className="card">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading tasks...</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchQuery || filterStatus !== 'all'
                                ? 'No matching tasks found.'
                                : 'No tasks yet. Add one above!'}
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {filteredTasks.map((task) => (
                                <li key={task._id} className="flex items-center gap-3 p-4 hover:bg-gray-50 group">
                                    <button
                                        onClick={() => toggleTask(task)}
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.isCompleted
                                                ? 'bg-gray-900 border-gray-900 text-white'
                                                : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        {task.isCompleted && <Check size={12} />}
                                    </button>
                                    <span
                                        className={`flex-1 ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
                                            }`}
                                    >
                                        {task.title}
                                    </span>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
