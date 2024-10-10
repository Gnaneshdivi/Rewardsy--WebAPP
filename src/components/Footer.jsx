import React from "react";
import "./Footer.css";
import { useSelector, useDispatch } from "react-redux"; // Import useSelector and useDispatch from Redux
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../slices/userSlice"; // Import logout action from userSlice if needed

const Footer = () => {
  const { userDetails } = useSelector((state) => state.user); // Access user details from Redux
  const dispatch = useDispatch(); // Initialize dispatch for actions
  const location = useLocation();
  const navigate = useNavigate();

  const openAuthModal = (mode) => {
    navigate(`/${mode}`); // Navigate programmatically to set URL
  };

  // Optional: If you want to clear user details programmatically
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">
          <img src="../Logo.png" alt="logo"></img>
        </div>
        <div className="contact-div">
          <div>
            <div className="info-main">
              <div className="info">
                <label>Contact</label>
              </div>
              <div className="info">
                <label>Mobile </label>
                <label>9100828649</label>
              </div>
              <div className="info">
                <label>Email </label>
                <label>divignanesh@gmail.com</label>
              </div>
            </div>
          </div>
        </div>
        {!userDetails ? (
          <div className="footer-buttons">
            <button
              className="login-button"
              onClick={() => openAuthModal("login")}
            >
              Login / Signup
            </button>
          </div>
        ) : (
          <></>
        )}
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
