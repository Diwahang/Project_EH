import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Advertise.css';
import axios from 'axios';

const Advertise = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect triggered. Active Tab:', activeTab);
    fetchAdvertisements();
  }, [activeTab]);

  const fetchAdvertisements = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching advertisements for tab:', activeTab);
      const response = await axios.get(`http://localhost:8000/api/advertisements?status=${activeTab}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Advertisements fetched:', response.data);
      setAdvertisements(response.data);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  const handleTabChange = (tab) => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  const handleCreateClick = () => {
    navigate('/Create');
  };

  const handleDetailsClick = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="advertise-container">
      <div className="tabs">
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => handleTabChange('all')}>All</button>
        <button className={activeTab === 'active' ? 'active' : ''} onClick={() => handleTabChange('active')}>Active</button>
        <button className={activeTab === 'completed' ? 'active' : ''} onClick={() => handleTabChange('completed')}>Completed</button>
        <button className={activeTab === 'draft' ? 'active' : ''} onClick={() => handleTabChange('draft')}>Draft</button>
        <button className="create-button" onClick={handleCreateClick}>+ Create</button>
      </div>
      <div className="advertisement-list">
        {advertisements.map(ad => (
          <div key={ad.id} className="advertisement-item">
            <div className="ad-details">
              <div className="ad-header">
                <h2>{ad.title}</h2>
                <span className={`status ${ad.status.toLowerCase()}`}>{ad.status}</span>
              </div>
              <div className="ad-body">
                <p><strong>Job ID:</strong> {ad.id}</p>
                <p><strong>Total budget:</strong> {ad.budget}</p>
                <p><strong>Total spent:</strong> {ad.budget - ad.remaining_budget}</p>
                <p><strong>Remaining:</strong> {ad.remaining_budget}</p>
                <p><strong>Per job:</strong> {ad.per_job}</p>
                <p><strong>Approved job:</strong> 0</p>
                <p><strong>Waiting for approval:</strong> Yes</p>
              </div>
              <div className="ad-footer">
                <button className="add-fund-button">Add fund</button>
                <button className="details-button" onClick={() => handleDetailsClick(ad.id)}>Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button>&lt;</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>7</button>
        <button>&gt;</button>
      </div>
    </div>
  );
};

export default Advertise;
