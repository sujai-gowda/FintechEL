import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import WalletPanel from '../../components/wallet/WalletPanel';
import { apiFetch } from '../../services/api';
import { formatINR } from '../../constants/currency';
import { LayoutDashboard, Search, Heart, Shield, Activity, MessageSquare, Briefcase } from 'lucide-react';

const NAV = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Find Jobs', path: '/jobs', icon: Search },
  { label: 'My Applications', path: '/jobs/applied', icon: Briefcase },
  { label: 'Wishlist', path: '/jobs?tab=wishlist', icon: Heart },
  { label: 'Escrow', path: '/escrow', icon: Shield },
  { label: 'Messages', path: '/messages', icon: MessageSquare },
  { label: 'History', path: '/history', icon: Activity },
];

const FreelancerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    apiFetch('/jobs', token).then(setJobs).catch(() => {});
    apiFetch('/jobs/wishlist', token).then(setWishlist).catch(() => {});
  }, [token]);

  return (
    <DashboardLayout
      navItems={NAV}
      title={`Welcome, ${user?.name}`}
      subtitle="Discover jobs, earn rewards in ₹, and connect with clients"
      wallet={wallet}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <p className="text-xs text-muted-foreground">Open Jobs</p>
              <p className="text-2xl font-semibold mt-1">{jobs.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-muted-foreground">Wishlisted</p>
              <p className="text-2xl font-semibold mt-1">{wishlist.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-muted-foreground">Potential Earnings</p>
              <p className="text-2xl font-semibold mt-1">{formatINR(jobs.reduce((s, j) => s + j.budget, 0))}</p>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium">Featured Jobs</h2>
              <button type="button" onClick={() => navigate('/jobs')} className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </button>
            </div>
            {jobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open jobs right now. Check back soon.</p>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 4).map((job) => (
                  <div key={job.jobId} className="p-4 border border-border rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-muted-foreground">by {job.clientName} · {job.privacyLevel}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatINR(job.budget)}</span>
                    </div>
                    {job.reward && <p className="text-xs text-muted-foreground mb-2">Reward: {job.reward}</p>}
                    <p className="text-xs text-muted-foreground line-clamp-2">{job.description}</p>
                    <div className="flex gap-2 mt-3">
                      <button type="button" onClick={() => navigate('/jobs')} className="btn-primary h-8 text-xs px-3">
                        Apply Now
                      </button>
                      <button type="button" onClick={() => navigate(`/messages?job=${job.jobId}&to=${job.posterId}`)} className="btn-secondary h-8 text-xs px-3">
                        Message Client
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <WalletPanel onUpdate={setWallet} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FreelancerDashboard;
