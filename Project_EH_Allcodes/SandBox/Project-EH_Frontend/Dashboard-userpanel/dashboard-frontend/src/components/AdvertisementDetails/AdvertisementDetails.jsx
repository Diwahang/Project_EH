import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';

import './AdvertisementDetails.css';

const AdvertisementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState(null);
  const [proof, setProof] = useState(null);
  const [message, setMessage] = useState('');
  const [watch_full_video, setWatchedVideo] = useState(false);

  const getAuthToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setMessage('Authentication required. Redirecting to login...');
      navigate('/login');
      return null;
    }
    return token;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    fetch(`http://localhost:8000/api/advertisements/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setAdvertisement(data))
      .catch(error => console.error('Error fetching advertisement:', error));
  }, [id, navigate]);

  const handleProofChange = (event) => {
    setProof(event.target.files[0]);
  };

  const handleVideoEnd = () => {
    const token = getAuthToken();
    if (!token) return;

    fetch('http://localhost:8000/api/update-watched-video/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ advertisement_id: id }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.detail === "watched_video updated successfully.") {
          setWatchedVideo(true);
          setMessage('You can now submit your proof.');
        }
      })
      .catch(error => console.error('Error updating watched video status:', error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!proof) {
      setMessage('Please upload proof.');
      return;
    }

    if (advertisement.youtube_link && !watch_full_video) {
      setMessage('Please watch the full video before submitting proof.');
      return;
    }

    const token = getAuthToken();
    if (!token) return;

    const formData = new FormData();
    formData.append('advertisement_id', id);
    formData.append('proof', proof);

    fetch('http://localhost:8000/api/submit-proof/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.detail === "Proof submitted successfully.") {
          setMessage('Proof submitted successfully!');
          navigate(`/dashboard/advertisement/${id}`);
        } else {
          setMessage(data.detail || 'Failed to submit proof. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error submitting proof:', error);
        setMessage('An error occurred. Please try again.');
      });
  };

  const onReady = (event) => {
    // Store the player object
    const player = event.target;
    // Add an event listener for the video ending
    player.addEventListener('onStateChange', (event) => {
      if (event.data === YouTube.PlayerState.ENDED) {
        handleVideoEnd();
      }
    });
  };

  if (!advertisement) {
    return <div>Loading...</div>;
  }

  const getYouTubeVideoId = (url) => {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      return videoId.substring(0, ampersandPosition);
    }
    return videoId;
  };

  return (
    <div className="ad-details-container">
      <div className="ad-details-job-header">
        <h1>{advertisement.title}</h1>
        <span className="ad-details-job-id">Job ID: {advertisement.id}</span>
      </div>
      <div className="ad-details-job-body">
        <div className="ad-details-section">
          <h2 className="ad-details-section-title">Description</h2>
          <p className="ad-details-section-content">{advertisement.description}</p>
        </div>
        <div className="ad-details-section">
          <h2 className="ad-details-section-title">Confirmation Requirement</h2>
          <p className="ad-details-section-content">{advertisement.confirmation_requirements}</p>
        </div>
        {advertisement.youtube_link && (
          <div className="ad-details-video-section">
            <h2 className="ad-details-section-title">Tutorial Video</h2>
            <YouTube
              videoId={getYouTubeVideoId(advertisement.youtube_link)}
              onReady={onReady}
              opts={{
                width: '560',
                height: '315',
                playerVars: {
                  autoplay: 0,
                },
              }}
            />
            {!watch_full_video && <p>Please watch the full video to submit your proof.</p>}
          </div>
        )}
        <div className="ad-details-proof-section">
          <label className="ad-details-proof-label" htmlFor="ad-details-proof-upload">Upload Your Proof</label>
          <input 
            type="file" 
            id="ad-details-proof-upload" 
            className="ad-details-proof-upload"
            onChange={handleProofChange}
          />
          <label htmlFor="ad-details-proof-upload" className="ad-details-proof-upload-btn">
            {proof ? proof.name : 'Click or drag file to upload'}
          </label>
        </div>
        <div className="ad-details-submit-section">
          <button 
            className="ad-details-submit-button" 
            onClick={handleSubmit}
            disabled={advertisement.youtube_link && !watch_full_video}
          >
            Submit Proof
          </button>
        </div>
      </div>
      {message && (
        <div className={`ad-details-message ${message.includes('successfully') ? 'ad-details-success-message' : 'ad-details-error-message'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AdvertisementDetails;
