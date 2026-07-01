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

  if (loading) return <div className="card p-6 text-muted-foreground text-sm">Loading wallet...</div>;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
          <WalletIcon size={16} />
          My Wallet
        </h2>
        <span className="badge badge-secondary">Active</span>
      </div>
      
      <div className="bg-muted p-5 rounded-md border border-border">
        <p className="text-muted-foreground text-xs font-medium mb-1">Available Balance</p>
        <h3 className="text-3xl font-semibold text-foreground tracking-tight">
          {wallet ? wallet.balance.toLocaleString() : '0.00'}{' '}
          <span className="text-muted-foreground text-lg">{wallet ? wallet.currency : 'USD'}</span>
        </h3>
        
        <div className="mt-6 flex gap-3">
          <button className="btn-secondary flex-1 gap-2 h-9">
            <ArrowUpRight size={14} /> Receive
          </button>
          <button className="btn-secondary flex-1 gap-2 h-9">
            <ArrowDownLeft size={14} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
