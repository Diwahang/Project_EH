import React, { useState } from 'react';
import './Details.css';

const Details = () => {
  const sections = ['earn', 'advertise', 'workflow']; // Define your section IDs here
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  const handlePrevClick = () => {
    setSelectedSectionIndex((prevIndex) => (prevIndex === 0 ? sections.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setSelectedSectionIndex((prevIndex) => (prevIndex === sections.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <section id="details" className="section">
      <div className="details-container">
        <div className="slider">
          <div className="slider-arrow left" onClick={handlePrevClick}>
            &#10094;
          </div>
          <div className={`slider-item active`} key={sections[selectedSectionIndex]}>
            <div className="slider-content">
              {/* Your content here for each section */}
              {/* Example: */}
              {sections[selectedSectionIndex] === 'earn' && (
                <>
                  <h2>How to Earn</h2>
                  <p>Our website provides various opportunities for users to earn:</p>
                  <ul>
                    <li>Complete tasks and surveys: Participate in different tasks and surveys to earn points.</li>
                    <li>Refer friends: Invite your friends to join and earn a referral bonus for each friend who signs up and participates.</li>
                    <li>Watch ads: Watch promotional videos and earn rewards for each video viewed.</li>
                  </ul>
                </>
              )}
              {/* Add similar blocks for 'advertise' and 'workflow' sections */}
            </div>
          </div>
          <div className="slider-arrow right" onClick={handleNextClick}>
            &#10095;
          </div>
        </div>
        <div className="side-content">
          <div className="side-pane">
            <div className="side-content-left">
              <h2>How to Earn</h2>
              <p>Details about earning opportunities...</p>
            </div>
            <div className="side-content-right">
              <h2>Create Advertisement</h2>
              <p>Details about advertising...</p>
            </div>
          </div>
          <div className="side-pane">
            <div className="side-content-left">
              <h2>Workflow</h2>
              <p>Details about workflow...</p>
            </div>
            <div className="side-content-right">
              {/* Placeholder for right side content */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;
