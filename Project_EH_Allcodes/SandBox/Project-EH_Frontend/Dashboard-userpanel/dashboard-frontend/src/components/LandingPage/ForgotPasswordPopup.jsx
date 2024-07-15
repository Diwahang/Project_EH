import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './ForgotPasswordPopup.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    // Handle verification logic
  };

  return (
    <div className="forgot-password-popup">
      <div className="forgot-password-content">
        <h2>Reset Password</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleVerify}>
          <div className="input-container">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <FaLock className="icon" />
            <input
              type="password"
              name="new-password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <FaLock className="icon" />
            <input
              type="password"
              name="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Verify</button>
         
        </form>
        
      </div>
    </div>
  );
};

export default ForgotPassword;
