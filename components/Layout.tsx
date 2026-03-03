
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onLogout, userName }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <i className="fa-solid fa-truck-fast text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">ServiceStream</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700">{userName}</p>
              <p className="text-xs text-slate-500 capitalize">{role.toLowerCase()}</p>
            </div>
            <button 
              onClick={onLogout}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket mr-1"></i>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 ServiceStream Logistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
