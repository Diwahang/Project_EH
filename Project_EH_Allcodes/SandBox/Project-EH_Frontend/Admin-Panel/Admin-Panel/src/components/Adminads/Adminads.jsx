import React, { useState } from 'react';
import axios from 'axios';
import './Adminads.css';

const Adminads = () => {
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    discounts: '',
    offers: '',
    referral_code: '',
    guidelines: '',
    links: '',
    thumbnail: null,
    priority: 1,  // Default priority
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/admin_ads/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      alert('Advertisement submitted successfully!');
    } catch (error) {
      console.error('Error submitting advertisement:', error);
      alert('Failed to submit advertisement.');
    }
  };

  return (
    <div className="adminads-container">
      <h1>Create Your Article Advertisement</h1>
      <form className="adminads-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Advertisement Title:</label>
          <input
            type="text"
            name="title"
            placeholder="Enter the title of your advertisement"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Detailed Specification:</label>
          <textarea
            name="details"
            placeholder="Enter the detailed description of your advertisement"
            value={formData.details}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Discounts:</label>
          <input
            type="text"
            name="discounts"
            placeholder="Enter any discounts available"
            value={formData.discounts}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Offers:</label>
          <input
            type="text"
            name="offers"
            placeholder="Enter any special offers"
            value={formData.offers}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Referral Code:</label>
          <input
            type="text"
            name="referral_code"
            placeholder="Enter any referral codes"
            value={formData.referral_code}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>How to Grab the Deals:</label>
          <textarea
            name="guidelines"
            placeholder="Provide instructions on how to avail the deals"
            value={formData.guidelines}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Your Other Links:</label>
          <input
            type="text"
            name="links"
            placeholder="Enter your website or social media links"
            value={formData.links}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Priority:</label>
          <input
            type="number"
            name="priority"
            placeholder="Set priority (default is 1)"
            value={formData.priority}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Upload Thumbnail:</label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit Advertisement</button>
      </form>
    </div>
  );
};

export default Adminads;
