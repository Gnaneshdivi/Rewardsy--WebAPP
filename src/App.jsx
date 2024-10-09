import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import StorePage from "./pages/StorePage";
import URLForwarding from "./pages/URLForwarding";
import RedirectToHome from "./pages/RedirectToHomepage";
import Footer from "./components/Footer";
import ReelsPage from "./pages/ReelsPage";
import AdPopup from "./components/AdPop";
import Payment from "./pages/Payment";
import "./App.css"; // Include your global styles here
import { listenToAuthState } from './slices/userSlice';
import { useDispatch,useSelector } from "react-redux"; // Import useSelector to access Redux state

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
  const { loading } = useSelector((state) => state.user); // Access user state from Redux
  const searchParams = new URLSearchParams(window.location.search);
  const showAdParam = searchParams.get("showAd");
  const imgLink = searchParams.get("img");
  const dispatch = useDispatch();
  
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

  // Conditionally render based on the loading state
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loader component
  }

  return (
    <div className="full-screen">
      {/* Conditionally render Navbar */}
      {!location.pathname.startsWith("/qr") && <Navbar />}
      {showAd && <AdPopup img={img} onClose={() => closeAd()} />}
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
          <Route path="/Login" element={<HomePage />} />
          <Route path="/SignUp" element={<HomePage />} />
          <Route path="/reels/:reelId" element={<ReelsPage />} />
          <Route path="/upi" element={<Payment />} />
        </Routes>
        {/* Conditionally render Footer */}
        {!location.pathname.startsWith("/reels") &&
          !location.pathname.startsWith("/qr") && <Footer />}
      </div>
    </div>
  );
};


export default App;
