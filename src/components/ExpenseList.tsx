import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { ShoppingBag, Utensils, Zap, ShoppingCart, Film, Heart } from 'lucide-react';
import type { Category, PaymentMethod, Expense } from '../types';

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

interface ExpenseListProps {
    onEdit?: (expense: Expense) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = () => {
    const { expenses } = useExpense();

    if (expenses.length === 0) {
        return (
            <div id="expense-list" className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-600">
                    <ShoppingBag size={24} />
                </div>
                <h3 className="text-lg font-medium text-slate-300">No expenses yet</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xs">Tap the + button to add your first expense.</p>
            </div>
        );
    }

    return (
        <div id="expense-list" className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-none">
            <div className="p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-white/5 max-h-[500px] overflow-y-auto">
                {expenses.slice(0, 10).map((expense) => (
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
