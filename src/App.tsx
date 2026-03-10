import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Dashboard } from './components/Dashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { Login } from './components/Login';
import { Register } from './components/Register';

import { AdminDashboard } from './components/AdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  // Optionally redirect admin accessing user dashboard
  if (user?.role === 'admin') return <Navigate to="/admin" />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col items-center py-4 md:py-10 px-4 transition-colors duration-500 overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none transition-all duration-1000"></div>

      <div className="w-full max-w-5xl relative z-10">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-white/20 dark:border-slate-800/50 shadow-lg gap-4 sticky top-4 z-50 transition-all hover:shadow-xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 dark:from-indigo-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent flex items-center gap-2">
              ExpenseTracker
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
              Welcome back, <span className="font-bold text-slate-700 dark:text-slate-300">{user?.username}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={logout}
              className="px-5 py-2.5 text-sm font-bold tracking-wide text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all hover:-translate-y-0.5 active:translate-y-0 hover:shadow-sm"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="bg-white/40 dark:bg-slate-900/40 rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm border border-white/10 dark:border-slate-800/30 shadow-sm relative overflow-hidden">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ExpenseProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ExpenseProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
