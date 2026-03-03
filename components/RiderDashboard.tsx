
import React, { useState, useEffect } from 'react';
import { ServiceRequest, RequestStatus, ServiceType } from '../types';
import { SERVICE_THEMES } from '../constants';
import { generateRiderBriefing } from '../services/geminiService';

interface RiderDashboardProps {
  riderId: string;
  requests: ServiceRequest[];
  onUpdateRequest: (id: string, updates: Partial<ServiceRequest>) => void;
}

const RiderDashboard: React.FC<RiderDashboardProps> = ({ riderId, requests, onUpdateRequest }) => {
  const myRequests = requests.filter(r => r.assignedRiderId === riderId && r.status !== RequestStatus.COMPLETED);
  const completedCount = requests.filter(r => r.assignedRiderId === riderId && r.status === RequestStatus.COMPLETED).length;
  const [briefings, setBriefings] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchBriefings = async () => {
      const pendingBriefs = myRequests.filter(r => !briefings[r.id]);
      for (const req of pendingBriefs) {
        const brief = await generateRiderBriefing(req);
        setBriefings(prev => ({ ...prev, [req.id]: brief }));
      }
    };
    fetchBriefings();
  }, [myRequests]);

  const handleStatusChange = (id: string, currentStatus: RequestStatus) => {
    let nextStatus = currentStatus;
    if (currentStatus === RequestStatus.ASSIGNED) nextStatus = RequestStatus.PICKED_UP;
    else if (currentStatus === RequestStatus.PICKED_UP) nextStatus = RequestStatus.COMPLETED;
    onUpdateRequest(id, { status: nextStatus });
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Today's Route</h2>
          <p className="text-indigo-100 text-sm">You have {myRequests.length} active tasks.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{completedCount}</p>
          <p className="text-xs font-semibold uppercase opacity-70">Done Today</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-lg px-2">Assigned Pickups</h3>
        {myRequests.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-slate-100">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-mug-hot text-slate-300 text-2xl"></i>
            </div>
            <h4 className="font-bold text-slate-700">All set for now!</h4>
            <p className="text-slate-400 text-sm">New requests will appear here once assigned.</p>
          </div>
        ) : (
          myRequests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden group">
              <div className="p-4 flex gap-4">
                <div className={`${SERVICE_THEMES[req.type].color} w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg`}>
                  {SERVICE_THEMES[req.type].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-lg truncate">{req.customerName}</h4>
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${
                      req.status === RequestStatus.PICKED_UP ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {req.status === RequestStatus.ASSIGNED ? 'Assigned' : 'In Transit'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">
                    <i className="fa-solid fa-location-dot mr-1 text-slate-400"></i>
                    {req.address}
                  </p>
                  
                  {briefings[req.id] && (
                    <div className="mt-3 bg-slate-50 rounded-lg p-2.5 border-l-4 border-indigo-400">
                      <p className="text-xs text-slate-600 italic">
                        <i className="fa-solid fa-robot mr-2 text-indigo-500"></i>
                        {briefings[req.id]}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => handleStatusChange(req.id, req.status)}
                      className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                      {req.status === RequestStatus.ASSIGNED ? (
                        <>
                          <i className="fa-solid fa-truck-pickup"></i>
                          Start Pickup
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check-circle"></i>
                          Mark Complete
                        </>
                      )}
                    </button>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(req.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                    >
                      <i className="fa-solid fa-directions text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
