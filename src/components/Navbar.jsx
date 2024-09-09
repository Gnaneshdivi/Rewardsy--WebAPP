import React, { useState, useEffect, useContext } from "react";
import AuthModal from "./AuthModel";
import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import "./Navbar.css"

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const { userDetails, clearUserDetails } = useContext(UserContext); // Access user details from context
  const [menuOpen, setMenuOpen] = useState(false);

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

  const openAuthModal = (mode) => {
    navigate(`/${mode}`); // Navigate programmatically to set URL
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    navigate("/home"); // Navigate back to home or another neutral path when closing the modal
  };

  const handleSignOut = () => {
    clearUserDetails(); // Clear user details from context
    navigate("/home"); // Navigate back to home after signing out
  };

  return (
    <>
      <div className="flex justify-between items-center p-3 bg-black" id="nav">
        <div className="flex-shrink-0" id="logoDiv">
          <Link to="/home">
            <img id="logo" src="/Logo.png" alt="Logo" className="h-10 ml-5 " />
          </Link>
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
              <button
                className="bg-yellow-500 text-black font-bold py-2 px-5 rounded"
                onClick={() => openAuthModal("login")}
              >
                Login
              </button>
              <button
                className="bg-black text-[#FFEA35] font-medium py-2 px-5 border border-[#FFEA35] rounded"
                onClick={() => openAuthModal("signup")}
              >
                SignUp
              </button>
            </>
          )}
        </div>
        <div className="sm:hidden flex items-center">
          <HiMenu
            className="text-white text-2xl cursor-pointer"
            onClick={toggleMenu}
          />
        </div>

        {menuOpen && (
          <div className="sm:hidden absolute top-16 right-3 bg-[#252525d8] rounded-lg shadow-lg p-3 mt-1 flex flex-col z-10">
            {userDetails ? (
              <>
                <span className="text-white mb-2">{userDetails.name}</span>
                <button
                  className="bg-red-500 text-white font-bold py-2 px-5 rounded mb-2"
                  onClick={() => {
                    handleSignOut();
                    setMenuOpen(false); // Close menu on sign out
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-yellow-500 text-black font-bold py-2 px-5 rounded mb-2"
                  onClick={() => {
                    openAuthModal("login");
                    setMenuOpen(false); // Close menu on navigation to login
                  }}
                >
                  Login
                </button>
                <button
                  className="bg-black text-[#FFEA35] font-medium py-2 px-5 border border-[#FFEA35] rounded"
                  onClick={() => {
                    openAuthModal("signup");
                    setMenuOpen(false); // Close menu on navigation to signup
                  }}
                >
                  SignUp
                </button>
              </>
            )}
          </div>
        )}
      </div> 

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          close={closeAuthModal}
          mode={location.pathname.substring(1)} // "login" or "signup"
        />
      )}
    </>
  );
};

export default Navbar;
