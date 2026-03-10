import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, Mail, Info } from 'lucide-react';
import paymentQr from '../assets/payment-qr.jpg';

export const Register: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 transition-colors duration-500 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/10 blur-[100px] transition-all duration-1000"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-500/20 dark:bg-fuchsia-600/10 blur-[100px] transition-all duration-1000"></div>

            {/* Floating Icons */}
            <div className="absolute top-1/4 right-1/4 animate-float text-indigo-400/30 hide-on-mobile">
                <UserPlus className="w-16 h-16" />
            </div>
            <div className="absolute bottom-1/4 left-1/4 animate-float-delayed text-fuchsia-400/30 hide-on-mobile">
                <Mail className="w-12 h-12" />
            </div>

            <div className="w-full max-w-md relative z-10 transition-transform duration-500 hover:scale-[1.01]">
                <div className="glass-panel rounded-3xl p-10">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-indigo-500 text-white mb-6 shadow-lg shadow-fuchsia-500/30 animate-pulse-slow">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">Create Account</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Complete payment to register</p>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-blue-50/80 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm shadow-inner">
                            <div className="flex items-start">
                                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                <div className="ml-4">
                                    <h3 className="text-base font-semibold text-blue-900 dark:text-blue-300">Registration Process</h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1.5 leading-relaxed">
                                        To create an account, please scan the QR code below and pay the registration fee. Once completed, send your details to the email below.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center p-8 bg-slate-50/50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-inner backdrop-blur-sm group">
                            <div className="w-56 h-auto aspect-square bg-white p-3 rounded-2xl shadow-md mb-6 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                                <img src={paymentQr} alt="Payment QR Code" className="w-full h-full object-contain rounded-xl" />
                            </div>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-wide uppercase">Scan to Pay</p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Support & Verification Email</p>
                            <div className="flex items-center p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                <Mail className="w-5 h-5 text-indigo-500 mr-3" />
                                <span className="text-sm font-medium tracking-wide">mmanishsharma483@gmail.com</span>
                            </div>
                        </div>

                        <div className="text-center text-sm pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                Already registered?{' '}
                                <Link to="/login" className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-indigo-600 dark:from-fuchsia-400 dark:to-indigo-400 hover:opacity-80 transition-opacity">
                                    Sign in here &rarr;
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
