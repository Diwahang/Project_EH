// HomePage.jsx
import React, { useState } from 'react';
import LandingPage from './LandingPage';
import LoginPopup from './LoginPopup';
import LoginPopup from './RegisterPage';
// Import RegisterPopup if it exists

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleShowLogin = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);

  const handleShowRegister = () => setShowRegister(true);
  const handleCloseRegister = () => setShowRegister(false);

  return (
    <div className="home-page">
      <LandingPage onShowLogin={handleShowLogin} onShowRegister={handleShowRegister} />
      {showLogin && <LoginPopup onClose={handleCloseLogin} onNavigateToRegister={handleShowRegister} />}
      {showRegister && <RegisterPopup onClose={handleCloseRegister} />} {/* Assuming you have a RegisterPopup component */}
    </div>
  );
};

export default HomePage;
