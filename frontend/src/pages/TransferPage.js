import React, { useState } from 'react';
import './TransferPage.css';

function TransferPage() {
  const [formData, setFormData] = useState({
    to_account: '',
    to_ifsc: '',
    amount: '',
    currency: 'VCASH'
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Login session expired. Please login again.');
      window.location.href = '/login';
      return;
    }

    try {
      const res = await fetch('http://localhost:0702/api/wallet/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Transfer successful! Your new balance is ₹${data.balance}`);
        window.location.href = '/dashboard';
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to connect to the server.');
    }
  };

  return (
    <div className="transfer-container">
      <form className="transfer-form" onSubmit={handleSubmit}>
        <h2>Transfer Funds</h2>
        <input
          name="to_account"
          placeholder="Recipient Account Number"
          onChange={handleChange}
          required
        />
        <input
          name="to_ifsc"
          placeholder="Recipient IFSC Code"
          onChange={handleChange}
          required
        />
        <input
          name="amount"
          placeholder="Enter Amount"
          type="number"
          onChange={handleChange}
          required
        />
        <select name="currency" value={formData.currency} onChange={handleChange}>
          <option value="VCASH">VCASH</option>
          <option value="VINR">VINR</option>
          <option value="VUSD">VUSD</option>
          <option value="VLESS">VLESS</option>
        </select>
        <button type="submit">Transfer</button>
      </form>
    </div>
  );
}

export default TransferPage;
