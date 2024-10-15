import React, { useState, useEffect } from "react";
import AuthModal from "./AuthModel";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "./Navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/userSlice";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { userDetails } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      setAuthModalOpen(true);
    } else {
      setAuthModalOpen(false);
    }
    setMenuOpen(false); // Close menu when navigating
  }, [location.pathname]);

  const openAuthModal = () => {
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    navigate("/home");
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/home");
  };

  return (
    <>
      <div className="flex justify-between items-center p-3 bg-black" id="nav">
        <div id="logoDiv">
          <Button type="link" href="/home">
            <img id="logo" src="/Logo.png" alt="Logo" />
          </Button>
        </div>

        <div className="authentication">
          {userDetails ? (
            <>
              <span className="text-white">{userDetails.name}</span>
              <button
                className="navbar-button"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Button
              className="navbar-button"
              onClick={openAuthModal}
            >
              Login / Signup
            </Button>
          )}
        </div>

        <MenuOutlined onClick={toggleMenu} className="menu-toggle" />

        {menuOpen && (
          <div className="mobile-menu">
            {userDetails ? (
              <>
                <span className="text-white">{userDetails.name}</span>
                <Button
                  className="navbar-button"
                  onClick={() => {
                    handleSignOut();
                    setMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                className="navbar-button"
                onClick={() => {
                  openAuthModal();
                  setMenuOpen(false);
                }}
              >
                Login / Signup
              </Button>
            )}
          </div>
        )}
      </div>

      {isAuthModalOpen && (
        <AuthModal isOpen={isAuthModalOpen} close={closeAuthModal} />
      )}
    </>
  );
};

export default Navbar;
