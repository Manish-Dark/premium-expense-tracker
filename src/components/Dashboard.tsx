import { useExpense } from '../context/ExpenseContext';
import { ChartSection } from './ChartSection';
import { ExpenseList } from './ExpenseList';
import { FloatingExpenseModal } from './FloatingExpenseModal';
import { Wallet, TrendingDown, Calendar } from 'lucide-react';

export const Dashboard = () => {
    const { totalExpenses, expenses } = useExpense();

    return (
        <div className="pb-24">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-indigo-500/30 p-6 rounded-2xl backdrop-blur-md shadow-sm dark:shadow-lg dark:shadow-indigo-900/10">
                    <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-2">
                        <Wallet className="w-5 h-5" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Balance</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">₹{totalExpenses.toLocaleString()}</p>
                </div>

                <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-purple-500/30 p-6 rounded-2xl backdrop-blur-md shadow-sm dark:shadow-lg dark:shadow-purple-900/10">
                    <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400 mb-2">
                        <TrendingDown className="w-5 h-5" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Monthly Spend</span>
                    </div>
                    {/* Simplified calculation for demo */}
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                        ₹{expenses
                            .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
                            .reduce((a, b) => a + b.amount, 0).toLocaleString()}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-emerald-500/30 p-6 rounded-2xl backdrop-blur-md shadow-sm dark:shadow-lg dark:shadow-emerald-900/10">
                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Avg. Daily</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                        ₹{expenses.length > 0 ? Math.round(totalExpenses / 30).toLocaleString() : 0}
                    </p>
                </div>
            </div>

            <ChartSection />
            <ExpenseList />
            <FloatingExpenseModal />
        </div>
    );
};
