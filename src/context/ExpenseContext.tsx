import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { API_BASE_URL } from '../config';
import type { Expense } from '../types';
import { useAuth } from './AuthContext';

interface ExpenseContextType {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
    updateExpense: (id: string, expense: Partial<Omit<Expense, 'id'>>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
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
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [filter, setFilter] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const { isAuthenticated } = useAuth();

    // Fetch expenses on login/auth change
    useEffect(() => {
        if (isAuthenticated) {
            fetchExpenses();
        } else {
            setExpenses([]);
        }
    }, [isAuthenticated]);

    const fetchExpenses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/expenses`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setExpenses(data);
            }
        } catch (error) {
            console.error('Failed to fetch expenses', error);
        }
    };

    const addExpense = async (newExpense: Omit<Expense, 'id'>) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newExpense)
            });

            if (res.ok) {
                const savedExpense = await res.json();
                setExpenses((prev) => [savedExpense, ...prev]);
            }
        } catch (error) {
            console.error('Failed to add expense', error);
        }
    };

    const updateExpense = async (id: string, updatedExpense: Partial<Omit<Expense, 'id'>>) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedExpense)
            });

            if (res.ok) {
                const savedExpense = await res.json();
                setExpenses((prev) => prev.map(ex => ex.id === id ? savedExpense : ex));
                await fetchExpenses(); // Refresh from server to ensure data persistence
            } else {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to update expense');
                } else {
                    const text = await res.text();
                    throw new Error(`Server error: ${res.status} ${res.statusText} - ${text}`);
                }
            }
        } catch (error) {
            console.error('Failed to update expense', error);
            throw error;
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setExpenses((prev) => prev.filter((ex) => ex.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete expense', error);
        }
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, updateExpense, deleteExpense, filter, setFilter, totalExpenses }}>
            {children}
        </ExpenseContext.Provider>
    );
};
