import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { ITask } from '../types';
import { Plus, Trash2, CheckCircle, Circle, LogOut } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<ITask[]>([]);
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(true);

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

    const addTask = async (data: any) => {
        try {
            const response = await api.post('/tasks', data);
            setTasks([...tasks, response.data]);
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

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm p-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">PrimeTrade Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-600">{user?.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto mt-8 p-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                    <form onSubmit={handleSubmit(addTask)} className="flex gap-4">
                        <input
                            type="text"
                            {...register('title', { required: true })}
                            placeholder="What needs to be done?"
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
                    {loading ? (
                        <p>Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No tasks yet. Add one above!</p>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task._id}
                                className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <button
                                        onClick={() => toggleTask(task)}
                                        className={`text-gray-400 hover:text-blue-500 transition-colors ${task.isCompleted ? 'text-green-500' : ''
                                            }`}
                                    >
                                        {task.isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
                                    </button>
                                    <span
                                        className={`text-lg ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
                                            }`}
                                    >
                                        {task.title}
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};
