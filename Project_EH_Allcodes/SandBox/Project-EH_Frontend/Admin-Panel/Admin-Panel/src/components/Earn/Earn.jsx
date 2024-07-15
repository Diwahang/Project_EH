import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Earn.css';

const JobCard = ({ job, onStart }) => (
  <div className="job-card">
    <div className="job-header">
      <h2>{job.title}</h2>
      <span className="job-id">Job ID: {job.id}</span>
    </div>
    <div className="job-body">
      <p><strong>Description</strong></p>
      <p>{job.description}</p>
      <p><strong>Confirmation Requirement</strong></p>
      <p>{job.confirmation_requirements}</p>
    </div>
    <div className="job-footer">
      <span className="job-reward">NPR: {job.reward}</span>
      <button className="start-button" onClick={() => onStart(job.id)}>Start</button>
    </div>
  </div>
);

const Earn = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/advertisements/all/')
      .then(response => response.json())
      .then(data => setJobs(data))
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  const handleStart = (jobId) => {
    navigate(`/advertisement/${jobId}`);
  };

  return (
    <div className="earn-container">
      <div className="filter-buttons">
        <button>All jobs</button>
        <button>Waiting for review</button>
        <button>Approved</button>
        <button>Denied</button>
        <div className="filter">
          <span>Filter</span>
        </div>
      </div>
      <div className="job-list">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} onStart={handleStart} />
        ))}
      </div>
    </div>
  );
};

export default Earn;
