import { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Edit3, Calendar, AlertCircle, CheckCircle2, Search, Trash2 } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../types';
import type { Expense, Category, PaymentMethod } from '../types';

export const UpdateTransaction = () => {
    const { expenses, updateExpense, deleteExpense } = useExpense();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [displayedExpenses, setDisplayedExpenses] = useState<Expense[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Form state for selected expense
    const [editAmount, setEditAmount] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editCategory, setEditCategory] = useState<Category>('Other');
    const [editDate, setEditDate] = useState('');
    const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod>('Cash');

    // UI Feedback
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Auto-refresh results when expenses change
    useEffect(() => {
        if (hasSearched) {
            handleShowTransactions(true);
        }
    }, [expenses]);

    const handleShowTransactions = (keepSelection = false) => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        const filtered = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Adjust end date to include end of day
            end.setHours(23, 59, 59, 999);

            return expenseDate >= start && expenseDate <= end;
        });

        setDisplayedExpenses(filtered);
        setHasSearched(true);
        if (!keepSelection) {
            setSelectedExpense(null); // Clear selection on new search
        }
    };

    const handleRowClick = (expense: Expense) => {
        setSelectedExpense(expense);
        setEditAmount(expense.amount.toString());
        setEditDescription(expense.description);
        setEditCategory(expense.category);
        setEditDate(new Date(expense.date).toISOString().split('T')[0]);
        setEditPaymentMethod(expense.paymentMethod);
        setStatus(null); // Clear previous status
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedExpense || !editAmount) return;

        try {
            await updateExpense(selectedExpense.id, {
                amount: parseFloat(editAmount),
                description: editDescription,
                category: editCategory,
                date: new Date(editDate).toISOString(),
                paymentMethod: editPaymentMethod
            });

            setStatus({ type: 'success', message: 'Transaction updated successfully!' });

            // Update the local displayed list to reflect changes immediately
            setDisplayedExpenses(prev => prev.map(ex =>
                ex.id === selectedExpense.id ? {
                    ...ex,
                    amount: parseFloat(editAmount),
                    description: editDescription,
                    category: editCategory,
                    date: new Date(editDate).toISOString(),
                    paymentMethod: editPaymentMethod
                } : ex
            ));

            // Reset selection but keep view
            setSelectedExpense(null);
            setEditAmount('');
            setEditDescription('');

            // Clear success message after 3 seconds
            setTimeout(() => setStatus(null), 3000);
        } catch (error: any) {
            console.error(error);
            setStatus({ type: 'error', message: error.message || 'Failed to update. ensure backend is running.' });
        }
    };

    const handleDelete = async () => {
        if (!selectedExpense) return;

        if (!window.confirm("Are you sure you want to delete this transaction?")) return;

        try {
            await deleteExpense(selectedExpense.id);

            setStatus({ type: 'success', message: 'Transaction deleted successfully!' });

            // Remove from local displayed list
            setDisplayedExpenses(prev => prev.filter(ex => ex.id !== selectedExpense.id));

            // Reset selection
            setSelectedExpense(null);
            setEditAmount('');
            setEditDescription('');

            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Failed to delete transaction.' });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="text-purple-500" size={20} />
                    Select Date Range
                </h3>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => handleShowTransactions()}
                        className="w-full md:w-auto px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Search size={20} />
                        Show Transactions
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* List View - Refactored to Table for better density */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm h-[500px] flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                        <h3 className="font-semibold text-slate-800 dark:text-white">Transactions ({displayedExpenses.length})</h3>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-white/5 uppercase font-medium text-xs sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                {!hasSearched ? (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                                            <Search size={24} className="opacity-50" />
                                            <span>Select a date range and click "Show Transactions"</span>
                                        </td>
                                    </tr>
                                ) : displayedExpenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-slate-500">No transactions found in this range</td>
                                    </tr>
                                ) : (
                                    displayedExpenses.map(expense => (
                                        <tr
                                            key={expense.id}
                                            onClick={() => handleRowClick(expense)}
                                            className={`cursor-pointer transition-colors ${selectedExpense?.id === expense.id
                                                ? 'bg-purple-50 dark:bg-purple-900/20'
                                                : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                                                }`}
                                        >
                                            <td className="p-3 whitespace-nowrap">
                                                {new Date(expense.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-slate-600 dark:text-slate-400 text-xs">
                                                {expense.category}
                                            </td>
                                            <td className="p-3 font-medium text-slate-800 dark:text-white">
                                                {expense.description}
                                            </td>
                                            <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                                ₹{expense.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm h-fit">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Edit3 className="text-purple-500" size={20} />
                        Update Details
                    </h3>

                    {status && (
                        <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${status.type === 'success'
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {status.message}
                        </div>
                    )}

                    {selectedExpense ? (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={editAmount}
                                    onChange={(e) => setEditAmount(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Description</label>
                                <input
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Date</label>
                                    <input
                                        type="date"
                                        value={editDate}
                                        onChange={(e) => setEditDate(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Category</label>
                                    <select
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value as Category)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Payment Method</label>
                                <select
                                    value={editPaymentMethod}
                                    onChange={(e) => setEditPaymentMethod(e.target.value as PaymentMethod)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white"
                                >
                                    {PAYMENT_METHODS.map(method => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                                >
                                    Update Transaction
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete Transaction
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedExpense(null)}
                                    className="w-full bg-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white font-medium py-2 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="h-[200px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
                            <span className="text-sm">Select a transaction to edit</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
