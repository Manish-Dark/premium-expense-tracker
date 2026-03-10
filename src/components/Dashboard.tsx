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
            <div className="sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md pt-4 pb-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-transparent sm:border-slate-200/50 sm:dark:border-slate-800/50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">Dashboard</h1>

                    {/* User Panel Buttons */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        <button
                            onClick={() => setActiveView('dashboard')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${activeView === 'dashboard'
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-indigo-500/30'
                                : 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                }`}
                        >
                            <List size={18} />
                            Show Expense
                        </button>
                        <button
                            onClick={() => setActiveView('update')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${activeView === 'update'
                                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-purple-500/30'
                                : 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                                }`}
                        >
                            <Edit3 size={18} />
                            Update Transaction
                        </button>
                        <button
                            onClick={() => setActiveView('report')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${activeView === 'report'
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-emerald-500/30'
                                : 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                                }`}
                        >
                            <FileText size={18} />
                            Report History
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Only visible on 'Show Expense' dashboard */}
            {activeView === 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Balance Card */}
                        <div className="group bg-gradient-to-br from-white to-indigo-50/50 dark:from-slate-900 dark:to-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500 text-indigo-500">
                                <Wallet className="w-24 h-24 -mt-4 -mr-4" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300">Total Balance</span>
                                </div>
                                <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-100 mt-2">₹{totalExpenses.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Monthly Spend Card */}
                        <div className="group bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-900 dark:to-purple-900/10 border border-purple-100 dark:border-purple-500/20 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500 text-purple-500">
                                <TrendingDown className="w-24 h-24 -mt-4 -mr-4" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400 mb-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                        <TrendingDown className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300">Monthly Spend</span>
                                </div>
                                <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-purple-900 dark:from-white dark:to-purple-100 mt-2">
                                    ₹{
                                        expenses
                                            .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
                                            .reduce((a, b) => a + b.amount, 0).toLocaleString()
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Avg Daily Card */}
                        <div className="group bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-900 dark:to-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500 text-emerald-500">
                                <Calendar className="w-24 h-24 -mt-4 -mr-4" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300">Avg. Daily</span>
                                </div>
                                <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-900 dark:from-white dark:to-emerald-100 mt-2">
                                    ₹{(expenses.length > 0 ? Math.round(totalExpenses / 30) : 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <ChartSection />
                    <ExpenseList onEdit={handleEdit} />

                    {/* FAB only on Dashboard view */}
                    <button
                        onClick={handleAdd}
                        className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 group"
                        title="Add New Expense"
                    >
                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span className="hidden md:block font-bold tracking-wide pr-2">Add Expense</span>
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
