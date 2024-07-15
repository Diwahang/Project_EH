// LandingPage.jsx
import React from 'react';

const LandingPage = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="landing-page">
      <h1>Welcome to ABC Company</h1>
      <button onClick={onShowLogin}>Login</button>
      <button onClick={onShowRegister}>Register</button>
    </div>
  );
};

export default LandingPage;
