import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { openAuthModal, logout } from "../../slices/userSlice"; // Import actions
import "./Navbar.css"; // Import your own CSS

const Navbar = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user); // Get userDetails from Redux state
  const [drawerVisible, setDrawerVisible] = useState(false); // State to handle drawer visibility

  const handleSignOut = () => {
    dispatch(logout()); // Dispatch the logout action
    setDrawerVisible(false); // Close drawer when signing out
  };

  const handleOpenAuth = () => {
    dispatch(openAuthModal()); // Dispatch to open AuthModal
    setDrawerVisible(false); // Close drawer when opening auth modal
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible); // Toggle drawer visibility
  };

  return (
    <div className="navbar-container">
      <div className="navbar-content">
        {/* Logo */}
        <Button type="link" href="/home">
          <img id="logo" src="/Logo.png" alt="Logo" />
        </Button>

        {/* Desktop View: Conditionally render login/signup or sign out */}
        <div className="desktop-auth">
          {userDetails ? (
            <Button className="navbar-button" onClick={handleSignOut}>
              Sign Out
            </Button>
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

        {/* Mobile Menu Toggle Icon */}
        <MenuOutlined onClick={toggleDrawer} className="menu-toggle" />

        {/* Drawer for mobile view */}
        <Drawer
          placement="right"
          onClose={toggleDrawer}
          open={drawerVisible}
          width={300}
        >
          {userDetails ? (
            <Button className="navbar-button" onClick={handleSignOut} block>
              Sign Out
            </Button>
          ) : (
            <>
              <Button className="login-nav-button" onClick={handleOpenAuth} block>
                Log in
              </Button>
              <Button className="signup-nav-button" onClick={handleOpenAuth} block>
                Sign up
              </Button>
            </>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default Navbar;
