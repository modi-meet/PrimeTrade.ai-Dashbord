import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
}

export const Register = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');

    const onSubmit = async (data: RegisterForm) => {
        try {
            setError('');
            const response = await api.post('/auth/register', data);
            login(response.data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-slate-900 font-bold text-xl">P</span>
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">PrimeTrade</span>
                    </div>
                </div>

                <div className="relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
                        Start your<br />productivity journey.
                    </h2>
                    <p className="text-slate-400 text-lg max-w-md">
                        Join thousands of users who manage their tasks efficiently with PrimeTrade.
                    </p>
                </div>

                <p className="relative z-10 text-slate-500 text-sm">© 2026 PrimeTrade. All rights reserved.</p>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-slate-900 font-bold text-xl tracking-tight">PrimeTrade</span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create an account</h2>
                    <p className="text-slate-500 mb-8">Get started with your free account today.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="label">Full name</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                className="input-field"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="error-text">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="label">Email address</label>
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

                        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
                            {isSubmitting ? 'Creating account...' : (
                                <>
                                    Get started
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="link">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
