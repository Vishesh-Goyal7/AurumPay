import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expired. Please login.');
      window.location.href = '/login';
    } else {
      fetch('https://aurumpay.onrender.com/api/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          setUser(data);
        })
        .catch(err => {
          console.error(err);
          alert('Failed to fetch user data');
          window.location.href = '/login';
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully.');
    navigate('/login');
  };

  if (!user) return <div className="dashboard">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>{user.name}'s Wallet</h1>

      <div className="info-section">
        <div className="info-row">
          <span className="label">Balance:</span>
          <span
            className="value"
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
          >
            {showDetails ? `₹ ${user.balance.toFixed(2)}` : '●●●'}
          </span>
        </div>
        <div className="info-row">
          <span className="label">Account Number:</span>
          <span className="value">{showDetails ? user.account_number : '●●●'}</span>
        </div>
        <div className="info-row">
          <span className="label">IFSC:</span>
          <span className="value">{showDetails ? user.ifsc : '●●●'}</span>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate('/deposit')}>Deposit</button>
        <button onClick={() => navigate('/withdraw')}>Withdraw</button>
        <button onClick={() => navigate('/transfer')}>Transfer</button>
        <button onClick={() => navigate('/history')}>Get Transaction History</button>
      </div>
      <div className="logout-button">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
    
  );
}

export default UserDashboard;
