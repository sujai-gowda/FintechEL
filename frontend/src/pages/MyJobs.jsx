import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { apiFetch } from '../services/api';
import { formatINR } from '../constants/currency';
import { Briefcase, Clock, MessageSquare, UserCheck, Shield, Trash2, LayoutDashboard, PlusCircle, Activity } from 'lucide-react';

const NAV = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Post Job', path: '/jobs/create', icon: PlusCircle },
  { label: 'My Jobs', path: '/jobs/my', icon: Briefcase },
  { label: 'Escrow', path: '/escrow', icon: Shield },
  { label: 'Messages', path: '/messages', icon: MessageSquare },
  { label: 'History', path: '/history', icon: Activity },
];

const MyJobs = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fundJob, setFundJob] = useState(null);
  const [pin, setPin] = useState('');

  const fetchJobs = async () => {
    try {
      const data = await apiFetch('/jobs/myjobs', token);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [token]);

  const acceptApplicant = async (jobId, freelancerId) => {
    setError('');
    try {
      const data = await apiFetch(`/jobs/${jobId}/accept`, token, {
        method: 'POST',
        body: JSON.stringify({ freelancerId }),
      });
      setMessage(data.message);
      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  const fundEscrow = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiFetch('/escrow/fund', token, {
        method: 'POST',
        body: JSON.stringify({ jobId: fundJob.jobId, pin }),
      });
      setMessage(data.message);
      setFundJob(null);
      setPin('');
      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await apiFetch(`/jobs/${id}`, token, { method: 'DELETE' });
      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout navItems={NAV} title="My Posted Jobs" subtitle="Manage applicants, escrow status, and freelancer assignments">
      {message && <div className="bg-muted border border-border p-3 rounded-md mb-4 text-sm">{message}</div>}
      {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center text-muted-foreground text-sm">No jobs posted yet.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.jobId} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                </div>
                <span className="badge badge-default">{job.status}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <span className="font-semibold">{formatINR(job.budget)}</span>
                <span className="text-muted-foreground flex items-center gap-1"><Clock size={12} />{new Date(job.deadline).toLocaleDateString('en-IN')}</span>
                <span className="text-muted-foreground">{job.applicantDetails?.length || 0} applicant(s)</span>
                {job.escrow && (
                  <span className="badge badge-outline gap-1">
                    <Shield size={10} /> Escrow: {job.escrow.status}
                  </span>
                )}
              </div>

              {job.freelancerDetails && (
                <div className="bg-muted p-3 rounded-md mb-4 text-sm">
                  <span className="font-medium">Assigned: </span>{job.freelancerDetails.name} ({job.freelancerDetails.email})
                </div>
              )}

              {job.status === 'OPEN' && job.applicantDetails?.length > 0 && (
                <div className="border-t border-border pt-4 mb-4">
                  <p className="text-sm font-medium mb-3">Applicants</p>
                  <div className="space-y-2">
                    {job.applicantDetails.map((applicant) => (
                      <div key={applicant.id} className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted rounded-md">
                        <div>
                          <p className="text-sm font-medium">{applicant.name}</p>
                          <p className="text-xs text-muted-foreground">{applicant.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/messages?job=${job.jobId}&to=${applicant.id}`)}
                            className="btn-secondary h-8 text-xs gap-1 px-3"
                          >
                            <MessageSquare size={12} /> Message
                          </button>
                          <button
                            type="button"
                            onClick={() => acceptApplicant(job.jobId, applicant.id)}
                            className="btn-primary h-8 text-xs gap-1 px-3"
                          >
                            <UserCheck size={12} /> Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {job.status === 'ASSIGNED' && !job.escrow && (
                  <button type="button" onClick={() => setFundJob(job)} className="btn-primary h-9 gap-1 text-xs">
                    <Shield size={14} /> Fund Escrow ({formatINR(job.budget)})
                  </button>
                )}
                {job.escrow?.status === 'HELD' && job.status === 'ASSIGNED' && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 px-3 py-2 bg-muted rounded-md">
                    <Shield size={12} /> {formatINR(job.budget)} held in escrow — awaiting work submission
                  </span>
                )}
                {job.escrow?.status === 'SUBMITTED' && (
                  <button type="button" onClick={() => navigate('/escrow')} className="btn-primary h-9 gap-1 text-xs">
                    <Shield size={14} /> Review & Approve Work
                  </button>
                )}
                {job.status === 'OPEN' && (
                  <button type="button" onClick={() => handleDelete(job.jobId)} className="btn-destructive h-9 gap-1 text-xs">
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {fundJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={fundEscrow} className="card p-6 w-full max-w-md space-y-4">
            <h3 className="font-semibold">Fund Escrow — {fundJob.title}</h3>
            <p className="text-sm text-muted-foreground">
              Transfer {formatINR(fundJob.budget)} from your wallet to escrow. Enter PIN to confirm.
            </p>
            <input
              type="password"
              maxLength={4}
              placeholder="Wallet PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="input-field"
              required
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => { setFundJob(null); setPin(''); }} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Confirm Transfer</button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyJobs;
