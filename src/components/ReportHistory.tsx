import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { FileText, FileSpreadsheet, Calendar, Search } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import type { Expense } from '../types';

export const ReportHistory = () => {
    const { expenses } = useExpense();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [displayedExpenses, setDisplayedExpenses] = useState<Expense[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleShowReport = () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        const filtered = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            return expenseDate >= start && expenseDate <= end;
        });

        setDisplayedExpenses(filtered);
        setHasSearched(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <Calendar className="text-emerald-500" size={20} />
                        Filter Reports
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => exportToExcel(displayedExpenses)}
                            disabled={!hasSearched || displayedExpenses.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileSpreadsheet size={18} />
                            Export Excel
                        </button>
                        <button
                            onClick={() => exportToPDF(displayedExpenses)}
                            disabled={!hasSearched || displayedExpenses.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileText size={18} />
                            Export PDF
                        </button>
                    </div>
                </div>

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
                        onClick={handleShowReport}
                        className="w-full md:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Search size={20} />
                        Show Transactions
                    </button>
                </div>
            </div>

            {/* Grid View of Filtered Data */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-white/5 uppercase font-medium text-xs">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Method</th>
                                <th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {!hasSearched ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                                        <Search size={24} className="opacity-50" />
                                        <span>Select date range and click "Show Transactions" to view report</span>
                                    </td>
                                </tr>
                            ) : displayedExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No transactions found for selected period</td>
                                </tr>
                            ) : (
                                displayedExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 whitespace-nowrap">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">{expense.category}</td>
                                        <td className="p-4 font-medium text-slate-800 dark:text-white">{expense.description}</td>
                                        <td className="p-4">{expense.paymentMethod}</td>
                                        <td className="p-4 text-right font-bold text-slate-900 dark:text-slate-100">
                                            ₹{expense.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
