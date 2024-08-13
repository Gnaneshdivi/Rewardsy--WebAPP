// src/pages/ReelsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './ReelsPage.css';

const ReelsPage = () => {
  const { reelID } = useParams();
  const location = useLocation();
  const [contentList, setContentList] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Dummy data for reels
  const dummyReels = [
    {
      id: 'reel1',
      description: 'Random Reel 1',
      image: "https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/Screenshot%202024-08-11%20at%207.30.42%20PM.png?alt=media&token=e408fb1a-b3da-4cbe-b3a9-0bebf08e92be",
      url: 'https://firebasestorage.googleapis.com/v0/b/clap-2425e.appspot.com/o/videos%2F2020-08-14%2021%3A18%3A25.854864?alt=media&token=e55cb5c6-e20e-41c6-b45d-d8720a8f4120',
    },
    {
      id: 'reel2',
      description: 'Random Reel 2',
      image: "https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/Screenshot%202024-08-11%20at%207.30.36%20PM.png?alt=media&token=fcc3f5e0-e987-4bd1-bed3-51a06ac7b851",
      url: 'https://firebasestorage.googleapis.com/v0/b/clap-2425e.appspot.com/o/videos%2F2020-08-13%2018%3A55%3A38.501279?alt=media&token=0f9e8f13-12c4-41e8-97d1-dde944ca4015',
    },
    // Add more dummy data if needed
  ];

  const fetchRandomReels = () => {
    return dummyReels;
  };

  const fetchReelById = (id) => {
    return dummyReels.find(reel => reel.id === id);
  };

  useEffect(() => {
    if (location.state?.contentList) {
      setContentList(location.state.contentList);
      const reelIndex = location.state.contentList.findIndex(reel => reel.id === reelID);
      if (reelIndex !== -1) {
        setCurrentReelIndex(reelIndex);
      }
    } else if (reelID) {
      const reel = fetchReelById(reelID);
      if (reel) {
        const randomReels = fetchRandomReels();
        setContentList([reel, ...randomReels.filter(r => r.id !== reelID)]);
        setCurrentReelIndex(0);
      }
    } else {
      const randomReels = fetchRandomReels();
      setContentList(randomReels);
      setCurrentReelIndex(0);
    }
  }, [reelID, location.state]);

  const handleScroll = (e) => {
    if (isScrolling) return;

    if (e.deltaY > 0) {
      if (currentReelIndex < contentList.length - 1) {
        setIsScrolling(true);
        setCurrentReelIndex(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 600); // Match with the CSS transition time
      }
    } else {
      if (currentReelIndex > 0) {
        setIsScrolling(true);
        setCurrentReelIndex(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 600); // Match with the CSS transition time
      }
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [contentList, currentReelIndex, isScrolling]);

  const handleTouchMove = (e) => {
    if (isScrolling) return;

    const touchStartY = e.touches[0].clientY;

    const handleTouchEnd = (event) => {
      const touchEndY = event.changedTouches[0].clientY;
      if (touchStartY - touchEndY > 50) {
        if (currentReelIndex < contentList.length - 1) {
          setIsScrolling(true);
          setCurrentReelIndex(prev => prev + 1);
          setTimeout(() => setIsScrolling(false), 600);
        }
      } else if (touchStartY - touchEndY < -50) {
        if (currentReelIndex > 0) {
          setIsScrolling(true);
          setCurrentReelIndex(prev => prev - 1);
          setTimeout(() => setIsScrolling(false), 600);
        }
      }
    };

    window.addEventListener('touchend', handleTouchEnd, { once: true });
  };

  return (
    <div className="reels-page">
      {contentList.map((reel, index) => (
        <div
          key={reel.id}
          className={`reel-container ${index === currentReelIndex ? 'active' : ''}`}
          style={{ transform: `translateY(${(index - currentReelIndex) * 100}%)` }}
        >
          <video
            src={reel.url}
            className="reel-video"
            autoPlay
            loop
            muted
          />
          <div className="reel-description">{reel.description}</div>
        </div>
      ))}
    </div>
  );
};

export default ReelsPage;
