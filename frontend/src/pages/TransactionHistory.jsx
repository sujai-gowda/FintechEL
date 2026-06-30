import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const TransactionHistory = () => {
  const { token, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = user.role === 'Admin' 
          ? 'http://localhost:5000/api/history/transactions/all'
          : 'http://localhost:5000/api/history/transactions/my';
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          // Sort newest first
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setTransactions(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token, user]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="text-blue-500" />
            Transaction History
          </h1>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading history...</div>
        ) : (
          <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="p-4 text-slate-400 font-medium">Tx ID</th>
                    <th className="p-4 text-slate-400 font-medium">Date</th>
                    <th className="p-4 text-slate-400 font-medium">Type</th>
                    <th className="p-4 text-slate-400 font-medium">From / To</th>
                    <th className="p-4 text-slate-400 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">No transactions found</td>
                    </tr>
                  ) : (
                    transactions.map(tx => (
                      <tr key={tx.transactionId} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                        <td className="p-4 text-slate-300 font-mono text-sm">{tx.transactionId.substring(0, 8)}...</td>
                        <td className="p-4 text-slate-400 text-sm">{new Date(tx.createdAt).toLocaleString()}</td>
                        <td className="p-4">
                          <span className="bg-slate-700 text-blue-300 text-xs px-2 py-1 rounded font-medium border border-slate-600">
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300 text-sm">
                          {tx.from} <span className="text-slate-500 mx-1">&rarr;</span> {tx.to}
                        </td>
                        <td className={`p-4 text-right font-medium ${tx.to === user.id ? 'text-green-400' : 'text-white'}`}>
                          {tx.to === user.id ? '+' : ''}{tx.amount.toLocaleString()} <span className="text-slate-400 text-xs">{tx.currency}</span>
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

export default TransactionHistory;
