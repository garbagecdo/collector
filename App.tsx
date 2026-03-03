
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import OwnerDashboard from './components/OwnerDashboard';
import RiderDashboard from './components/RiderDashboard';
import { UserRole, ServiceRequest, RequestStatus, ServiceType } from './types';

const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: '1',
    type: ServiceType.FOOD,
    status: RequestStatus.PENDING,
    customerName: 'Marcus Aurelius',
    address: '123 Via Sacra, Rome',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    priority: 'high',
    notes: 'Fragile containers'
  },
  {
    id: '2',
    type: ServiceType.LAUNDRY,
    status: RequestStatus.ASSIGNED,
    customerName: 'Cleopatra',
    address: '45 Nile View Blvd',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    priority: 'medium',
    assignedRiderId: 'r1'
  },
  {
    id: '3',
    type: ServiceType.GARBAGE,
    status: RequestStatus.PENDING,
    customerName: 'Benjamin Franklin',
    address: '1776 Independence Sq',
    createdAt: new Date(Date.now() - 500000).toISOString(),
    priority: 'low'
  }
];

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [currentUser, setCurrentUser] = useState<{ name: string; id: string } | null>(null);

  const activeRiderTasks = requests.filter(
    req => req.status === RequestStatus.PENDING || req.status === RequestStatus.ASSIGNED
  ).length;

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === UserRole.OWNER) {
      setCurrentUser({ name: 'Headquarters Admin', id: 'owner_1' });
    } else {
      setCurrentUser({ name: 'Alex Thompson', id: 'r1' });
    }
  };

  const handleAddRequest = (req: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ServiceRequest = {
      ...req,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: RequestStatus.PENDING
    };
    setRequests(prev => [newReq, ...prev]);
  };

  const handleUpdateRequest = (id: string, updates: Partial<ServiceRequest>) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, ...updates } : req));
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

        <div className="w-full max-w-xl space-y-12 relative z-10 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl shadow-2xl mx-auto shadow-indigo-500/50">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">Service Stream</h1>
            <p className="text-slate-400 text-lg">Next-gen logistics coordination for modern businesses.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button 
              onClick={() => handleRoleSelect(UserRole.OWNER)}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-building"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Business Owner</h3>
              <p className="text-slate-400 text-sm">Manage requests, dispatch riders, and track operational metrics.</p>
            </button>

            <button 
              onClick={() => handleRoleSelect(UserRole.RIDER)}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative"
            >
              {activeRiderTasks > 0 && (
                <div className="absolute -top-3 -right-3 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-8 w-8 bg-red-500 items-center justify-center text-white text-xs font-bold border-2 border-slate-900 shadow-lg">
                    {activeRiderTasks}
                  </span>
                </div>
              )}
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-motorcycle"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Service Rider</h3>
              <p className="text-slate-400 text-sm">View assigned tasks, navigate routes, and complete deliveries.</p>
              {activeRiderTasks > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-red-500/30">
                  <i className="fa-solid fa-bell animate-bounce"></i>
                  {activeRiderTasks} active requests
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      role={role} 
      userName={currentUser?.name || ''} 
      onLogout={() => setRole(null)}
    >
      {role === UserRole.OWNER ? (
        <OwnerDashboard 
          requests={requests} 
          onAddRequest={handleAddRequest} 
          onUpdateRequest={handleUpdateRequest}
        />
      ) : (
        <RiderDashboard 
          riderId={currentUser?.id || 'r1'} 
          requests={requests} 
          onUpdateRequest={handleUpdateRequest}
        />
      )}
    </Layout>
  );
};

export default App;
