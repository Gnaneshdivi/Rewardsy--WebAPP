// src/components/ContentCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentCard.css';

const ContentTab = ({ content, reels }) => {
  const navigate = useNavigate();

  const handleViewReel = () => {
    navigate(`/reels/${content.id}`, { state: { reels } });
  };


  return (
    <div className="content-card" onClick={handleViewReel}>
      <div className="content-image-container">
        <img src={content.url} alt={content.description} className="content-image" />
        <img src={"../playIcon.png"} alt="Play Icon" className="play-icon" />
      </div>
    </div>
  );
};

export default ContentTab;
