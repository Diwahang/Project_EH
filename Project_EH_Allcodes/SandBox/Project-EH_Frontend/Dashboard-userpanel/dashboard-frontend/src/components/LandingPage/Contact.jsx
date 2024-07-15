// Contact.jsx
import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="section">
      <h1> Contact </h1>
      <p>Don't hesitate to give us a call or leave us an email.</p>
      <div id='contact details' className="contact-details">
        <p><i className="fas fa-phone"></i> <strong>Phone:</strong> 9823456783</p>
        <p><i className="fas fa-envelope"></i> <strong>Email:</strong> contact@company.com</p>
        <p><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> Kathmandu</p>
      </div>
    </section>
  );
};

export default Contact;
