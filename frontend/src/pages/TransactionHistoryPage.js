import React, { useEffect, useState } from 'react';
import './TransactionHistoryPage.css';

function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expired. Please log in again.');
      window.location.href = '/login';
      return;
    }

    fetch('http://localhost:0702/api/wallet/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
      })
      .catch(() => alert('Failed to fetch transactions'));
  }, []);

  return (
    <div className="txn-container">
      <h2>Your Transaction History</h2>
      <div className="txn-list">
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map(txn => (
            <div key={txn.txn_id} className="txn-card">
              <div><strong>ID:</strong> {txn.txn_id}</div>
              <div><strong>Date:</strong> {new Date(txn.timestamp).toLocaleString()}</div>
              <div><strong>Type:</strong> <span className="gold-text">{txn.type.toUpperCase()}</span></div>
              <div><strong>Amount:</strong> 
                <span style={{ color: txn.amount < 0 ? '#FF3C3C' : '#2ECC71' }}>
                  {txn.amount < 0 ? `-₹${Math.abs(txn.amount)}` : `+₹${txn.amount}`}
                </span>
              </div>
              <div><strong>Recipient:</strong> {txn.recipient_name} ({txn.recipient_account})</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionHistoryPage;
