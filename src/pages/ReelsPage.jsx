import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import "./ReelsPage.css";
import { getReels } from "../services/ReelsServices";

const ReelsPage = () => {
  const { reelId } = useParams(); // Get the current reel ID from the URL
  const navigate = useNavigate(); // For updating the URL
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const videoRefs = useRef([]); // To store references to video elements
  const [reels, setReels] = useState([]);
  const [isReelsLoading, setisReelsLoading] = useState(true);

  useEffect(() => {
    const updateReels = async () => {
      const reelsList = await getReels();
      setReels(reelsList);
      setisReelsLoading(false);
    }
    updateReels();
  }, []);

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
      const newReelID = reels[newIndex].id;
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

  return (
    <div className="reels-page">
      {isReelsLoading ? (
        <>Loading ...</>
      ) : (
        <Swiper
          direction={"vertical"}
          mousewheel={true}
          onSlideChange={handleSlideChange}
          modules={[Mousewheel]}
          className="mySwiper"
          initialSlide={currentReelIndex}
        >
          {reels.map((reel, index) => (
            <SwiperSlide key={reel.id} className="">
              <div className="reel-container">
                <video
                  className="reel-video"
                  src={reel.link}
                  poster={reel.url}
                  playsInline
                  ref={(el) => (videoRefs.current[index] = el)} // Store video ref
                  onClick={() => togglePlayPause(index)} // Toggle play/pause on click
                />
                {console.log(videoRefs.current.map((e)=>e.paused))}
                <div className="reel-details">
                  <div className="profile-container">
                    <img
                      className="profile-image"
                      src={reel.url}
                      alt={reel.description}
                    />
                    <p className="profile-name">Reel Name</p>
                  </div>
                  <p className="reel-description">{reel.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ReelsPage;
