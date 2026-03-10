import React, { useState } from 'react';
import { useAuth, type User } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Users, Plus, Edit2, Trash2, Check, Shield, RefreshCw, Eye, EyeOff, Lock } from 'lucide-react';

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
            // We use undefined to strip it, as TS strict null checks prevent `delete` on non-optional interface props
            (payload as Omit<typeof payload, 'password'> & { password?: string }).password = undefined;
        }

        if (editingUser) {
            await updateUser(editingUser.id, payload);
        } else {
            await addUser(payload);
        }
        resetForm();
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-4 md:p-8 transition-colors duration-500 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-[100px] transition-all duration-1000 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-600/5 blur-[100px] transition-all duration-1000 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="mb-10 flex flex-col md:flex-row justify-between items-center bg-white/70 dark:bg-slate-900/60 p-6 rounded-3xl shadow-lg border border-white/20 dark:border-slate-800/50 backdrop-blur-xl gap-4 sticky top-4 z-40 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                            <Shield size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">Admin Panel</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 tracking-wide uppercase">Manage user access</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={logout}
                            className="px-6 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 border border-red-100 dark:border-red-900/50"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* User List */}
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-white/20 dark:border-slate-800/50 backdrop-blur-md overflow-hidden mb-10 transition-all hover:shadow-2xl">
                    <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                        <h2 className="text-lg font-bold flex items-center gap-3 text-slate-800 dark:text-slate-200">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Users size={20} />
                            </div>
                            Registered Users
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="px-8 py-5">Username</th>
                                    <th className="px-8 py-5">Password</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {users.map((user) => (
                                    <tr key={user.id} className={`group transition-all duration-300 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${editingUser?.id === user.id ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 shadow-inner">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-mono text-slate-500 dark:text-slate-400 text-sm bg-slate-50/30 dark:bg-slate-900/30 group-hover:bg-transparent transition-colors" title={user.role === 'admin' ? 'Hidden' : user.password}>
                                            <div className="flex items-center gap-2">
                                                <Lock size={14} className="text-slate-400" />
                                                {user.role === 'admin' ? '(Hidden Admin)' : (user.password ? `${user.password.substring(0, 10)}...` : '(No Password)')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2.5 text-indigo-600 hover:text-white hover:bg-indigo-500 dark:text-indigo-400 dark:hover:text-white dark:hover:bg-indigo-500 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
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
                                        <td colSpan={3} className="px-8 py-16 text-center text-slate-500 font-medium">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
                                                    <Users size={32} className="text-slate-400" />
                                                </div>
                                                No users found.
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom Form Section */}
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-white/20 dark:border-slate-800/50 backdrop-blur-xl p-8 transition-all hover:shadow-2xl relative overflow-hidden">
                    {/* Decorative form background blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                            {editingUser ? (
                                <>
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-inner">
                                        <Edit2 size={24} />
                                    </div>
                                    <span>Edit User: <span className="text-indigo-600 dark:text-indigo-400">{editingUser.username}</span></span>
                                </>
                            ) : (
                                <>
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-inner">
                                        <Plus size={24} />
                                    </div>
                                    Add New User
                                </>
                            )}
                        </h3>
                        {editingUser && (
                            <button
                                onClick={resetForm}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold shadow-sm"
                            >
                                <RefreshCw size={16} /> Cancel Editing
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-end relative z-10">
                        <div className="space-y-3 group">
                            <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all placeholder:text-slate-400 shadow-inner"
                                placeholder="Enter username"
                            />
                        </div>

                        <div className="space-y-3 group relative">
                            <label className="block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all placeholder:text-slate-400 pr-14 font-mono text-sm shadow-inner"
                                    placeholder={editingUser ? "Leave unchanged to keep current" : "Enter password"}
                                    required={!editingUser}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {editingUser && formData.password.startsWith('$2') && (
                                <p className="absolute -bottom-6 left-1 text-xs font-medium text-slate-400 dark:text-slate-500 w-full truncate border-l-2 border-slate-300 dark:border-slate-700 pl-2">
                                    Displaying hash. Modifying sets new password.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4 lg:pt-0 pt-4">
                            {(!editingUser || editingUser.id !== userData?.id) && (
                                <button
                                    type="submit"
                                    className={`flex-1 px-6 py-3.5 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 ${editingUser
                                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-500/30'
                                        : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-500/30'
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
                                    className="px-6 py-3.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-900/20 dark:hover:bg-red-600 dark:text-red-400 dark:hover:text-white border border-red-200 dark:border-red-900/50 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5 active:translate-y-0"
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
