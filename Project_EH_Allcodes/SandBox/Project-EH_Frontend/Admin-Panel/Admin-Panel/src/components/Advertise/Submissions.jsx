import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Submissions.css';

const Submissions = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [advertisement, setAdvertisement] = useState(null);

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
      console.error('Error fetching submissions:', error);
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
      console.error('Error fetching advertisement:', error);
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
      // Optionally, refresh the submissions list after approval
      fetchSubmissions();
    } catch (error) {
      console.error('Error verifying submission:', error);
    }
  };

  if (!advertisement) {
    return <div>Loading...</div>;
  }

  return (
    <div className="submissions-container">
      <h2>Submissions for {advertisement.title}</h2>
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Submissions;
