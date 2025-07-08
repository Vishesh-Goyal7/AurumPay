import React, { useState } from 'react';
import './DepositPage.css';

function DepositPage() {
  const [formData, setFormData] = useState({ amount: '', currency: 'VCASH' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to deposit funds.');
      window.location.href = '/login';
      return;
    }

    try {
      const res = await fetch('https://aurumpayapi.visheshverse.com/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Deposit successful! Your new balance is ₹${data.balance}`);
        window.location.href = '/dashboard';
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Server error while depositing funds.');
    }
  };

  return (
    <div className="deposit-container">
      <form className="deposit-form" onSubmit={handleSubmit}>
        <h2>Deposit Funds</h2>
        <input
          name="amount"
          placeholder="Enter amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <select name="currency" value={formData.currency} onChange={handleChange}>
          <option value="VCASH">VCASH</option>
          <option value="VINR">VINR</option>
          <option value="VUSD">VUSD</option>
          <option value="VLESS">VLESS</option>
        </select>
        <button type="submit">Deposit</button>
      </form>
    </div>
  );
}

export default DepositPage;
