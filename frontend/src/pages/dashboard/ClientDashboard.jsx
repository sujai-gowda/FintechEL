import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import WalletPanel from '../../components/wallet/WalletPanel';
import { apiFetch } from '../../services/api';
import { formatINR } from '../../constants/currency';
import { CLIENT_NAV } from '../../constants/dashboardNav';

const NAV = CLIENT_NAV;

const ClientDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    apiFetch('/jobs/myjobs', token).then(setJobs).catch(() => {});
  }, [token]);

  return (
    <DashboardLayout
      navItems={NAV}
      title={`Namaste, ${user?.name}`}
      subtitle="Post projects, fund escrow in ₹, and manage secure payments"
      wallet={wallet}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <p className="text-xs text-muted-foreground">Posted Jobs</p>
              <p className="text-2xl font-semibold mt-1">{jobs.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-muted-foreground">Open Jobs</p>
              <p className="text-2xl font-semibold mt-1">{jobs.filter((j) => j.status === 'OPEN').length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-semibold mt-1">{formatINR(jobs.reduce((s, j) => s + j.budget, 0))}</p>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium">Quick Actions</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <button type="button" onClick={() => navigate('/jobs/create')} className="btn-primary h-11">
                Post a New Job
              </button>
              <button type="button" onClick={() => navigate('/jobs/my')} className="btn-secondary h-11">
                Manage My Jobs
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-medium mb-4">Recent Jobs</h2>
            {jobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No jobs posted yet. Create your first project.</p>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.jobId} className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <div>
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.privacyLevel} · {job.status}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatINR(job.budget)}</span>
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

export default ClientDashboard;
