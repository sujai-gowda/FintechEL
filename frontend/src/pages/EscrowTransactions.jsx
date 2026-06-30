import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const EscrowTransactions = () => {
  const { token, user } = useAuth();
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEscrows = async () => {
      try {
        const res = await fetch(
          user.role === 'Admin' ? 'http://localhost:5000/api/escrow' : 'http://localhost:5000/api/escrow/my',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setEscrows(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEscrows();
  }, [token, user]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="text-blue-500" />
            Escrow Transactions
          </h1>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading escrows...</div>
        ) : (
          <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="p-4 text-slate-400 font-medium">Escrow ID</th>
                    <th className="p-4 text-slate-400 font-medium">Job ID</th>
                    <th className="p-4 text-slate-400 font-medium text-right">Amount</th>
                    <th className="p-4 text-slate-400 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {escrows.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500">No escrow transactions found</td>
                    </tr>
                  ) : (
                    escrows.map(escrow => (
                      <tr key={escrow.escrowId} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                        <td className="p-4 text-slate-300 font-mono text-sm">{escrow.escrowId.substring(0, 8)}...</td>
                        <td className="p-4 text-blue-400 text-sm">{escrow.jobId.substring(0, 8)}...</td>
                        <td className="p-4 text-right font-medium text-white">
                          {escrow.amount.toLocaleString()} <span className="text-slate-400 text-xs">{escrow.currency}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            escrow.status === 'HELD' ? 'bg-yellow-900/50 text-yellow-500 border border-yellow-900' :
                            escrow.status === 'RELEASED' ? 'bg-green-900/50 text-green-400 border border-green-900' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {escrow.status}
                          </span>
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
    </div>
  );
};

export default EscrowTransactions;
