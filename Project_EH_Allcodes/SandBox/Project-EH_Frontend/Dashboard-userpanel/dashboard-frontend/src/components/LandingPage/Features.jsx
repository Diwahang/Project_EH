import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section id="features" className="section">
      <h1>Features</h1>
      <div className="features-content">
        <h2>Earn Money</h2>
        <p>Our platform offers various ways to earn money:</p>
        <ul>
          <li>Complete tasks and surveys</li>
          <li>Refer friends and earn referral bonuses</li>
          <li>Watch ads and promotional videos</li>
        </ul>
        
        <h2>Create Ads</h2>
        <p>Create and manage your ads seamlessly:</p>
        <ol>
          <li><strong>Sign Up/Login:</strong> Create an account or log in to start creating ads.</li>
          <li><strong>Ad Builder Tool:</strong> Use our tool to design your ad with images, videos, and text.</li>
          <li><strong>Target Audience:</strong> Define your target audience based on various criteria.</li>
          <li><strong>Set Budget:</strong> Specify your ad budget and duration.</li>
          <li><strong>Launch Ad:</strong> Submit your ad for review and launch it once approved.</li>
        </ol>
        
        <h2>Wallet Management</h2>
        <p>Easily load and withdraw money through your wallet:</p>
        <ul>
          <li>Load money using various payment methods</li>
          <li>Withdraw earnings to your bank account or other payment options</li>
          <li>Track your transactions and balance in real-time</li>
        </ul>
      </div>
    </section>
  );
};

export default Features;
