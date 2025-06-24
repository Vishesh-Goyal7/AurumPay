import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:0702/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) alert('Registration successful!');
      else alert(`Error: ${data.error}`);
    } catch (err) {
      alert('Failed to connect to backend.');
    }
    navigate('/login');
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Create an Account</h2>
      <input name="name" placeholder="Full Name" onChange={handleChange} required />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;