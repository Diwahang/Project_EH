import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./Earn.css";

const JobCard = ({ job, onStart }) => (
  <div className="job-card">
    <div className="job-header">
      <h2>{job.title}</h2>
      <span className="job-id">Job ID: {job.id}</span>
    </div>
    <div className="job-body">
      <p>
        <strong>Description:</strong>
      </p>
      <p>{job.description}</p>
      <p>
        <strong>Confirmation Requirement:</strong>
      </p>
      <p>{job.confirmation_requirements}</p>
    </div>
    <div className="job-footer">
      <span className="job-reward">NPR: {job.reward}</span>
      <button className="start-button" onClick={() => onStart(job.id)}>
        Start
      </button>
    </div>
  </div>
);

const TransactionCard = ({ transaction }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="transaction-card">
      <div className="transaction-header">
        <h2>{transaction.advertisement_title}</h2>
        <div className="transaction-id">ID: {transaction.id}</div>
      </div>
      <div className="transaction-body">
        <div className="transaction-details">
          <div className="detail-item">
            <span className="detail-label">User</span>
            <span className="detail-value">{transaction.user_name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Type</span>
            <span className="detail-value">{transaction.transaction_type}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Amount</span>
            <span className="detail-value amount">
              NPR {transaction.amount}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Date</span>
            <span className="detail-value">{formatDate(transaction.date)}</span>
          </div>
        </div>
        <div className={`status-container ${transaction.status}`}>
          <span className="status-icon">Status: ●</span>
          {transaction.status}
        </div>
      </div>
      <div className="transaction-footer">
        <h3 className="proof-title">Proof Submitted</h3>
        <img
          src={transaction.proof}
          alt="Proof of completion"
          className="proof-image"
        />
      </div>
    </div>
  );
};

const Earn = () => {
  const [jobs, setJobs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortOption, setSortOption] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No token found");
          return;
        }

        console.log("Using token for jobs:", token);

        const response = await fetch(
          "http://localhost:8000/api/advertisements/all/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No token found");
          return;
        }

        console.log("Using token for transactions:", token);

        const response = await fetch(
          "http://localhost:8000/api/transactions/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleStart = (jobId) => {
    navigate(`/dashboard/advertisement/${jobId}`, { state: jobId });
  };

  const handleSort = (option) => {
    setSortOption(option);
    setShowSortDropdown(false);
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortOption === "high-to-low") {
      return b.reward - a.reward;
    } else if (sortOption === "low-to-high") {
      return a.reward - b.reward;
    } else if (sortOption === "latest") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return 0;
    }
  });

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((transaction) => transaction.status === filter);

  return (
    <div className="earn-container">
      <div className="filter-container">
        <div className="filter-buttons">
          <button onClick={() => setFilter("all")}>All jobs</button>
          <button onClick={() => setFilter("pending")}>
            Waiting for review
          </button>
          <button onClick={() => setFilter("approved")}>Approved</button>
          <button onClick={() => setFilter("denied")}>Denied</button>
        </div>
        <div className="filter">
          <span onClick={() => setShowSortDropdown(!showSortDropdown)}>
            Filter <FilterListIcon />
          </span>
          {showSortDropdown && (
            <div className="sort-dropdown">
              <div onClick={() => handleSort("high-to-low")}>High to Low</div>
              <div onClick={() => handleSort("low-to-high")}>Low to High</div>
              <div onClick={() => handleSort("latest")}>Latest</div>
            </div>
          )}
        </div>
      </div>
      <div className="job-list">
        {filter === "all"
          ? sortedJobs.map((job, index) => (
              <JobCard key={index} job={job} onStart={handleStart} />
            ))
          : filteredTransactions.map((transaction, index) => (
              <TransactionCard key={index} transaction={transaction} />
            ))}
      </div>
    </div>
  );
};

export default Earn;
