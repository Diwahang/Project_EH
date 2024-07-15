import React, { useState } from 'react';
import './RegisterPage.css';
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    reEnterPassword: '',
    referralCode: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.reEnterPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      username: formData.userName,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      referral_code: formData.referralCode,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/register/', userData);
      setSuccess(response.data.detail);
      setError('');
    } catch (error) {
      setError('Registration failed. Please try again.');
      setSuccess('');
    } finally {
      setOtpModalOpen(true);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      const response = await axios.post('http://localhost:8000/api/verify-otp/', {
        email: formData.email,
        otp: otp,
      });
      setSuccess(response.data.detail);
      setError('');
      setOtpModalOpen(false);
    } catch (error) {
      setError('OTP verification failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <h1 className="company-name">Your Company Name</h1>
        <p className="enter-details">Enter your details to create an account</p>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaUserTag className="input-icon" />
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="reEnterPassword"
              placeholder="Re-enter Password"
              value={formData.reEnterPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaUserTag className="input-icon" />
            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code (optional)"
              value={formData.referralCode}
              onChange={handleChange}
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit">Create an Account</button>
        </form>
        <div className="alternative-login">
          <p>OR</p>
          <button className="google-login">
            <FaGoogle /> Signup with Google
          </button>
        </div>
        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      {otpModalOpen && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h2>Verify OTP</h2>
            <button className="close-button" onClick={() => setOtpModalOpen(false)}>X</button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const otpValue = e.target.elements.otp.value;
                handleVerifyOTP(otpValue);
              }}
            >
              <div className="input-container">
                <FaLock className="input-icon" />
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <button type="submit">Verify OTP</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
