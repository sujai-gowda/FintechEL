import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet as WalletIcon, Lock, IndianRupee, CreditCard, Smartphone } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { formatINR, CURRENCY } from '../../constants/currency';
import { FINANCE_STEPS } from '../../constants/finance';

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', icon: Smartphone },
  { id: 'CARD', label: 'Debit Card', icon: CreditCard },
  { id: 'NETBANKING', label: 'Net Banking', icon: IndianRupee },
];

const WalletPanel = ({ onUpdate }) => {
  const { token } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('view');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [amount, setAmount] = useState('');
  const [topupPin, setTopupPin] = useState('');
  const [method, setMethod] = useState('UPI');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchWallet = async () => {
    try {
      const data = await apiFetch('/wallets/me', token);
      setWallet(data);
      onUpdate?.(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWallet(); }, [token]);

  const handleSetupPin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/wallets/setup-pin', token, {
        method: 'POST',
        body: JSON.stringify({ pin, confirmPin }),
      });
      setMessage('Wallet PIN set successfully');
      setMode('view');
      setPin('');
      setConfirmPin('');
      fetchWallet();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiFetch('/wallets/add-money', token, {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amount), pin: topupPin, method }),
      });
      setMessage(data.message);
      setAmount('');
      setTopupPin('');
      setMode('view');
      fetchWallet();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="card p-6 text-sm text-muted-foreground">Loading wallet...</div>;

  return (
    <div className="space-y-4">
      <div className="card p-6 bg-primary text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <WalletIcon size={18} />
            <span className="text-sm font-medium">INR Wallet</span>
          </div>
          <span className="badge bg-white/10 text-primary-foreground border-white/20 text-xs">
            {wallet?.hasPin ? 'PIN Secured' : 'Setup PIN'}
          </span>
        </div>
        <p className="text-xs text-primary-foreground/70 mb-1">Available Balance</p>
        <p className="text-3xl font-semibold">{formatINR(wallet?.balance)}</p>
        <div className="flex gap-2 mt-5">
          {!wallet?.hasPin ? (
            <button type="button" onClick={() => setMode('pin')} className="flex-1 bg-white text-primary h-9 rounded-md text-sm font-medium">
              <Lock size={14} className="inline mr-1" /> Set PIN
            </button>
          ) : (
            <button type="button" onClick={() => setMode('add')} className="flex-1 bg-white text-primary h-9 rounded-md text-sm font-medium">
              <IndianRupee size={14} className="inline mr-1" /> Add Money
            </button>
          )}
        </div>
      </div>

      {message && <div className="bg-muted border border-border p-3 rounded-md text-sm">{message}</div>}
      {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md text-sm">{error}</div>}

      {mode === 'pin' && (
        <form onSubmit={handleSetupPin} className="card p-5 space-y-4">
          <h3 className="text-sm font-medium">Create 4-digit Wallet PIN</h3>
          <input type="password" maxLength={4} placeholder="Enter PIN" value={pin} onChange={(e) => setPin(e.target.value)} className="input-field" required />
          <input type="password" maxLength={4} placeholder="Confirm PIN" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} className="input-field" required />
          <div className="flex gap-2">
            <button type="button" onClick={() => setMode('view')} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Save PIN</button>
          </div>
        </form>
      )}

      {mode === 'add' && (
        <form onSubmit={handleAddMoney} className="card p-5 space-y-4">
          <h3 className="text-sm font-medium">Add Money to Wallet ({CURRENCY})</h3>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                className={`p-3 rounded-md border text-xs font-medium flex flex-col items-center gap-1 ${
                  method === id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
          <input type="number" min="1" placeholder="Amount in ₹" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" required />
          <input type="password" maxLength={4} placeholder="Enter wallet PIN" value={topupPin} onChange={(e) => setTopupPin(e.target.value)} className="input-field" required />
          <div className="flex gap-2">
            <button type="button" onClick={() => setMode('view')} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add {amount ? formatINR(amount) : 'Money'}</button>
          </div>
        </form>
      )}

      <div className="card p-5">
        <h3 className="text-sm font-medium mb-4">Payment Workflow</h3>
        <div className="space-y-3">
          {FINANCE_STEPS.map(({ step, title, description }) => (
            <div key={step} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">{step}</span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPanel;
