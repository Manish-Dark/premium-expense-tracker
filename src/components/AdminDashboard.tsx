import React, { useState } from 'react';
import { useAuth, type User } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Users, Plus, Edit2, Trash2, Check, Shield, RefreshCw, Eye, EyeOff } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const { user: userData, users, addUser, updateUser, deleteUser, logout } = useAuth();
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const resetForm = () => {
        setFormData({ username: '', password: '' });
        setEditingUser(null);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({ username: user.username, password: user.role === 'admin' ? '' : (user.password || '') });
        // Optional: Scroll to bottom to see form
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this user and all their expenses?')) {
            await deleteUser(id);
            resetForm();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = { ...formData };

        // If password matches the existing hash (unchanged), don't send it
        if (editingUser && payload.password === editingUser.password) {
            delete (payload as any).password;
        }

        if (editingUser) {
            await updateUser(editingUser.id, payload);
        } else {
            await addUser(payload);
        }
        resetForm();
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Shield size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Admin Panel</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage user access</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* User List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Users size={20} />
                            Registered Users
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Password</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {users.map((user) => (
                                    <tr key={user.id} className={`group transition-colors ${editingUser?.id === user.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                                        <td className="px-6 py-4 font-medium">{user.username}</td>
                                        <td className="px-6 py-4 font-mono text-slate-500 text-xs" title={user.role === 'admin' ? 'Hidden' : user.password}>
                                            {user.role === 'admin' ? '(Hidden)' : (user.password ? `${user.password.substring(0, 10)}...` : '(No Password)')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom Form Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            {editingUser ? (
                                <>
                                    <Edit2 size={24} className="text-indigo-500" />
                                    Edit User: <span className="text-indigo-600 dark:text-indigo-400">{editingUser.username}</span>
                                </>
                            ) : (
                                <>
                                    <Plus size={24} className="text-emerald-500" />
                                    Add New User
                                </>
                            )}
                        </h3>
                        {editingUser && (
                            <button
                                onClick={resetForm}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 text-sm font-medium"
                            >
                                <RefreshCw size={16} /> Cancel Editing
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                placeholder="Enter username"
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 pr-12 font-mono text-sm"
                                    placeholder={editingUser ? "Leave unchanged to keep current" : "Enter password"}
                                    required={!editingUser}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {editingUser && formData.password.startsWith('$2') && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Displaying encrypted hash from database. Modifying this will set a new password.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            {(!editingUser || editingUser.id !== userData?.id) && (
                                <button
                                    type="submit"
                                    className={`flex-1 px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${editingUser
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                                        }`}
                                >
                                    <Check size={20} />
                                    {editingUser ? 'Update User' : 'Add User'}
                                </button>
                            )}

                            {editingUser && editingUser.id !== userData?.id && (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(editingUser.id)}
                                    className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    title="Delete this user"
                                >
                                    <Trash2 size={20} />
                                    Delete
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
