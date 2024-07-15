import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import './LoginPopup.css';

const LoginPopup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email_or_username: emailOrUsername,
        password: password,
      });
      const { access_token, user_id, username } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', username);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed. Please try again.');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-popup">
      <div className="login-content">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <div className="icon-wrapper">
              <FaEnvelope className="icon" />
            </div>
            <input
              type="text"
              name="email_or_username"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <div className="icon-wrapper">
              <FaLock className="icon" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <FaEyeSlash className="toggle-password" onClick={toggleShowPassword} />
            ) : (
              <FaEye className="toggle-password" onClick={toggleShowPassword} />
            )}
          </div>
          {error && <p className="error-message">{error}</p>}
          <p className="forgot-password-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
          <button type="submit">Login</button>
        </form>
        <p className="alternative-login">OR</p>
        <button className="google-login">
          <FaGoogle className="fa-google" /> Login with Google
        </button>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;












