import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

interface LoginForm {
    email: string;
    password: string;
}

export const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');

    const onSubmit = async (data: LoginForm) => {
        try {
            setError('');
            const response = await api.post('/auth/login', data);
            login(response.data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white p-12 flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-bold">PrimeTrade</h1>
                </div>
                <div>
                    <h2 className="text-4xl font-bold leading-tight mb-4">
                        Manage your tasks<br />with simplicity.
                    </h2>
                    <p className="text-gray-400 text-lg">
                        A clean, focused workspace for getting things done.
                    </p>
                </div>
                <p className="text-gray-500 text-sm">© 2026 PrimeTrade. All rights reserved.</p>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">PrimeTrade</h1>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h2>
                    <p className="text-gray-500 mb-8">Enter your credentials to access your account.</p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' }
                                })}
                                className="input-field"
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="error-text">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Minimum 6 characters' }
                                })}
                                className="input-field"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="error-text">{errors.password.message}</p>}
                        </div>

                        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-6">
                        Don't have an account? <Link to="/register" className="link">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
