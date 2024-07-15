import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const handleScroll = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Company Logo
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleScroll('home')}>
                Home
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleScroll('details')}>
                Details
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleScroll('features')}>
                Features
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => handleScroll('contact')}>
                Contact
              </button>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
