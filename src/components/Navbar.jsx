import React, { useState, useEffect, useContext } from "react";
import AuthModal from "./AuthModel";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const { userDetails, clearUserDetails } = useContext(UserContext); // Access user details from context

  useEffect(() => {
    // Open the modal if the route is either /login or /signup
    if (location.pathname === "/login" || location.pathname === "/signup") {
      setAuthModalOpen(true);
    } else {
      setAuthModalOpen(false);
    }
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
      <nav className="flex justify-between items-center p-4 bg-black relative">
        <div className="flex-1"></div>
        <Link
          to="/home"
          className="text-yellow-500 text-2xl md:text-3xl font-bold absolute left-1/2 transform -translate-x-1/2"
        >
          <img src="/Logo.png" alt="Logo" className="h-8 md:h-10" />
        </Link>
        <div className="flex space-x-2 md:space-x-4 flex-1 justify-end">
          {userDetails ? (
            <>
              <span className="text-white">{userDetails.name}</span>
              <button
                className="bg-red-500 text-white font-bold py-1 px-3 md:py-2 md:px-4 rounded"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-yellow-500 text-black font-bold py-1 px-3 md:py-2 md:px-4 rounded"
                onClick={() => openAuthModal("login")}
              >
                Login
              </button>
              <button
                className="bg-yellow-500 text-black font-bold py-1 px-3 md:py-2 md:px-4 rounded"
                onClick={() => openAuthModal("signup")}
              >
                SignUp
              </button>
            </>
          )}
        </div>
      </nav>

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
