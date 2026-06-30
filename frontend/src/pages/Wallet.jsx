import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Wallet = () => {
  const { token } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/wallets/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWallet(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [token]);

  if (loading) return <div className="text-white p-8">Loading wallet...</div>;

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-slate-200 flex items-center gap-2">
          <WalletIcon className="text-blue-500" />
          My Wallet
        </h2>
        <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded font-medium">Active</span>
      </div>
      
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <WalletIcon size={120} />
        </div>
        <p className="text-slate-400 text-sm font-medium mb-1">Available Balance</p>
        <h3 className="text-4xl font-bold text-white tracking-tight">
          {wallet ? wallet.balance.toLocaleString() : '0.00'} <span className="text-blue-400 text-2xl">{wallet ? wallet.currency : 'USD'}</span>
        </h3>
        
        <div className="mt-8 flex gap-4">
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded flex items-center justify-center gap-2 transition-colors text-sm font-medium text-slate-200">
            <ArrowUpRight size={16} className="text-green-400" /> Receive
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded flex items-center justify-center gap-2 transition-colors text-sm font-medium text-slate-200">
            <ArrowDownLeft size={16} className="text-red-400" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
