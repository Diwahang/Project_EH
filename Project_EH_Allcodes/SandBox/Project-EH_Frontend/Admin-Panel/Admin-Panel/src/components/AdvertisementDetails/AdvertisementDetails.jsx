import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdvertisementDetails.css';

const AdvertisementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState(null);
  const [proof, setProof] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8000/api/advertisements/${id}/`)
      .then(response => response.json())
      .then(data => setAdvertisement(data))
      .catch(error => console.error('Error fetching advertisement:', error));
  }, [id]);

  const handleProofChange = (event) => {
    setProof(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!proof) {
        setMessage('Please upload proof.');
        return;
    }

    const formData = new FormData();
    formData.append('advertisement_id', id);
    formData.append('proof', proof);

    fetch('http://localhost:8000/api/submit-proof/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
    })
    .then(response => response.json().then(data => ({ ok: response.ok, data })))
    .then(({ ok, data }) => {
        if (ok) {
            setMessage('Proof submitted successfully!');
            navigate(`/advertisement/${id}`);
        } else {
            setMessage(data.detail || 'Failed to submit proof. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error submitting proof:', error);
        setMessage('An error occurred. Please try again.');
    });
};


  if (!advertisement) {
    return <div>Loading...</div>;
  }

  return (
    <div className="advertisement-detail">
      <div className="job-header">
        <h1>{advertisement.title}</h1>
        <span className="job-id">Job ID: {advertisement.id}</span>
      </div>
      <div className="job-body">
        <p><strong>Description</strong></p>
        <p>{advertisement.description}</p>
        <p><strong>Confirmation Requirement</strong></p>
        <p>{advertisement.confirmation_requirements}</p>
      </div>
      <div className="proof-section">
        <label htmlFor="proof-upload">Upload Your Proof Here:</label>
        <input 
          type="file" 
          id="proof-upload" 
          onChange={handleProofChange}
        />
      </div>
      <div className="submit-section">
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AdvertisementDetails;
