// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "antd"; // Import Ant Design Layout
import { applyTheme } from './utils/themeUtils';
import HomePage from "./pages/HomePage";
import Navbar from "./components/navbar/Navbar";
import StorePage from "./pages/StorePage";
import URLForwarding from "./pages/URLForwarding";
import RedirectToHome from "./pages/RedirectToHomepage";
import Footer from "./components/Footer";
import ReelsPage from "./pages/ReelsPage";
import AdPopup from "./components/AdPop";
import Payment from "./pages/Payment";
import { listenToAuthState, closeAuthModal } from './slices/userSlice';
import "./App.css";
import AuthModal from "./components/AuthModel";

// Ant Design Layout Destructuring
const { Header, Content, Footer: AntFooter } = Layout;

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const [showAd, setShowAd] = useState(false);
  const [img, setImg] = useState(null);
  const { loading, isAuthModalOpen } = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme);
  const searchParams = new URLSearchParams(window.location.search);
  const showAdParam = searchParams.get("showAd");
  const imgLink = searchParams.get("img");
  const dispatch = useDispatch();

  useEffect(() => {
    applyTheme(theme); // Apply theme on theme change
  }, [theme]);

  useEffect(() => {
    if (showAdParam === "true") {
      setShowAd(true);
      setImg(imgLink);
    }
  }, [showAdParam, imgLink]);

  useEffect(() => {
    dispatch(listenToAuthState());
  }, [dispatch]);

  const closeAd = () => {
    setShowAd(false);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("showAd", "false");
    window.history.pushState(null, "", newUrl);
  };

  const handleCloseAuthModal = () => {
    dispatch(closeAuthModal()); // Dispatch the action to close the auth modal
  };

  // Disable scrolling when Auth Modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Cleanup to reset class on unmount
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isAuthModalOpen]);

  if (loading) {
    return null;
  }

  return (
    <Layout className="app">
      <Header className="navbar">
        {!location.pathname.startsWith("/qr") && <Navbar />}
      </Header>
      {showAd && <AdPopup img={img} onClose={closeAd} />}
      <Content className={location.pathname.startsWith("/reels") ? "no-scroll" : "scroll"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/store" element={<RedirectToHome />} />
          <Route path="/store/:storeId" element={<StorePage />} />
          <Route path="/qr/:shortUrl" element={<URLForwarding />} />
          <Route path="/Login" element={<HomePage />} />
          <Route path="/SignUp" element={<HomePage />} />
          <Route path="/reels/:reelId" element={<ReelsPage />} />
          <Route path="/upi" element={<Payment />} />
        </Routes>
      </Content>
      <AntFooter style={{ padding: 0 }}>
        {!location.pathname.startsWith("/reels") &&
          !location.pathname.startsWith("/qr") && <Footer />}
      </AntFooter>
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} close={handleCloseAuthModal} />}
    </Layout>
  );
};

export default App;
