import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './Details.css';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState(null);
  const [error, setError] = useState(null);
  const [showFullConfirmation, setShowFullConfirmation] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [showYouTubeEmbed, setShowYouTubeEmbed] = useState(false);

  useEffect(() => {
    fetchAdvertisementDetails();
  }, []);

  const fetchAdvertisementDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(`http://localhost:8000/api/advertisements/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdvertisement(response.data);
    } catch (error) {
      console.error('Error fetching advertisement details:', error);
      setError(error.message || 'An error occurred while fetching advertisement details.');
    }
  };

  const handleViewSubmissions = () => {
    navigate(`/dashboard/advertisements/${id}/submissions`);
  };

  const handleEdit = () => {
    setShowEditPopup(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/advertisements/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting advertisement:', error);
        setError(error.message || 'An error occurred while deleting the advertisement.');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();

      Object.keys(editedFields).forEach(key => {
        formData.append(key, editedFields[key]);
      });

      const response = await axios.patch(`http://localhost:8000/api/advertisements/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setAdvertisement(response.data);
      setShowEditPopup(false);
      setEditedFields({});
    } catch (error) {
      console.error('Error updating advertisement:', error);
      setError(error.message || 'An error occurred while updating the advertisement.');
    }
  };

  const handleInputChange = (e, editor) => {
    const { name, value } = e.target;
    setEditedFields({ ...editedFields, [name]: editor.getData() });
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!advertisement) {
    return <div className="loading">Loading...</div>;
  }

  const confirmationRequirements = advertisement.confirmation_requirements.split('. ').filter(req => req.trim() !== '');

  return (
    <div className="details-container">
      <div className="ad-card">
        {advertisement.thumbnail && (
          <div className="media-section thumbnail">
            <img src={advertisement.thumbnail} alt="Thumbnail" />
          </div>
        )}
        <div className="ad-content">
          <h2 className="ad-title">{advertisement.title}</h2>
          <div className="text-box ad-description">
            <h3>Description</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(advertisement.description)
              }}
            />
          </div>
          <div className="text-box confirmation-requirements">
            <h3>Confirmation Requirements</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(advertisement.confirmation_requirements)
              }}
            />

            {confirmationRequirements.length > 3 && (
              <button onClick={() => setShowFullConfirmation(!showFullConfirmation)}>
                {showFullConfirmation ? 'View Less' : 'View More'}
              </button>
            )}
          </div>
          <div className="ad-info">
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{advertisement.category_name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Pending Submissions:</span>
              <span className="info-value">{advertisement.submissions}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Budget:</span>
              <span className="info-value">${advertisement.budget}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Remaining Budget:</span>
              <span className="info-value">${advertisement.remaining_budget}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Per Job:</span>
              <span className="info-value">${advertisement.per_job}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Limit:</span>
              <span className="info-value">{advertisement.limit}</span>
            </div>
          </div>
          <div className="ad-details">
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value status-tag">{advertisement.status}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Requires Media:</span>
              <span className="detail-value">{advertisement.requires_media ? 'Yes' : 'No'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Media Type:</span>
              <span className="detail-value">{advertisement.media_type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Terminate Date:</span>
              <span className="detail-value">{new Date(advertisement.terminate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created At:</span>
              <span className="detail-value">{new Date(advertisement.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
        {advertisement.video && (
          <div className="media-section video-section">
            <h3>Video Tutorial</h3>
            <video src={advertisement.video} controls />
          </div>
        )}
        {advertisement.youtube_link && (
          <div className="media-section youtube-section">
            <h3>YouTube Video</h3>
            <button onClick={() => setShowYouTubeEmbed(!showYouTubeEmbed)}>
              {showYouTubeEmbed ? 'Hide Video' : 'Show Video'}
            </button>
            {showYouTubeEmbed && (
              <iframe
                width="560"
                height="315"
                src={getYouTubeEmbedUrl(advertisement.youtube_link)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        )}
        <div className="action-buttons">
          <button className="edit-button" onClick={handleEdit}>
            Edit
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
          <button className="view-submission-button" onClick={handleViewSubmissions}>
            View Submissions
          </button>
        </div>
      </div>

      {showEditPopup && (
        <div className="edit-popup">
          <form onSubmit={handleEditSubmit}>
            <h2>Edit Advertisement</h2>
            <label>
              Title:
              <input
                type="text"
                name="title"
                defaultValue={advertisement.title}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                name="category_name"
                defaultValue={advertisement.category_name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Per Job:
              <input
                type="number"
                name="per_job"
                defaultValue={advertisement.per_job}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Description:
              <CKEditor
                editor={ClassicEditor}
                data={advertisement.description}
                onChange={(event, editor) => handleInputChange({ target: { name: 'description', value: editor.getData() } })}
              />
            </label>
            <label>
              Confirmation Requirements:
              <CKEditor
                editor={ClassicEditor}
                data={advertisement.confirmation_requirements}
                onChange={(event, editor) => handleInputChange({ target: { name: 'confirmation_requirements', value: editor.getData() } })}
              />
            </label>
            <label>
              Thumbnail:
              <input
                type="file"
                name="thumbnail"
                onChange={handleInputChange}
                accept="image/*"
              />
            </label>
            <label>
              Video:
              <input
                type="file"
                name="video"
                onChange={handleInputChange}
                accept="video/*"
              />
            </label>
            <label>
              YouTube Link:
              <input
                type="url"
                name="youtube_link"
                defaultValue={advertisement.youtube_link}
                onChange={handleInputChange}
              />
            </label>
            <div className="edit-popup-buttons">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => {
                setShowEditPopup(false);
                setEditedFields({});
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Details;
