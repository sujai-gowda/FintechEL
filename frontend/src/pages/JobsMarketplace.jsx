import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { apiFetch } from '../services/api';
import { formatINR } from '../constants/currency';
import { Heart, MessageSquare, Send, Shield, Clock, Lock } from 'lucide-react';
import { LayoutDashboard, Search, Activity, Briefcase } from 'lucide-react';

const NAV = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Find Jobs', path: '/jobs', icon: Search },
  { label: 'My Applications', path: '/jobs/applied', icon: Briefcase },
  { label: 'Escrow', path: '/escrow', icon: Shield },
  { label: 'Messages', path: '/messages', icon: MessageSquare },
  { label: 'History', path: '/history', icon: Activity },
];

const JobsMarketplace = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showWishlist = searchParams.get('tab') === 'wishlist';
  const [jobs, setJobs] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allJobs, wishlist] = await Promise.all([
        showWishlist ? apiFetch('/jobs/wishlist', token) : apiFetch('/jobs', token),
        apiFetch('/jobs/wishlist', token),
      ]);
      setJobs(allJobs);
      setWishlistIds(new Set(wishlist.map((j) => j.jobId)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token, showWishlist]);

  const toggleWishlist = async (jobId) => {
    try {
      const data = await apiFetch('/jobs/wishlist', token, {
        method: 'POST',
        body: JSON.stringify({ jobId }),
      });
      setMessage(data.message);
      fetchData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const applyJob = async (jobId) => {
    try {
      const data = await apiFetch(`/jobs/${jobId}/apply`, token, { method: 'POST' });
      setMessage(data.message);
      setJobs((prev) => prev.filter((j) => j.jobId !== jobId));
      setTimeout(() => navigate('/jobs/applied'), 1500);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <DashboardLayout
      navItems={NAV}
      title={showWishlist ? 'My Wishlist' : 'Find Jobs'}
      subtitle="Apply to jobs — they move to My Applications and leave this list"
    >
      {message && <div className="bg-muted border border-border p-3 rounded-md mb-4 text-sm">{message}</div>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center text-muted-foreground text-sm">
          {showWishlist ? 'No wishlisted jobs.' : 'No open jobs available. Check My Applications for jobs you applied to.'}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.jobId} className="card p-5 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-xs text-muted-foreground">by {job.clientName}</p>
                </div>
                <button type="button" onClick={() => toggleWishlist(job.jobId)} className="p-2 hover:bg-muted rounded-md">
                  <Heart size={18} className={wishlistIds.has(job.jobId) ? 'fill-primary text-primary' : 'text-muted-foreground'} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge badge-default">{formatINR(job.budget)}</span>
                {job.reward && <span className="badge badge-secondary">+ {job.reward}</span>}
                <span className="badge badge-outline flex items-center gap-1"><Lock size={10} /> {job.privacyLevel}</span>
              </div>

              <p className="text-sm text-muted-foreground mb-3 flex-grow line-clamp-3">{job.description}</p>

              <div className="flex items-center text-xs text-muted-foreground gap-1 mb-4">
                <Clock size={12} /> Deadline: {new Date(job.deadline).toLocaleDateString('en-IN')}
              </div>

              <div className="flex gap-2 mt-auto">
                <button type="button" onClick={() => applyJob(job.jobId)} className="btn-primary flex-1 h-9 gap-1 text-xs">
                  <Send size={14} /> Apply
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/messages?job=${job.jobId}&to=${job.posterId}`)}
                  className="btn-secondary flex-1 h-9 gap-1 text-xs"
                >
                  <MessageSquare size={14} /> Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default JobsMarketplace;
