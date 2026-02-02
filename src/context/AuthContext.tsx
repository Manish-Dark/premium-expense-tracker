import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import type { ReactNode } from 'react';

export interface User {
    id: string;
    username: string;
    role: 'admin' | 'user';
    password?: string; // Optional: specific to admin view
    createdAt?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    users: User[]; // List of managed users (admin only)
    login: (username: string, pass: string) => Promise<boolean>;
    logout: () => void;
    addUser: (user: Omit<User, 'id' | 'role'>) => Promise<void>;
    updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'role'>>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    // Check for persisted session and validate token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${API_BASE_URL}/api/auth/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Invalid token');
                })
                .then((userData: User) => {
                    setIsAuthenticated(true);
                    setUser(userData);
                })
                .catch(() => {
                    logout(); // Invalid token
                });
        }
    }, []);

    // Load users if admin
    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            fetchUsers();
        } else {
            setUsers([]);
        }
    }, [isAuthenticated, user]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const login = async (username: string, pass: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password: pass })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                setIsAuthenticated(true);
                setUser(data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error', error);
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUsers([]);
        localStorage.removeItem('token');
    };

    // --- Admin Functions ---

    const addUser = async (newUser: any) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });

            if (res.ok) {
                await fetchUsers(); // Refresh list
            } else {
                alert('Failed to create user');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateUser = async (id: string, updates: any) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                await fetchUsers();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteUser = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                await fetchUsers();
            } else {
                const err = await res.json();
                alert(err.message || 'Failed to delete');
            }
        } catch (error) {
            console.error(error);
        }
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
