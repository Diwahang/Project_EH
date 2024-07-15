import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Details.css';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState(null);

  useEffect(() => {
    fetchAdvertisementDetails();
  }, []);

  const fetchAdvertisementDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/advertisements/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdvertisement(response.data);
    } catch (error) {
      console.error('Error fetching advertisement details:', error);
    }
  };

  const handleViewSubmissions = () => {
    navigate(`/advertisements/${id}/submissions`);
  };

  if (!advertisement) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container">
      <h2>{advertisement.title}</h2>
      <p><strong>Category:</strong> {advertisement.category}</p>
      <p><strong>Budget:</strong> {advertisement.budget}</p>
      <p><strong>Remaining Budget:</strong> {advertisement.remaining_budget}</p>
      <p><strong>Per Job:</strong> {advertisement.per_job}</p>
      <p><strong>Description:</strong> {advertisement.description}</p>
      <p><strong>Confirmation Requirements:</strong> {advertisement.confirmation_requirements}</p>
      <p><strong>Status:</strong> {advertisement.status}</p>
      <p><strong>Requires Media:</strong> {advertisement.requires_media ? 'Yes' : 'No'}</p>
      <p><strong>Media Type:</strong> {advertisement.media_type}</p>
      <p><strong>Terminate:</strong> {advertisement.terminate}</p>
      {advertisement.thumbnail && <img src={advertisement.thumbnail} alt="Thumbnail" />}
      {advertisement.video && <video src={advertisement.video} controls />}
      <button className="view-submission-button" onClick={handleViewSubmissions}>View Submission</button>
    </div>
  );
};

export default Details;
