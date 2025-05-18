import React, { useState } from 'react';
import './WithdrawPage.css';

function WithdrawPage() {
  const [formData, setFormData] = useState({ amount: '', currency: 'VCASH' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to withdraw funds.');
      window.location.href = '/login';
      return;
    }

    try {
      const res = await fetch('http://localhost:0702/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Withdrawal successful! Your new balance is ₹${data.balance}`);
        window.location.href = '/dashboard';
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Server error while withdrawing funds.');
    }
  };

  return (
    <div className="withdraw-container">
      <form className="withdraw-form" onSubmit={handleSubmit}>
        <h2>Withdraw Funds</h2>
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
        <button type="submit">Withdraw</button>
      </form>
    </div>
  );
}

export default WithdrawPage;
