import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
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
  return (
    <div className="full-screen">
      <Navbar />
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
          <Route path="/reels/:reelId" element={<ReelsPage />} />
        </Routes>
        {!location.pathname.startsWith("/reels") && <Footer />}
      </div>
    </div>
  );
};

export default App;
