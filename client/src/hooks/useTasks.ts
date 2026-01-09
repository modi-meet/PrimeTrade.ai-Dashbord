import { useState, useCallback } from 'react';
import api from '../api/axios';
import type { ITask } from '../types';

export const useTasks = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (err) {
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    const addTask = useCallback(async (title: string): Promise<boolean> => {
        if (!title.trim()) return false;
        try {
            const response = await api.post('/tasks', { title });
            setTasks((prev) => [response.data, ...prev]);
            return true;
        } catch (err) {
            throw new Error('Failed to create task');
        }
    }, []);

    const toggleTask = useCallback(async (task: ITask): Promise<boolean> => {
        const previousTasks = tasks;
        setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, isCompleted: !t.isCompleted } : t)));

        try {
            await api.put(`/tasks/${task._id}`, { isCompleted: !task.isCompleted });
            return true;
        } catch (err) {
            setTasks(previousTasks);
            throw new Error('Failed to update task');
        }
    }, [tasks]);

    const deleteTask = useCallback(async (id: string): Promise<boolean> => {
        const previousTasks = tasks;
        setTasks((prev) => prev.filter((t) => t._id !== id));

        try {
            await api.delete(`/tasks/${id}`);
            return true;
        } catch (err) {
            setTasks(previousTasks);
            throw new Error('Failed to delete task');
        }
    }, [tasks]);

    const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.isCompleted).length,
        active: tasks.filter((t) => !t.isCompleted).length,
    };

    return {
        tasks,
        loading,
        error,
        stats,
        fetchTasks,
        addTask,
        toggleTask,
        deleteTask,
    };
};
