import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./ReelsPage.css";

const ReelsPage = () => {
  const { reelID } = useParams();
  const location = useLocation();
  const [contentList, setContentList] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  const dummyReels = [
    {
      id: "reel1",
      profileImage: "/avatar.jpg",
      name: "Someone1",
      description: "Random Reel 1 shown for testing purpose",
      image:
        "https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/Screenshot%202024-08-11%20at%207.30.42%20PM.png?alt=media&token=e408fb1a-b3da-4cbe-b3a9-0bebf08e92be",
    },
    {
      id: "reel2",
      profileImage: "/avatar.jpg",
      name: "Someone2",
      description: "Random Reel 2 shown for testing purpose",
      image:
        "https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/Screenshot%202024-08-11%20at%207.30.36%20PM.png?alt=media&token=fcc3f5e0-e987-4bd1-bed3-51a06ac7b851",
    },
    {
      id: "reel3",
      profileImage: "/avatar.jpg",
      name: "Someone3",
      description: "Random Reel 3 shown for testing purpose",
      image:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "reel4",
      profileImage: "/avatar.jpg",
      name: "Someone4",
      description: "Random Reel 4 shown for testing purpose",

      image:
        "https://plus.unsplash.com/premium_photo-1686090450479-370d5ddf4de1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8",
    },
  ];

  const fetchReelById = useCallback(
    (id) => dummyReels.find((reel) => reel.id === id),
    [dummyReels]
  );

  useEffect(() => {
    let initialIndex = 0;

    if (location.state?.contentList) {
      setContentList(location.state.contentList);
      const reelIndex = location.state.contentList.findIndex(
        (reel) => reel.id === reelID
      );
      initialIndex = reelIndex !== -1 ? reelIndex : 0;
    } else if (reelID) {
      const reel = fetchReelById(reelID);
      if (reel) {
        setContentList([reel, ...dummyReels.filter((r) => r.id !== reelID)]);
      } else {
        setContentList(dummyReels);
      }
    } else {
      setContentList(dummyReels);
    }

    setCurrentReelIndex(initialIndex);
  }, [reelID, location.state, fetchReelById, dummyReels]);

  const handleSlideChange = (swiper) => {
    setCurrentReelIndex(swiper.activeIndex);
  };

  return (
    <div className="reels-page">
      <Swiper
        direction={"vertical"}
        pagination={{
          clickable: true,
        }}
        mousewheel={{
          forceToAxis: true, // Prevents horizontal scroll when scrolling vertically
          releaseOnEdges: true, // Allows scroll outside Swiper boundaries
          sensitivity: 2.8, // Lower value = less sensitive
          thresholdDelta: 100,
        }}
        touchEventsTarget="container" // Ensure Swiper listens to touch events
        onSlideChange={handleSlideChange}
        modules={[Mousewheel]}
        className="mySwiper"
        initialSlide={currentReelIndex}
      >
        {dummyReels.map((reel) => (
          <SwiperSlide key={reel.id} className="">
            <div className="reel-container">
              <img
                className="reel-image"
                src={reel.image}
                alt={reel.description}
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
