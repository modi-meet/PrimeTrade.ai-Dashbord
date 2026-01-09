import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Header = () => {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo - always visible */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <img src="/primetrade-logo.png" alt="PrimeTrade" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shadow-sm object-cover" />
                        <span className="text-slate-900 font-bold text-base sm:text-lg tracking-tight">PrimeTrade</span>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-500">
                            <kbd className="px-1 py-0.5 bg-white rounded shadow-sm text-[10px]">⌘K</kbd>
                            <span>to search</span>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden md:block">{user?.name}</span>
                        </div>
                        <button onClick={logout} className="btn-icon ml-1" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="sm:hidden btn-icon"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-t border-slate-100 py-3 fade-in">
                        <div className="flex items-center gap-3 px-1 py-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{user?.name}</p>
                                <p className="text-sm text-slate-500">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full mt-2 flex items-center gap-2 px-3 py-2.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">Sign out</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
