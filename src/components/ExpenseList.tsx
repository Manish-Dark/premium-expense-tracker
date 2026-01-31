import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Trash2, ShoppingBag, Utensils, Zap, ShoppingCart, Film, Heart, FileSpreadsheet, FileText } from 'lucide-react';
import type { Category, PaymentMethod } from '../types';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

const CategoryIcons: Record<Category, React.ReactNode> = {
    'Food': <Utensils size={18} />,
    'Grocery': <ShoppingBag size={18} />,
    'Bills': <Zap size={18} />,
    'Entertainment': <Film size={18} />,
    'Health': <Heart size={18} />,
    'Other': <ShoppingCart size={18} />,
};

// Color coding for payment methods
const PaymentStyles: Record<PaymentMethod, string> = {
    'Zomato': 'text-red-500 bg-red-500/10 border-red-500/20',
    'Swiggy': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    'Zepto': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    'Paytm': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'PhonePe': 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    'Google Pay': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'Cash': 'text-green-500 bg-green-500/10 border-green-500/20',
    'Card': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    'Other': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

export const ExpenseList: React.FC = () => {
    const { expenses, deleteExpense } = useExpense();

    if (expenses.length === 0) {
        return (
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-600">
                    <ShoppingBag size={24} />
                </div>
                <h3 className="text-lg font-medium text-slate-300">No expenses yet</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xs">Tap the + button to add your first expense.</p>
            </div>
        );
    }

    return (
        <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Recent Transactions</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportToExcel(expenses)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        title="Export to Excel"
                    >
                        <FileSpreadsheet size={16} />
                        <span className="hidden sm:inline">Excel</span>
                    </button>
                    <button
                        onClick={() => exportToPDF(expenses)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Export to PDF"
                    >
                        <FileText size={16} />
                        <span className="hidden sm:inline">PDF</span>
                    </button>
                </div>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-white/5 max-h-[500px] overflow-y-auto">
                {expenses.map((expense) => (
                    <div key={expense.id} className="group p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300`}>
                                {CategoryIcons[expense.category]}
                            </div>
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200">{expense.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${PaymentStyles[expense.paymentMethod]}`}>
                                        {expense.paymentMethod}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                                -₹{expense.amount.toFixed(2)}
                            </span>
                            <button
                                onClick={() => deleteExpense(expense.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
