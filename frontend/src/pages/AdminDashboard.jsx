import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { formatINR } from '../constants/currency';
import { ROLES } from '../constants/roles';
import { LogOut, Users, Briefcase, IndianRupee, MessageSquare, Shield } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('clients');
  const [assignForm, setAssignForm] = useState({ userId: '', amount: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      const [usersData, walletsData, statsData] = await Promise.all([
        fetch(`${API_BASE}/users`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
        fetch(`${API_BASE}/wallets`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
        apiFetch('/admin/stats', token),
      ]);
      setUsers(usersData);
      setWallets(walletsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAll(); }, [token]);

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch(`${API_BASE}/wallets/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: assignForm.userId, amount: assignForm.amount, currency: 'INR' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFreeze = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/freeze`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const clients = users.filter((u) => u.role === ROLES.CLIENT);
  const freelancers = users.filter((u) => u.role === ROLES.FREELANCER);
  const displayed = activeTab === 'clients' ? clients : freelancers;

  const statCards = stats ? [
    { label: 'Total Clients', value: stats.clients, icon: Users },
    { label: 'Total Freelancers', value: stats.freelancers, icon: Briefcase },
    { label: 'Platform Balance', value: formatINR(stats.totalBalance), icon: IndianRupee },
    { label: 'Open Jobs', value: stats.openJobs, icon: Shield },
    { label: 'Total Job Value', value: formatINR(stats.totalJobValue), icon: IndianRupee },
    { label: 'Messages', value: stats.totalMessages, icon: MessageSquare },
  ] : [];

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <header className="page-header">
          <div>
            <h1 className="page-title">Admin Control Centre</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitor clients, freelancers, INR wallets & platform activity</p>
          </div>
          <button onClick={logout} className="btn-secondary gap-2"><LogOut size={16} /> Logout</button>
        </header>

        {message && <div className="bg-muted border border-border p-3 rounded-md mb-4 text-sm">{message}</div>}
        {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-semibold mt-1">{value}</p>
                </div>
                <Icon size={20} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-sm font-medium mb-4">Assign INR Balance</h2>
            <form onSubmit={handleAssign} className="space-y-4">
              <select className="input-field" value={assignForm.userId} onChange={(e) => setAssignForm({ ...assignForm, userId: e.target.value })} required>
                <option value="">Select user</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
              <input type="number" className="input-field" placeholder="Amount in ₹" value={assignForm.amount} onChange={(e) => setAssignForm({ ...assignForm, amount: e.target.value })} required />
              <button type="submit" className="btn-primary w-full">Assign Balance</button>
            </form>
          </div>

          <div className="card p-6">
            <div className="flex gap-2 mb-4">
              {['clients', 'freelancers'].map((tab) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {tab} ({tab === 'clients' ? clients.length : freelancers.length})
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left text-muted-foreground">Name</th>
                    <th className="pb-2 text-left text-muted-foreground">Email</th>
                    <th className="pb-2 text-left text-muted-foreground">Status</th>
                    <th className="pb-2 text-right text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((u) => (
                    <tr key={u.id} className="border-b border-border">
                      <td className="py-2">{u.name}</td>
                      <td className="py-2 text-muted-foreground">{u.email}</td>
                      <td className="py-2"><span className="badge badge-secondary">{u.status}</span></td>
                      <td className="py-2 text-right">
                        <button type="button" onClick={() => handleFreeze(u.id)} className="btn-destructive h-7 text-xs px-2">
                          {u.status === 'FROZEN' ? 'Unfreeze' : 'Freeze'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card p-6 mt-6">
          <h2 className="text-sm font-medium mb-4">All Wallets (INR)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-muted-foreground">User</th>
                <th className="pb-2 text-right text-muted-foreground">Balance</th>
                <th className="pb-2 text-left text-muted-foreground">PIN</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((w) => (
                <tr key={w.id} className="border-b border-border">
                  <td className="py-2">{w.userId}</td>
                  <td className="py-2 text-right font-medium">{formatINR(w.balance)}</td>
                  <td className="py-2">{w.hasPin ? 'Secured' : 'Not set'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
