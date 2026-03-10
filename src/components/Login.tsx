import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await login(username, password);
        if (!success) {
            setError('Invalid credentials');
            console.error('Login failed');
        }
        // Navigation is handled by useEffect
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-500 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/10 blur-[100px] transition-all duration-1000"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-500/20 dark:bg-fuchsia-600/10 blur-[100px] transition-all duration-1000"></div>

            {/* Floating Icons */}
            <div className="absolute top-1/4 left-1/4 animate-float text-indigo-400/30 hide-on-mobile">
                <LogIn className="w-16 h-16" />
            </div>
            <div className="absolute bottom-1/4 right-1/4 animate-float-delayed text-fuchsia-400/30 hide-on-mobile">
                <User className="w-12 h-12" />
            </div>

            <div className="w-full max-w-md relative z-10 transition-transform duration-500 hover:scale-[1.01]">
                {/* Main Glass Panel */}
                <div className="glass-panel rounded-3xl p-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white mb-6 shadow-lg shadow-indigo-500/30 animate-pulse-slow">
                            <LogIn className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">Welcome Back</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Sign in to your premium tracker</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-sm font-medium text-center border border-red-100 dark:border-red-800 backdrop-blur-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2 group">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-700/50 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-800 transition-all backdrop-blur-sm shadow-inner"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-3.5 border border-slate-200 dark:border-slate-700/50 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-800 transition-all backdrop-blur-sm shadow-inner"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Sign In
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium">
                        <p className="text-slate-500 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600 dark:from-indigo-400 dark:to-fuchsia-400 hover:opacity-80 transition-opacity">
                                Create one &rarr;
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
