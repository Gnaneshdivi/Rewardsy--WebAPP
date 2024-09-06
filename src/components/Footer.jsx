import React, { useState, useEffect, useContext } from "react";
import './Footer.css';
import UserContext from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const { userDetails, clearUserDetails } = useContext(UserContext); // Access user details from context
  const location = useLocation();
  const navigate = useNavigate();

  const openAuthModal = (mode) => {
    navigate(`/${mode}`); // Navigate programmatically to set URL
  };
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
        {!userDetails ? (
        <div className="footer-buttons">
          <button className="register-button" onClick={() => openAuthModal("signup")}>Register</button>
          <button className="login-button" onClick={() => openAuthModal("login")}>Log in</button>
        </div>) : <></>}

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
