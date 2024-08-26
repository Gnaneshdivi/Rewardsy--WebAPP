// src/components/OfferCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OfferCard.css';

const OfferCard = ({ offer, context }) => {
  const navigate = useNavigate();
  const [redeemedCode, setRedeemedCode] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');

  // Determine the button text based on the context prop
  const buttonText = context === 'store' ? 'Redeem' : 'Explore';

  // Function to generate a random code (you can customize this logic)
  const generateCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  // Handle the redeem button click
  const handleButtonClick = () => {
    if (context === 'home') {
      navigate(`/store/${offer.store}`);
    } else if (context === 'store') {
      const code = generateCode();
      setRedeemedCode(code);
    }
  };

  // Handle code copy
  const handleCopyClick = () => {
    if (redeemedCode) {
      navigator.clipboard.writeText(redeemedCode).then(() => {
        setCopyMessage('Code copied to clipboard!');
        setTimeout(() => setCopyMessage(''), 2000); // Clear the message after 2 seconds
      });
    }
  };

  return (
    <div className="offer-card">
      <div className="offer-body">
        <div className="offer-logo">
          <img src={offer.image} alt={offer.title} />
        </div>
        <div className="divider"></div>
        <div className="offer-details">
          <div className="offer-header">
            {offer.tags.map((tag, index) => (
              <span key={index} className="offer-tag">{tag}</span>
            ))}
          </div>
          <h3 className="offer-title">{offer.title}</h3>
          <p className="offer-description">{offer.description}</p>
          {context === 'store' && redeemedCode ? (
            <div className="redeemed-section" onClick={handleCopyClick}>
              <p className="redeemed-code">Redeem Code: {redeemedCode}</p>
              <p className="copy-message">{copyMessage}</p>
            </div>
          ) : (
            <button className="offer-button" onClick={handleButtonClick}>
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
