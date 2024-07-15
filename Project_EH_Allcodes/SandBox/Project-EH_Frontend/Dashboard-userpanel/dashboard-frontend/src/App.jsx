import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Wallet from './components/Wallet/Wallet'
import Advertise from './components/Advertise/Advertise';
import Earn from './components/Earn/Earn';
import Profile from './components/Profile/Profile';
import Logout from './components/Logout/Logout';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Adminads from './components/Adminads/Adminads';
import AsideAdContent from './components/AsideAdContent/AsideAdContent';
import Create from './components/Advertise/Create';
import AdvertisementDetails from './components/AdvertisementDetails/AdvertisementDetails';
import Details from './components/Advertise/Details';
import Submissions from './components/Advertise/Submissions';
import AdDetails from './components/AsideAdContent/AdDetails';

// Import Landing Page Components
import Navbar from './components/LandingPage/Navbar';
import Home from './components/LandingPage/Home';
import Features from './components/LandingPage/Features';
import Contact from './components/LandingPage/Contact';
import LoginPopup from './components/LandingPage/LoginPopup';
import RegisterPage from './components/LandingPage/RegisterPage';
import ForgotPasswordPopup from './components/LandingPage/ForgotPasswordPopup';

import './App.css';

const ProtectedRoute = ({ element: Element }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('access_token');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Element /> : null;
};

const App = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  useEffect(() => {
    // Extract query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const access_token = params.get('access_token');
    const user_id = params.get('user_id');
    const username = params.get('username');

    if (access_token && user_id && username) {
      // Store access token and user information in local storage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', username);

      // Remove query parameters from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <Navbar />
              <div id="home"><Home /></div>
              <div id="details"><Details /></div>
              <div id="features"><Features /></div>
              <div id="contact"><Contact /></div>
              <Footer />
            </div>
          }
        />
        <Route path="/login" element={<LoginPopup />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPopup onClose={handleCloseForgotPassword} />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute
              element={() => (
                <div className="main-Container">
                  <div className="main-Inner-Container">
                    <Sidebar />
                    <div className="app">
                      <Header />
                      <div className="content">
                        <div className="routes-container">
                          <div className="inner-Route-container">
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="wallet" element={<Wallet />} />
                              <Route path="advertise" element={<Advertise />} />
                              <Route path="earn" element={<Earn />} />
                              <Route path="profile" element={<Profile />} />
                              <Route path="logout" element={<Logout />} />
                              <Route path="adminads" element={<Adminads />} />
                              <Route path="create" element={<Create />} />
                              <Route path="advertisement/:id" element={<AdvertisementDetails />} />
                              <Route path="details/:id" element={<Details />} />
                              <Route path="advertisements/:id/submissions" element={<Submissions />} />
                              <Route path="admin_ads/:id" element={<AdDetails />} />
                            </Routes>
                          </div>
                        </div>
                        <div className="aside-content-for-ad">
                          <div className="aside-content-inner-container">
                            <AsideAdContent />
                          </div>
                        </div>
                      </div>
                      <div className="for-Footer">
                        <Footer />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          }
        />
      </Routes>
      {showForgotPassword && <ForgotPasswordPopup onClose={handleCloseForgotPassword} />}
    </Router>
  );
};

export default App;
