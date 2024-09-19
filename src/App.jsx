import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import StorePage from "./pages/StorePage";
import URLForwarding from "./pages/URLForwarding";
import RedirectToHome from "./pages/RedirectToHomepage";
import Footer from "./components/Footer";
import ReelsPage from "./pages/ReelsPage";
import UserContext from "./context/UserContext"; // Import the UserContext
import AdPopup from "./components/AdPop";
import Payment from "./pages/Payment"
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
  const [showAd, setShowAd] = useState(false);
  const [img, setImg]=useState(null);
  const { userDetails, loading } = useContext(UserContext); // Get user details and loading state from context
  const searchParams = new URLSearchParams(window.location.search)
  const showAdParam = searchParams.get('showAd')
  const imgLink = searchParams.get('img')

  useEffect(() => {
    console.log(showAdParam);
    console.log(imgLink);
    if (showAdParam === 'true') {
      setShowAd(true);
      setImg(imgLink);
    }
  }, [showAdParam,imgLink])

  const closeAd = () => {
    setShowAd(false)
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('showAd', 'false')
    window.history.pushState(null, '', newUrl)
  }

  // Show a loading indicator while checking authentication
  if (loading) {
    return<></>; // You can replace this with a spinner or loader component
  }

  return (
    <div className="full-screen">
      {/* Conditionally render Navbar */}
      {!location.pathname.startsWith("/qr") && <Navbar />}
      {showAd && (<AdPopup img={img} onClose={() => closeAd()} />)}
      <div className={location.pathname.startsWith("/reels") ? "no-scroll" : "scroll"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/store" element={<RedirectToHome />} />
          <Route path="/store/:storeId" element={<StorePage />} />
          <Route path="/qr/:shortUrl" element={<URLForwarding />} />
          <Route path="/Login" element={<HomePage />} />
          <Route path="/SignUp" element={<HomePage />} />
          {/* Update the route pattern to catch both /reelID and /reel1, /reel2, etc. */}
          <Route path="/reels/:reelId" element={<ReelsPage />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
        {/* Conditionally render Footer */}
        {!location.pathname.startsWith("/reels") && !location.pathname.startsWith("/qr") && <Footer />}
      </div>
    </div>
  );
};

export default App;
