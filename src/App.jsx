import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate, // import useNavigate for programmatically navigating
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import StorePage from "./pages/StorePage";
import URLForwarding from "./pages/URLForwarding";
import RedirectToHome from "./pages/RedirectToHomepage";
import Footer from "./components/Footer";
import ReelsPage from "./pages/ReelsPage";
import "./App.css"; // Include your global styles here
import AuthModal from "./components/AuthModel";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

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

  return (
    <div className="full-screen">
      <nav className="navbar">
        <Link className="navbar-logo" to="/home">
          <img src={"/Logo.png"} alt="logo" />
        </Link>

        <div className="authentication">
          <button
            className="navbar-button"
            onClick={() => openAuthModal("login")}
          >
            Login
          </button>
          <button
            className="navbar-button"
            onClick={() => openAuthModal("signup")}
          >
            SignUp
          </button>
        </div>
      </nav>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          close={closeAuthModal}
          mode={location.pathname.substring(1)} // "login" or "signup"
        />
      )}

      <div
        className={
          location.pathname.startsWith("/reels") ? "no-scroll" : "scroll"
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/store" element={<RedirectToHome />} />
          <Route path="/store/:name" element={<StorePage />} />
          <Route path="/qr/:shortUrl" element={<URLForwarding />} />
          <Route path="/reels/:reelID" element={<ReelsPage />} />
          <Route path="/reels/" element={<ReelsPage />} />
        </Routes>
        {!location.pathname.startsWith("/reels") && <Footer />}
      </div>
    </div>
  );
};

export default App;
