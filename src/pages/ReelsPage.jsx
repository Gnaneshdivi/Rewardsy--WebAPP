import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AdPopup from "../components/AdPopup";
import "swiper/css";
import "./ReelsPage.css";

// Dummy data for reels
const dummyReels = [
  {
    id: "reel1",
    profileImage: "/avatar.jpg",
    name: "Someone1",
    description: "Random Reel 1 shown for testing purpose",
    image:
      "https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/Screenshot%202024-08-11%20at%207.30.42%20PM.png?alt=media&token=e408fb1a-b3da-4cbe-b3a9-0bebf08e92be",
    url: "https://firebasestorage.googleapis.com/v0/b/clap-2425e.appspot.com/o/videos%2F2020-08-13%2018%3A55%3A38.501279?alt=media&token=0f9e8f13-12c4-41e8-97d1-dde944ca4015",
  },
  {
    id: "reel2",
    profileImage: "/avatar.jpg",
    name: "Someone2",
    description: "Random Reel 2 shown for testing purpose",
    url: "https://firebasestorage.googleapis.com/v0/b/clap-2425e.appspot.com/o/videos%2F2020-08-14%2021%3A18%3A25.854864?alt=media&token=e55cb5c6-e20e-41c6-b45d-d8720a8f4120",
    image:
      "https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/Screenshot%202024-08-11%20at%207.30.36%20PM.png?alt=media&token=fcc3f5e0-e987-4bd1-bed3-51a06ac7b851",
  },
];

const ReelsPage = () => {
  const { reelID } = useParams(); // Get the current reel ID from the URL
  const navigate = useNavigate(); // For updating the URL
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const videoRefs = useRef([]); // To store references to video elements
  const [adData, setAdData] = useState(null);

  useEffect(() => {
    const fetchAdData = async () => {
      const docRef = doc(db, "qr", "DYj9KEMYlThEmP5eCFW5"); // Use a specific doc ID for reels ad
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().active && docSnap.data().ads) {
        setAdData(docSnap.data());
      }
    };

    const adShown = localStorage.getItem("adShown");

    if (!adData && !adShown) {
      fetchAdData();
    }
  }, [adData]);

  // Set the initial reel index based on the reel ID in the URL
  useEffect(() => {
    const initialIndex = dummyReels.findIndex((reel) => reel.id === reelID);
    if (initialIndex !== -1) {
      setCurrentReelIndex(initialIndex);
    }
  }, [reelID]);

  // Handle video playback when the slide changes
  const handleSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;

    if (newIndex !== currentReelIndex) {
      // Pause the previous video
      if (videoRefs.current[currentReelIndex]) {
        videoRefs.current[currentReelIndex].pause();
        videoRefs.current[currentReelIndex].currentTime = 0; // Reset to start
      }

      // Play the new video
      if (videoRefs.current[newIndex]) {
        videoRefs.current[newIndex].play();
      }

      setCurrentReelIndex(newIndex);
      const newReelID = dummyReels[newIndex].id;
      navigate(`/reels/${newReelID}`, { replace: true });
    }
  };

  // Automatically play the video when the component is mounted
  useEffect(() => {
    if (videoRefs.current[currentReelIndex]) {
      videoRefs.current[currentReelIndex].play();
    }
  }, [currentReelIndex]);

  // Pause video on window blur and resume on focus
  useEffect(() => {
    const handleWindowBlur = () => {
      if (videoRefs.current[currentReelIndex]) {
        videoRefs.current[currentReelIndex].pause();
      }
    };

    const handleWindowFocus = () => {
      if (videoRefs.current[currentReelIndex]) {
        videoRefs.current[currentReelIndex].play();
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [currentReelIndex]);

  // Toggle play/pause on video click
  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleAdClose = () => {
    setAdData(null); // Close the popup
    localStorage.setItem("adShown", "true"); // Set a flag in localStorage so the popup doesn't show again
  };

  return (
    <div className="reels-page">
      {adData && <AdPopup adData={adData} onClose={handleAdClose} />}
      {/* Show AdPopup initially */}
      <Swiper
        direction={"vertical"}
        mousewheel={true}
        onSlideChange={handleSlideChange}
        modules={[Mousewheel]}
        className="mySwiper"
        initialSlide={currentReelIndex}
      >
        {dummyReels.map((reel, index) => (
          <SwiperSlide key={reel.id} className="">
            <div className="reel-container">
              <video
                className="reel-video"
                src={reel.url}
                poster={reel.image}
                playsInline
                ref={(el) => (videoRefs.current[index] = el)} // Store video ref
                onClick={() => togglePlayPause(index)} // Toggle play/pause on click
              />
              <div className="reel-details">
                <div className="profile-container">
                  <img
                    className="profile-image"
                    src={reel.profileImage}
                    alt={reel.name}
                  />
                  <p className="profile-name">{reel.name}</p>
                </div>
                <p className="reel-description">{reel.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReelsPage;
