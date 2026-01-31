import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, Mail, Info } from 'lucide-react';
import paymentQr from '../assets/payment-qr.jpg';

export const Register: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 transition-colors duration-300">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                    <Link to="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Login
                    </Link>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Complete payment to register</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
                            <div className="flex items-start">
                                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">Registration Process</h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                        To create an account, please scan the QR code below and pay the registration fee. Once completed, send your details to the email below.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="w-64 h-auto aspect-square bg-white p-2 rounded-xl shadow-sm mb-4">
                                <img src={paymentQr} alt="Payment QR Code" className="w-full h-full object-contain rounded-lg" />
                            </div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Scan to Pay</p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Support & Verification Email</p>
                            <div className="flex items-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                <Mail className="w-5 h-5 text-indigo-500 mr-3" />
                                <span className="text-sm font-medium break-all">mmanishsharma483@gmail.com</span>
                            </div>
                        </div>

                        <div className="text-center text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-slate-500 dark:text-slate-400">
                                Already registered?{' '}
                                <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
