import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">
         <img src='../Logo.png' alt='logo'></img>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h3>Mobile app</h3>
            <ul>
              <li>Features</li>
              <li>Live share</li>
              <li>Video record</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Community</h3>
            <ul>
              <li>Featured artists</li>
              <li>The Portal</li>
              <li>Live events</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li>About us</li>
              <li>Contact us</li>
              <li>History</li>
            </ul>
          </div>
        </div>
        <div className="footer-buttons">
          <button className="register-button">Register</button>
          <button className="login-button">Log in</button>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copyright">
          <p>© Rewardsy, Inc. 2024. We love our users!</p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
