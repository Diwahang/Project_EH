import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Submissions.css';

const Submissions = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [advertisement, setAdvertisement] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
    fetchAdvertisement();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/advertisements/${id}/submissions/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubmissions(response.data);
    } catch (error) {
      setError('Error fetching submissions: ' + error.response?.data?.detail || error.message);
    }
  };

  const fetchAdvertisement = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/advertisements/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdvertisement(response.data);
    } catch (error) {
      setError('Error fetching advertisement: ' + error.response?.data?.detail || error.message);
    }
  };

  const handleVerifySubmission = async (submissionId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`http://localhost:8000/api/transactions/${submissionId}/approve/`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchSubmissions();
      setError(null);
    } catch (error) {
      setError('Error verifying submission: ' + error.response?.data?.detail || error.message);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:8000/api/transactions/${submissionId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchSubmissions();
      setError(null);
    } catch (error) {
      setError('Error deleting submission: ' + error.response?.data?.detail || error.message);
    }
  };

  if (!advertisement) {
    return <div>Loading...</div>;
  }

  return (
    <div className="submissions-container">
      <h2>Submissions for {advertisement.title}</h2>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {submissions.map((submission) => (
          <li key={submission.id} className="submission-item">
            <p><strong>User:</strong> {submission.user_name}</p>
            <p><strong>Status:</strong> {submission.status}</p>
            <p><strong>Transaction Type:</strong> {submission.transaction_type}</p>
            <p><strong>Amount:</strong> {submission.amount}</p>
            <p><strong>Date:</strong> {new Date(submission.date).toLocaleString()}</p>
            <p><strong>Proof:</strong> 
              <img src={submission.proof} alt="Proof" className="proof-image" />
            </p>
            <button onClick={() => handleVerifySubmission(submission.id)} className="verify-button">Verify Submission</button>
            <button onClick={() => handleDeleteSubmission(submission.id)} className="delete-button">Delete Submission</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Submissions;