import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { apiFetch } from '../services/api';
import { formatINR } from '../constants/currency';
import { Briefcase, Clock, MessageSquare, Shield, LayoutDashboard, Search, Activity } from 'lucide-react';

const NAV = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Find Jobs', path: '/jobs', icon: Search },
  { label: 'My Applications', path: '/jobs/applied', icon: Briefcase },
  { label: 'Escrow', path: '/escrow', icon: Shield },
  { label: 'Messages', path: '/messages', icon: MessageSquare },
  { label: 'History', path: '/history', icon: Activity },
];

const MyApplications = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/jobs/applied', token)
      .then(setJobs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout navItems={NAV} title="My Applications" subtitle="Jobs you applied to or were accepted for">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center text-muted-foreground text-sm">
          No applications yet. <button type="button" onClick={() => navigate('/jobs')} className="text-foreground underline ml-1">Browse jobs</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.jobId} className="card p-5 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{job.title}</h3>
                <span className={`badge ${job.applicationStatus === 'ACCEPTED' ? 'badge-default' : 'badge-outline'}`}>
                  {job.applicationStatus}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Client: {job.clientDetails?.name}</p>
              <p className="text-sm text-muted-foreground mb-3 flex-grow line-clamp-2">{job.description}</p>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="font-semibold">{formatINR(job.budget)}</span>
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Clock size={12} /> {new Date(job.deadline).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="flex gap-2 mt-auto">
                <span className="badge badge-secondary">{job.status}</span>
                <button
                  type="button"
                  onClick={() => navigate(`/messages?job=${job.jobId}&to=${job.posterId}`)}
                  className="btn-secondary h-8 text-xs gap-1 ml-auto px-3"
                >
                  <MessageSquare size={12} /> Message Client
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyApplications;
