import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import StorePage from "./pages/StorePage";
import URLForwarding from "./pages/URLForwarding";
import RedirectToHome from "./pages/RedirectToHomepage";
import Footer from "./components/Footer";
import ReelsPage from "./pages/ReelsPage";
import "./App.css"; // Include your global styles here

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="full-screen">
      <nav className="navbar">
        <Link className="navbar-logo" to="/home">
          <img src={"/Logo.png"} alt="logo" />
        </Link>

        {/* <div className="authentication">
          <Link className="navbar-button" to="/login">
            Login
          </Link>
          <Link className="navbar-button" to="/SignUp">
            SignUp
          </Link>
        </div> */}
      </nav>

      <div
        className={
          location.pathname.startsWith("/reels") ? "no-scroll" : "scroll"
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/store" element={<RedirectToHome />} />
          <Route path="/store/:storeId" element={<StorePage />} />
          <Route path="/qr/:shortUrl" element={<URLForwarding />} />
          {/* Update the route pattern to catch both /reelID and /reel1, /reel2, etc. */}
          <Route path="/reels/:reelID" element={<ReelsPage />} />
        </Routes>
        {!location.pathname.startsWith("/reels") && <Footer />}
      </div>
    </div>
  );
};

export default App;
