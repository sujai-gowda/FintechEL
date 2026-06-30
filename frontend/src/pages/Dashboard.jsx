import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Wallet from './Wallet';
import { Briefcase, PlusCircle, Search, Shield, Activity, LogOut, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 text-white p-6 md:p-10 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 animate-fade-in">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Welcome back, <span className="text-brand-400">{user?.email?.split('@')[0] || 'User'}</span>
            </h1>
            <p className="text-slate-400">Here's what's happening with your account today.</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-dark-800/80 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-dark-700 hover:border-red-500/50 px-5 py-2.5 rounded-xl transition-all font-medium shadow-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <button 
            onClick={() => navigate('/jobs')}
            className="glass hover:bg-dark-700/80 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all transform hover:-translate-y-1 hover:border-brand-500/30 group"
          >
            <div className="w-12 h-12 bg-dark-700 group-hover:bg-brand-500/20 rounded-full flex items-center justify-center text-slate-300 group-hover:text-brand-400 transition-colors">
              <Search size={22} />
            </div>
            <span className="font-medium text-sm">Browse Jobs</span>
          </button>
          
          <button 
            onClick={() => navigate('/jobs/my')}
            className="glass hover:bg-dark-700/80 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all transform hover:-translate-y-1 hover:border-brand-500/30 group"
          >
             <div className="w-12 h-12 bg-dark-700 group-hover:bg-brand-500/20 rounded-full flex items-center justify-center text-slate-300 group-hover:text-brand-400 transition-colors">
              <Briefcase size={22} />
            </div>
            <span className="font-medium text-sm">My Jobs</span>
          </button>
          
          <button 
            onClick={() => navigate('/escrow')}
            className="glass hover:bg-dark-700/80 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all transform hover:-translate-y-1 hover:border-brand-500/30 group"
          >
             <div className="w-12 h-12 bg-dark-700 group-hover:bg-brand-500/20 rounded-full flex items-center justify-center text-slate-300 group-hover:text-brand-400 transition-colors">
              <Shield size={22} />
            </div>
            <span className="font-medium text-sm">Escrow</span>
          </button>
          
          <button 
            onClick={() => navigate('/history')}
            className="glass hover:bg-dark-700/80 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all transform hover:-translate-y-1 hover:border-brand-500/30 group"
          >
             <div className="w-12 h-12 bg-dark-700 group-hover:bg-brand-500/20 rounded-full flex items-center justify-center text-slate-300 group-hover:text-brand-400 transition-colors">
              <Activity size={22} />
            </div>
            <span className="font-medium text-sm">History</span>
          </button>
          
          <button 
            onClick={() => navigate('/jobs/create')}
            className="col-span-2 md:col-span-1 glass bg-gradient-to-br from-brand-900/40 to-brand-600/20 hover:from-brand-600/40 hover:to-brand-500/30 border-brand-500/30 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all transform hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 bg-brand-500/20 group-hover:bg-brand-500/40 rounded-full flex items-center justify-center text-brand-300 group-hover:text-white transition-colors">
              <PlusCircle size={22} />
            </div>
            <span className="font-medium text-sm text-brand-50">Post Job</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="glass rounded-2xl p-1">
              <Wallet />
            </div>
            
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px]"></div>
              <h2 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                Account Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-dark-900/50 p-3 rounded-xl border border-dark-700/50">
                  <span className="text-slate-400 text-sm">Email</span>
                  <span className="text-white font-medium text-sm">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center bg-dark-900/50 p-3 rounded-xl border border-dark-700/50">
                  <span className="text-slate-400 text-sm">Role</span>
                  <span className="px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-semibold tracking-wide uppercase border border-brand-500/20">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-brand-500 rounded-full"></div>
                Quick Stats
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-dark-900/50 p-6 rounded-xl border border-dark-700/50 flex items-center justify-between group hover:border-brand-500/30 transition-colors">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-1">Active Jobs</h3>
                    <p className="text-4xl font-bold text-white group-hover:text-brand-400 transition-colors">0</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center text-slate-500 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-all">
                     <Briefcase size={20} />
                  </div>
                </div>
                
                <div className="bg-dark-900/50 p-6 rounded-xl border border-dark-700/50 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-1">Pending Escrows</h3>
                    <p className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">0</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all">
                     <Shield size={20} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass p-6 rounded-2xl min-h-[300px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                  Recent Activity
                </h2>
                <button className="text-sm text-slate-400 hover:text-white flex items-center transition-colors">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center bg-dark-900/30 rounded-xl border border-dark-700/30 border-dashed">
                <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4 text-slate-600">
                  <Activity size={24} />
                </div>
                <p className="text-slate-400 font-medium">No recent activity found</p>
                <p className="text-slate-500 text-sm mt-1">Your latest transactions will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
