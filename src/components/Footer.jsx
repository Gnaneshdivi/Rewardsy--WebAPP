// src/components/Footer.js
import React from "react";
import { Button, Divider } from "antd";
import { FacebookOutlined, InstagramOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { openAuthModal, logout } from "../slices/userSlice"; // Import actions
import "./Footer.css"; // Footer styling

const Footer = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user); // Access user details from Redux

  const handleSignOut = () => {
    dispatch(logout()); // Dispatch the logout action
  };

  const handleOpenAuth = () => {
    dispatch(openAuthModal()); // Dispatch to open AuthModal
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-top-right">
          <div className="footer-column">
            <h3>Address</h3>
            <p>Electronic city, Bangalore - 5600100</p>
          </div>

          {/* Divider */}
          <Divider className="vertical-divider" type="vertical" />

          {/* Links Column */}
          <div className="footer-column">
            <a href="https://rewardsy.one/">Landing Page</a>
            <a href="https://rewardsy.one/about">About us</a>
            <a href="https://rewardsy.one/contact">contact us</a>
          </div>
        </div>

        {/* Buttons for Register and Log in or Sign Out */}
        <div className="footer-buttons">
          {userDetails ? (
           <></>
          ) : (
            <>
              <Button className="login-nav-button" onClick={handleOpenAuth}>
                Log in
              </Button>
              <Button className="signup-nav-button" onClick={handleOpenAuth}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Divider between top and bottom sections */}
      <Divider className="footer-divider" />

      {/* Bottom section with Logo and Social Icons */}
      <div className="footer-bottom">
        <div className="footer-logo">
          <img src="/Logo.png" alt="Logo" />
        </div>

        <div className="footer-social">
          <WhatsAppOutlined className="social-icon" />
          <InstagramOutlined className="social-icon" />
          <FacebookOutlined className="social-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
