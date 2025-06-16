// src/pages/ForgotPassword.js
import { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});


    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <div className="input-box">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Send Reset Link</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
