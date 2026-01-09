import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Spinner } from '../components/Spinner';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
}

export const Register = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<RegisterForm>();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const password = watch('password', '');

    const onSubmit = async (data: RegisterForm) => {
        try {
            setError('');
            const response = await api.post('/auth/register', data);
            login(response.data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <img src="/primetrade-logo.png" alt="PrimeTrade" className="w-10 h-10 rounded-lg shadow-md object-cover" />
                        <span className="text-white font-bold text-xl tracking-tight">PrimeTrade</span>
                    </div>
                </div>

                <div className="relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                        Start your<br />productivity journey.
                    </h2>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                        Join thousands of users who manage their tasks efficiently with PrimeTrade.
                    </p>

                    {/* Features */}
                    <div className="mt-8 space-y-3">
                        {['Simple task management', 'Secure authentication', 'Cloud sync'].map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-slate-300">
                                <CheckCircle2 size={16} className="text-emerald-400" />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-slate-500 text-sm">© 2026 PrimeTrade. All rights reserved.</p>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md fade-in">
                    <div className="lg:hidden mb-10 flex items-center gap-3">
                        <img src="/primetrade-logo.png" alt="PrimeTrade" className="w-10 h-10 rounded-lg shadow-sm object-cover" />
                        <span className="text-slate-900 font-bold text-xl tracking-tight">PrimeTrade</span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h2>
                    <p className="text-slate-500 mb-8">Get started with your free account today.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3 scale-in">
                            <AlertCircle size={18} className="flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="label">Full name</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                className={`input-field ${errors.name ? 'border-rose-300' : ''}`}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="error-text">
                                    <AlertCircle size={14} />
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="label">Email address</label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' }
                                })}
                                className={`input-field ${errors.email ? 'border-rose-300' : ''}`}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="error-text">
                                    <AlertCircle size={14} />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Minimum 6 characters' }
                                })}
                                className={`input-field ${errors.password ? 'border-rose-300' : ''}`}
                                placeholder="••••••••"
                            />
                            {password && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${passwordStrength === 'strong' ? 'w-full bg-emerald-500'
                                                : passwordStrength === 'medium' ? 'w-2/3 bg-amber-500'
                                                    : 'w-1/3 bg-rose-500'
                                                }`}
                                        />
                                    </div>
                                    <span className={`text-xs ${passwordStrength === 'strong' ? 'text-emerald-600'
                                        : passwordStrength === 'medium' ? 'text-amber-600'
                                            : 'text-rose-600'
                                        }`}>
                                        {passwordStrength === 'strong' ? 'Strong' : passwordStrength === 'medium' ? 'Medium' : 'Weak'}
                                    </span>
                                </div>
                            )}
                            {errors.password && (
                                <p className="error-text">
                                    <AlertCircle size={14} />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <Spinner size="sm" className="border-white/30 border-t-white" />
                                    Creating account...
                                </>
                            ) : (
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
