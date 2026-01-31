import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User {
    id: string;
    username: string;
    password?: string; // Optional when exposing to UI, but used internally
    role: 'admin' | 'user';
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    users: User[]; // List of managed users
    login: (username: string, pass: string) => Promise<boolean>;
    logout: () => void;
    addUser: (user: Omit<User, 'id' | 'role'>) => void;
    updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'role'>>) => void;
    deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default seed user
const DEFAULT_USER = {
    id: 'default-user',
    username: 'joy124',
    password: 'joy@123',
    role: 'user' as const
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('app_users');
        return saved ? JSON.parse(saved) : [DEFAULT_USER];
    });

    // Persist users when they change
    useEffect(() => {
        localStorage.setItem('app_users', JSON.stringify(users));
    }, [users]);

    // Check for persisted session
    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedUser = localStorage.getItem('user');
        if (storedAuth === 'true' && storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (username: string, pass: string): Promise<boolean> => {
        // 1. Check Admin
        if (username === 'Manish1212' && pass === 'Manish@2004') {
            const adminUser: User = { id: 'admin', username: 'Manish1212', role: 'admin' };
            setSession(adminUser);
            return true;
        }

        // 2. Check Users
        const foundUser = users.find(u => u.username === username && u.password === pass);
        if (foundUser) {
            // Don't store password in session
            const { password, ...safeUser } = foundUser;
            setSession(safeUser as User);
            return true;
        }

        return false;
    };

    const setSession = (userData: User) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
    };

    // --- Admin Functions ---

    const addUser = (newUser: Omit<User, 'id' | 'role'>) => {
        const userWithId: User = {
            ...newUser,
            id: crypto.randomUUID(),
            role: 'user'
        };
        setUsers(prev => [...prev, userWithId]);
    };

    const updateUser = (id: string, updates: Partial<Omit<User, 'id' | 'role'>>) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    };

    const deleteUser = (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            users,
            login,
            logout,
            addUser,
            updateUser,
            deleteUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
