import React, { useState, useEffect } from "react";
import AuthModal from "./AuthModel";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import "./Navbar.css";
import { createStyles } from 'antd-style';
import { useSelector, useDispatch } from "react-redux"; // Import useSelector and useDispatch from Redux
import { logout } from "../slices/userSlice"; // Import logout action from userSlice

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { userDetails } = useSelector((state) => state.user); // Access user details from Redux
  const dispatch = useDispatch(); // Initialize dispatch for actions

  const useStyle = createStyles(({ prefixCls, css }) => ({
    linearGradientButton: css`
      &::hover {
        background-color: gold;
      }
      &::active {
        background-color: darkgoldenrod;
      }
    `,
  }));
  
  const { styles } = useStyle();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Open the modal if the route is either /login or /signup
    if (location.pathname === "/login" || location.pathname === "/signup") {
      setAuthModalOpen(true);
    } else {
      setAuthModalOpen(false);
    }

    // Close the menu automatically when the location changes (e.g., navigation occurs)
    setMenuOpen(false);
  }, [location.pathname]);

  const openAuthModal = () => {
    setAuthModalOpen(true); // Open the modal for login/signup
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    navigate("/home");
  };

  const handleSignOut = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate("/home"); // Navigate back to home after signing out
  };

  return (
    <>
      <div className="flex justify-between items-center p-3 bg-black" id="nav">
        <div className="flex-shrink-0" id="logoDiv">
          <Button type="link" href="/home">
            <img id="logo" src="/Logo.png" alt="Logo" className="h-10 ml-5 " />
          </Button>
        </div>

        <div className="hidden sm:flex gap-2">
          {userDetails ? (
            <>
              <span className="text-white">{userDetails.name}</span>
              <button
                className="bg-red-500 text-white font-bold py-2 px-5 rounded"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Button className={styles.linearGradientButton} id="login-nav" type="primary" onClick={openAuthModal}>
                Login / Signup
              </Button>
            </>
          )}
        </div>

        <div className="sm:hidden flex items-center">
          <MenuOutlined onClick={toggleMenu} className="text-white text-2xl cursor-pointer" />
        </div>

        {menuOpen && (
          <div className="sm:hidden absolute top-16 right-3 bg-[#252525d8] rounded-lg shadow-lg p-3 mt-1 flex flex-col z-10">
            {userDetails ? (
              <>
                <span className="text-white mb-2">{userDetails.name}</span>
                <Button
                  className="bg-red-500 text-white font-bold py-2 px-5 rounded mb-2"
                  onClick={() => {
                    handleSignOut();
                    setMenuOpen(false); // Close menu on sign out
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="bg-yellow-500 text-black font-bold py-2 px-5 rounded mb-2"
                  onClick={() => {
                    openAuthModal();
                    setMenuOpen(false); // Close menu on navigation to login
                  }}
                >
                  Login / Signup
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          close={closeAuthModal}
        />
      )}
    </>
  );
};

export default Navbar;
