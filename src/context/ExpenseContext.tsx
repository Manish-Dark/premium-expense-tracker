import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Expense } from '../types';

interface ExpenseContextType {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
    deleteExpense: (id: string) => void;
    filter: 'weekly' | 'monthly' | 'yearly';
    setFilter: (filter: 'weekly' | 'monthly' | 'yearly') => void;
    totalExpenses: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpense = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpense must be used within an ExpenseProvider');
    }
    return context;
};

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
    const [expenses, setExpenses] = useState<Expense[]>(() => {
        const saved = localStorage.getItem('expenses');
        return saved ? JSON.parse(saved) : [];
    });

    const [filter, setFilter] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    const addExpense = (newExpense: Omit<Expense, 'id' | 'date'>) => {
        const expense: Expense = {
            ...newExpense,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
        };
        setExpenses((prev) => [expense, ...prev]);
    };

    const deleteExpense = (id: string) => {
        setExpenses((prev) => prev.filter((ex) => ex.id !== id));
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, filter, setFilter, totalExpenses }}>
            {children}
        </ExpenseContext.Provider>
    );
};
