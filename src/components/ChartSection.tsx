import { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useExpense } from '../context/ExpenseContext';
import { useTheme } from '../context/ThemeContext';
import { subDays, format, isWithinInterval, parseISO, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export const ChartSection = () => {
    const { expenses, filter, setFilter } = useExpense();
    const { theme } = useTheme();

    // Theme-dependent colors
    const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    const filteredExpenses = useMemo(() => {
        const now = new Date();
        let start: Date, end: Date;

        if (filter === 'weekly') {
            start = subDays(now, 7);
            end = now;
        } else if (filter === 'monthly') {
            start = startOfMonth(now);
            end = endOfMonth(now);
        } else {
            start = startOfYear(now);
            end = endOfYear(now);
        }

        return expenses.filter(e => {
            const date = parseISO(e.date);
            return isWithinInterval(date, { start, end });
        });
    }, [expenses, filter]);

    const chartData = useMemo(() => {
        // Doughnut Data (By Category)
        const categoryUsage: Record<string, number> = {};
        filteredExpenses.forEach(e => {
            categoryUsage[e.category] = (categoryUsage[e.category] || 0) + e.amount;
        });

        const doughnut = {
            labels: Object.keys(categoryUsage),
            datasets: [{
                data: Object.values(categoryUsage),
                backgroundColor: [
                    'rgba(244, 63, 94, 0.8)',   // Rose
                    'rgba(249, 115, 22, 0.8)',  // Orange
                    'rgba(139, 92, 246, 0.8)',  // Violet
                    'rgba(16, 185, 129, 0.8)',  // Emerald
                    'rgba(59, 130, 246, 0.8)',  // Blue
                    'rgba(236, 72, 153, 0.8)',  // Pink
                ],
                borderWidth: 0,
            }]
        };

        // Bar Data (Full Timeline)
        let labels: string[] = [];
        let dataPoints: number[] = [];

        const now = new Date();
        const usageMap: Record<string, number> = {};

        // 1. Populate usageMap
        filteredExpenses.forEach(e => {
            let key: string;
            if (filter === 'yearly') {
                key = format(parseISO(e.date), 'MMM');
            } else {
                key = format(parseISO(e.date), 'MMM dd');
            }
            usageMap[key] = (usageMap[key] || 0) + e.amount;
        });

        // 2. Generate Full Axis Labels and Match Data
        if (filter === 'weekly') {
            const start = subDays(now, 6); // Last 7 days including today
            const interval = eachDayOfInterval({ start, end: now });
            labels = interval.map(date => format(date, 'MMM dd'));
        } else if (filter === 'monthly') {
            const start = startOfMonth(now);
            const end = endOfMonth(now);
            const interval = eachDayOfInterval({ start, end });
            labels = interval.map(date => format(date, 'MMM dd'));
        } else {
            // Yearly
            const start = startOfYear(now);
            const end = endOfYear(now);
            const interval = eachMonthOfInterval({ start, end });
            labels = interval.map(date => format(date, 'MMM'));
        }

        dataPoints = labels.map(label => usageMap[label] || 0);

        const bar = {
            labels,
            datasets: [{
                label: filter === 'yearly' ? 'Monthly Spend' : 'Daily Spend',
                data: dataPoints,
                backgroundColor: '#8b5cf6', // Violet-500
                borderRadius: 6,
                barPercentage: filter === 'monthly' ? 0.5 : 0.7, // Thinner bars for monthly view
            }]
        };

        return { doughnut, bar };
    }, [filteredExpenses, filter]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {/* Bar Chart Section */}
            <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 p-6 rounded-2xl relative shadow-sm dark:shadow-none backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Spending Trends</h3>
                    <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg">
                        {(['weekly', 'monthly', 'yearly'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${filter === f ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-64 flex items-center justify-center">
                    {filteredExpenses.length > 0 ? (
                        <Bar
                            data={chartData.bar}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: gridColor }, ticks: { color: textColor } },
                                    x: { grid: { display: false }, ticks: { color: textColor } }
                                }
                            }}
                        />
                    ) : (
                        <p className="text-slate-500 text-sm">No data for selected period</p>
                    )}
                </div>
            </div>

            {/* Doughnut Chart Section */}
            <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex flex-col items-center shadow-sm dark:shadow-none backdrop-blur-sm">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-6 w-full text-left">Breakdown</h3>
                <div className="h-64 w-full flex items-center justify-center relative">
                    {filteredExpenses.length > 0 ? (
                        <>
                            <Doughnut
                                data={chartData.doughnut}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    cutout: '70%',
                                    plugins: { legend: { position: 'right', labels: { color: textColor, boxWidth: 12 } } }
                                }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-24 md:pr-0 lg:pr-24">
                                <span className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Total</span>
                                <span className="text-xl font-bold text-slate-800 dark:text-white">₹{filteredExpenses.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                            </div>
                        </>
                    ) : (
                        <p className="text-slate-500 text-sm">No expenses logged</p>
                    )}
                </div>
            </div>
        </div>
    );
};
