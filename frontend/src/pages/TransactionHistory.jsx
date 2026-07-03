import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { getDashboardNav } from '../constants/dashboardNav';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const TransactionHistory = () => {
  const { token, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path =
      user.role === 'Admin'
        ? '/history/transactions/all'
        : '/history/transactions/my';

    apiFetch(path, token)
      .then((data) => {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTransactions(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, user]);

  return (
    <DashboardLayout
      navItems={getDashboardNav(user.role)}
      title="Transaction History"
      subtitle="Full audit trail of wallet and escrow activity"
    >
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading history...</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="p-4 text-muted-foreground font-medium">Tx ID</th>
                  <th className="p-4 text-muted-foreground font-medium">Date</th>
                  <th className="p-4 text-muted-foreground font-medium">Type</th>
                  <th className="p-4 text-muted-foreground font-medium">From / To</th>
                  <th className="p-4 text-muted-foreground font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-muted-foreground">No transactions found</td>
                  </tr>
                ) : (
                  transactions.map(tx => (
                    <tr key={tx.transactionId} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="p-4 text-foreground font-mono text-xs">{tx.transactionId.substring(0, 8)}...</td>
                      <td className="p-4 text-muted-foreground text-xs">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="p-4">
                        <span className="badge badge-outline">
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4 text-foreground text-xs">
                        {tx.from} <span className="text-muted-foreground mx-1">&rarr;</span> {tx.to}
                      </td>
                      <td className="p-4 text-right font-medium text-foreground">
                        {tx.to === user.id ? '+' : ''}{tx.amount.toLocaleString()} <span className="text-muted-foreground">{tx.currency}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TransactionHistory;
