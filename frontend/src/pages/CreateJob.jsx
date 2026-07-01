import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { apiFetch } from '../services/api';
import { PRIVACY_LEVELS } from '../constants/finance';
import { LayoutDashboard, Briefcase, PlusCircle, Shield, Activity, MessageSquare } from 'lucide-react';

const NAV = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Post Job', path: '/jobs/create', icon: PlusCircle },
  { label: 'My Jobs', path: '/jobs/my', icon: Briefcase },
  { label: 'Escrow', path: '/escrow', icon: Shield },
  { label: 'Messages', path: '/messages', icon: MessageSquare },
  { label: 'History', path: '/history', icon: Activity },
];

const CreateJob = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', budget: '', deadline: '', pin: '',
    jobLinks: '', projectLinks: '', privacyLevel: 'PUBLIC',
    securityNotes: '', reward: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiFetch('/jobs', token, {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          jobLinks: form.jobLinks.split('\n').filter(Boolean),
          projectLinks: form.projectLinks.split('\n').filter(Boolean),
        }),
      });
      setSuccess(data.message || 'Job posted and funds locked in escrow!');
      setTimeout(() => navigate('/jobs/my'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout navItems={NAV} title="Post a Job" subtitle="Set your budget — funds are locked in escrow when you post">
      <div className="max-w-2xl">
        {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
        {success && <div className="bg-muted border border-border p-3 rounded-md mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Job Title</label>
            <input className="input-field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Build fintech dashboard" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea className="input-field min-h-[100px]" required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Full project scope and deliverables..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Budget (₹ INR)</label>
              <input type="number" className="input-field" required min="1" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="25000" />
              <p className="text-xs text-muted-foreground mt-1">This amount will be held in escrow immediately.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Deadline</label>
              <input type="date" className="input-field" required value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Wallet PIN</label>
            <input
              type="password"
              maxLength={4}
              className="input-field"
              required
              value={form.pin}
              onChange={(e) => setForm({ ...form, pin: e.target.value })}
              placeholder="4-digit PIN to confirm escrow lock"
            />
            <p className="text-xs text-muted-foreground mt-1">Required to transfer budget from your wallet into escrow.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Bonus / Reward (optional)</label>
            <input className="input-field" value={form.reward} onChange={(e) => setForm({ ...form, reward: e.target.value })} placeholder="e.g. ₹5,000 bonus for early delivery" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Job Links (one per line)</label>
            <textarea className="input-field" rows={2} value={form.jobLinks} onChange={(e) => setForm({ ...form, jobLinks: e.target.value })} placeholder="https://figma.com/..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Project Links (one per line)</label>
            <textarea className="input-field" rows={2} value={form.projectLinks} onChange={(e) => setForm({ ...form, projectLinks: e.target.value })} placeholder="https://github.com/..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Privacy & Security Level</label>
            <div className="grid sm:grid-cols-3 gap-2">
              {PRIVACY_LEVELS.map(({ value, label, description }) => (
                <label key={value} className={`p-3 rounded-md border cursor-pointer text-sm ${form.privacyLevel === value ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <input type="radio" name="privacy" value={value} checked={form.privacyLevel === value} onChange={() => setForm({ ...form, privacyLevel: value })} className="sr-only" />
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Security & NDA Notes</label>
            <textarea className="input-field" rows={2} value={form.securityNotes} onChange={(e) => setForm({ ...form, securityNotes: e.target.value })} placeholder="Confidential data handling, IP ownership, NDA requirements..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Post Job</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateJob;
