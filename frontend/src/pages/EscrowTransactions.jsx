import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { formatINR } from '../constants/currency';
import { ROLES } from '../constants/roles';
import { Shield } from 'lucide-react';

const EscrowTransactions = () => {
  const { token, user } = useAuth();
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [approveId, setApproveId] = useState(null);
  const [pin, setPin] = useState('');

  const fetchEscrows = async () => {
    try {
      const path = user.role === 'Admin' ? '/escrow' : '/escrow/my';
      const data = await apiFetch(path, token);
      setEscrows(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEscrows(); }, [token, user]);

  const submitWork = async (escrowId) => {
    try {
      const data = await apiFetch('/escrow/submit', token, {
        method: 'POST',
        body: JSON.stringify({ escrowId }),
      });
      setMessage(data.message);
      fetchEscrows();
    } catch (err) {
      setError(err.message);
    }
  };

  const approveWork = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/escrow/approve', token, {
        method: 'POST',
        body: JSON.stringify({ escrowId: approveId, pin }),
      });
      setMessage(data.message);
      setApproveId(null);
      setPin('');
      fetchEscrows();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="page-header">
          <h1 className="page-title flex items-center gap-2">
            <Shield size={24} />
            Escrow Transactions
          </h1>
        </div>

        {message && <div className="bg-muted border border-border p-3 rounded-md mb-4 text-sm">{message}</div>}
        {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading escrows...</div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="p-4 text-muted-foreground font-medium">Job</th>
                    <th className="p-4 text-muted-foreground font-medium text-right">Amount</th>
                    <th className="p-4 text-muted-foreground font-medium text-center">Status</th>
                    <th className="p-4 text-muted-foreground font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {escrows.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-muted-foreground">No escrow transactions yet. Funds are locked when a client posts a job.</td>
                    </tr>
                  ) : (
                    escrows.map((escrow) => (
                      <tr key={escrow.escrowId} className="border-b border-border">
                        <td className="p-4 font-mono text-xs">{escrow.jobId.slice(0, 8)}...</td>
                        <td className="p-4 text-right font-medium">{formatINR(escrow.amount)}</td>
                        <td className="p-4 text-center"><span className="badge badge-outline">{escrow.status}</span></td>
                        <td className="p-4 text-right">
                          {user.role === ROLES.FREELANCER && escrow.status === 'HELD' && (
                            <button type="button" onClick={() => submitWork(escrow.escrowId)} className="btn-primary h-8 text-xs px-3">Submit Work</button>
                          )}
                          {user.role === ROLES.CLIENT && escrow.status === 'SUBMITTED' && (
                            <button type="button" onClick={() => setApproveId(escrow.escrowId)} className="btn-primary h-8 text-xs px-3">Approve & Pay</button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {approveId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={approveWork} className="card p-6 w-full max-w-md space-y-4">
            <h3 className="font-semibold">Release Payment</h3>
            <p className="text-sm text-muted-foreground">Enter PIN to release escrow funds to freelancer.</p>
            <input type="password" maxLength={4} placeholder="Wallet PIN" value={pin} onChange={(e) => setPin(e.target.value)} className="input-field" required />
            <div className="flex gap-2">
              <button type="button" onClick={() => { setApproveId(null); setPin(''); }} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Release ₹</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EscrowTransactions;
