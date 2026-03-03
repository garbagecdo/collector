
import React, { useState, useEffect } from 'react';
import { ServiceRequest, ServiceType, RequestStatus, UserRole } from '../types';
import { SERVICE_THEMES, RIDERS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getSmartPrioritization } from '../services/geminiService';

interface OwnerDashboardProps {
  requests: ServiceRequest[];
  onAddRequest: (req: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateRequest: (id: string, updates: Partial<ServiceRequest>) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ requests, onAddRequest, onUpdateRequest }) => {
  const [showModal, setShowModal] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: ServiceType.FOOD,
    customerName: '',
    address: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    notes: ''
  });

  const chartData = [
    { name: 'Laundry', count: requests.filter(r => r.type === ServiceType.LAUNDRY).length, color: '#3b82f6' },
    { name: 'Food', count: requests.filter(r => r.type === ServiceType.FOOD).length, color: '#f97316' },
    { name: 'Garbage', count: requests.filter(r => r.type === ServiceType.GARBAGE).length, color: '#16a34a' },
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await getSmartPrioritization(requests.filter(r => r.status === RequestStatus.PENDING));
    if (result) setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRequest(newRequest);
    setShowModal(false);
    setNewRequest({
      type: ServiceType.FOOD,
      customerName: '',
      address: '',
      priority: 'medium',
      notes: ''
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Dashboard</h2>
          <p className="text-slate-500">Manage your business requests and dispatch riders.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || requests.filter(r => r.status === RequestStatus.PENDING).length === 0}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 flex items-center disabled:opacity-50 transition-all"
          >
            <i className={`fa-solid fa-wand-magic-sparkles mr-2 ${isAnalyzing ? 'animate-spin' : ''}`}></i>
            {isAnalyzing ? 'Analyzing...' : 'AI Dispatch Plan'}
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            New Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">Active</p>
              <p className="text-2xl font-bold text-slate-800">{requests.filter(r => r.status !== RequestStatus.COMPLETED).length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{requests.filter(r => r.status === RequestStatus.PENDING).length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">Completed</p>
              <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === RequestStatus.COMPLETED).length}</p>
            </div>
          </div>

          {/* AI Suggestion Box */}
          {aiAnalysis.length > 0 && (
            <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fa-solid fa-robot text-8xl"></i>
              </div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center">
                  <i className="fa-solid fa-brain mr-2"></i>
                  Gemini Dispatch Insights
                </h3>
                <button onClick={() => setAiAnalysis([])} className="text-white/60 hover:text-white">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="space-y-3">
                {aiAnalysis.slice(0, 3).map((item, idx) => {
                  const req = requests.find(r => r.id === item.id);
                  return (
                    <div key={idx} className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-start gap-3 border border-white/20">
                      <span className="bg-white text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                      <div>
                        <p className="text-sm font-semibold">{req?.customerName} ({req?.type})</p>
                        <p className="text-xs text-white/80">{item.reason}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Request List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Incoming Requests</h3>
              <div className="flex gap-2">
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Updated just now</span>
              </div>
            </div>
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {requests.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <i className="fa-solid fa-calendar-check text-4xl mb-3 opacity-20"></i>
                  <p>All caught up! No active requests.</p>
                </div>
              ) : (
                requests.map(req => (
                  <div key={req.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`${SERVICE_THEMES[req.type].color} w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-md`}>
                        {SERVICE_THEMES[req.type].icon}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{req.customerName}</p>
                        <p className="text-sm text-slate-500 truncate max-w-[150px] sm:max-w-xs">{req.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            req.status === RequestStatus.COMPLETED ? 'bg-green-100 text-green-600' :
                            req.status === RequestStatus.PENDING ? 'bg-amber-100 text-amber-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {req.status}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {req.status === RequestStatus.PENDING && (
                        <select 
                          onChange={(e) => onUpdateRequest(req.id, { assignedRiderId: e.target.value, status: RequestStatus.ASSIGNED })}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          defaultValue=""
                        >
                          <option value="" disabled>Assign Rider</option>
                          {RIDERS.map(rider => <option key={rider.id} value={rider.id}>{rider.name}</option>)}
                        </select>
                      )}
                      {req.assignedRiderId && (
                        <div className="flex items-center gap-2">
                          <img src={RIDERS.find(r => r.id === req.assignedRiderId)?.avatar} className="w-6 h-6 rounded-full border border-slate-200" alt="rider" />
                          <span className="text-xs font-medium text-slate-600 hidden md:block">
                            {RIDERS.find(r => r.id === req.assignedRiderId)?.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Request Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2">System Health</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-700">Riders Online</span>
                <span className="font-bold text-indigo-900">12</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-1.5">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-700">Avg. Response Time</span>
                <span className="font-bold text-indigo-900">14m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <h3 className="text-xl font-bold">New Assistance Request</h3>
              <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(ServiceType).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewRequest(prev => ({ ...prev, type }))}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                        newRequest.type === type 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-400'
                      }`}
                    >
                      {SERVICE_THEMES[type].icon}
                      <span className="text-[10px] font-bold">{SERVICE_THEMES[type].label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label>
                <input 
                  required
                  type="text" 
                  value={newRequest.customerName}
                  onChange={e => setNewRequest(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pickup Address</label>
                <input 
                  required
                  type="text" 
                  value={newRequest.address}
                  onChange={e => setNewRequest(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. 123 Maple St, Unit 4"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
                <select 
                  value={newRequest.priority}
                  onChange={e => setNewRequest(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="low">Low - Standard</option>
                  <option value="medium">Medium - Urgent</option>
                  <option value="high">High - Immediate Action</option>
                </select>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  Broadcast Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
