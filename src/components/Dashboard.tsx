import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { ChartSection } from './ChartSection';
import { ExpenseList } from './ExpenseList';
import { FloatingExpenseModal } from './FloatingExpenseModal';
import { UpdateTransaction } from './UpdateTransaction';
import { ReportHistory } from './ReportHistory';
import { Wallet, TrendingDown, Calendar, List, Edit3, FileText, Plus } from 'lucide-react';
import type { Expense } from '../types';

type DashboardView = 'dashboard' | 'update' | 'report';

export const Dashboard = () => {
    const { totalExpenses, expenses } = useExpense();
    const [activeView, setActiveView] = useState<DashboardView>('dashboard');

    // Legacy Dashboard State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };

    return (
        <div className="pb-24">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>

                {/* User Panel Buttons */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    <button
                        onClick={() => setActiveView('dashboard')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium text-sm ${activeView === 'dashboard'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                            }`}
                    >
                        <List size={18} />
                        Show Expense
                    </button>
                    <button
                        onClick={() => setActiveView('update')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium text-sm ${activeView === 'update'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                            }`}
                    >
                        <Edit3 size={18} />
                        Update Transaction
                    </button>
                    <button
                        onClick={() => setActiveView('report')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium text-sm ${activeView === 'report'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                            }`}
                    >
                        <FileText size={18} />
                        Report History
                    </button>
                </div>
            </div>

            {/* Stats Cards - Only visible on 'Show Expense' dashboard */}
            {activeView === 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                    <ExpenseList onEdit={handleEdit} />

                    {/* FAB only on Dashboard view */}
                    <button
                        onClick={handleAdd}
                        className="fixed bottom-8 right-8 z-50 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
                        title="Add New Expense"
                    >
                        <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                        <span className="hidden md:block font-medium pr-2">Add Expense</span>
                    </button>

                    {/* Modal */}
                    <FloatingExpenseModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        expenseToEdit={editingExpense}
                    />
                </div>
            )}

            {activeView === 'update' && <UpdateTransaction />}

            {activeView === 'report' && <ReportHistory />}
        </div>
    );
};
