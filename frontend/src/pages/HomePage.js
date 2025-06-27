import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to AurumPay</h1>

      <div className="home-buttons">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
      </div>

      <div className="about-section">
        <h2>About the Project</h2>
        <p>
          AurumPay is a secure digital wallet system allowing users to <strong>deposit, withdraw, and transfer</strong> funds in four supported currencies: <strong>VCASH, VINR, VUSD, and VLESS</strong>. All amounts are converted to VCASH before processing.
        </p>
        <p>
          <strong>Currency Values:</strong><br />
          1 VCASH = 10 VINR = 50 VUSD = 100 VLESS
        </p>
        <p>
          <strong>Key Features:</strong><br />
          - JWT-based authentication and secure sessions<br />
          - Auto-generated 5-digit account numbers and 6-char IFSC codes<br />
          - Role-based access (user & admin)<br />
          - Transaction history with fraud detection logs<br />
          - Admin APIs for balance summary, flagged transactions, and more
        </p>
        <p>
          <strong>Fraud Detection Rules:</strong><br />
          - More than 3 transactions in under a minute<br />
          - Withdrawals/transfers over 80% of balance<br />
          - Deposits over ₹50,000 in accounts less than 1 hour old
        </p>
      </div>
    </div>
  );
}

export default HomePage;
