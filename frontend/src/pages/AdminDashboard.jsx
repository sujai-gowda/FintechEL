import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const [wallets, setWallets] = useState([]);
  const [assignForm, setAssignForm] = useState({ userId: '', currency: 'USD', amount: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchWallets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/wallets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWallets(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [token]);

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/wallets/assign', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(assignForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
      fetchWallets();
      setAssignForm({ ...assignForm, amount: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Admin Dashboard</h1>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors">
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-red-900 shadow-xl">
            <h2 className="text-xl mb-6 text-red-400">Assign Balance</h2>
            {message && <div className="bg-green-900 text-green-200 p-3 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4">{error}</div>}
            
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">User ID</label>
                <select 
                  className="w-full bg-slate-700 border border-slate-600 rounded p-2 focus:border-red-500 focus:outline-none"
                  value={assignForm.userId}
                  onChange={e => setAssignForm({...assignForm, userId: e.target.value})}
                  required
                >
                  <option value="">Select User</option>
                  <option value="user1">User 1</option>
                  <option value="user2">User 2</option>
                  <option value="user3">User 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Currency</label>
                <select 
                  className="w-full bg-slate-700 border border-slate-600 rounded p-2 focus:border-red-500 focus:outline-none"
                  value={assignForm.currency}
                  onChange={e => setAssignForm({...assignForm, currency: e.target.value})}
                  required
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BTC">BTC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Amount</label>
                <input 
                  type="number"
                  className="w-full bg-slate-700 border border-slate-600 rounded p-2 focus:border-red-500 focus:outline-none"
                  value={assignForm.amount}
                  onChange={e => setAssignForm({...assignForm, amount: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition-colors">
                Assign Balance
              </button>
            </form>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl">
            <h2 className="text-xl mb-6 text-slate-200">All User Wallets</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="pb-3 text-slate-400 font-medium">User ID</th>
                    <th className="pb-3 text-slate-400 font-medium">Currency</th>
                    <th className="pb-3 text-slate-400 font-medium text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-4 text-center text-slate-500">No wallets found</td>
                    </tr>
                  ) : (
                    wallets.map(w => (
                      <tr key={w.id} className="border-b border-slate-700/50">
                        <td className="py-3 text-slate-300">{w.userId}</td>
                        <td className="py-3 text-slate-300">{w.currency}</td>
                        <td className="py-3 text-right font-medium text-green-400">
                          {w.balance.toLocaleString()} {w.currency}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
