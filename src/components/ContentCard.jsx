// src/components/ContentCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentCard.css';

const ContentCard = ({ content, contentList }) => {
  const navigate = useNavigate();

  const handleViewReel = () => {
    navigate(`/reels/${content.id}`, { state: { contentList } });
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

export default ContentCard;
