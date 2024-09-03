// src/components/OfferCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OfferCard.css';
import { redeemOffers } from '../services/OffersService';

const OfferCard = ({ offer, context }) => {
  const navigate = useNavigate();
  const [redeemedCode, setRedeemedCode] = useState(null);
  const [redeemCodeLoading, setRedeemedCodeLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  // Determine the button text based on the context prop
  const buttonText = context === 'store' ? 'Redeem' : 'Explore';

  // Handle the redeem button click
  const handleButtonClick = async () => {
    if (context === 'home') {
      navigate(`/store/${offer.store}`);
    } else if (context === 'store') {
      setRedeemedCodeLoading(true);
      let userId = "55zPkuLeqAYJBGH35FHXHwylDim1";
      let token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNjNWU0MTg0M2M1ZDUyZTY4ZWY1M2UyYmVjOTgxNDNkYTE0NDkwNWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmV3YXJkc3ktYXBwIiwiYXVkIjoicmV3YXJkc3ktYXBwIiwiYXV0aF90aW1lIjoxNzI1MzgzNTQ5LCJ1c2VyX2lkIjoiNTV6UGt1TGVxQVlKQkdIMzVGSFhId3lsRGltMSIsInN1YiI6IjU1elBrdUxlcUFZSkJHSDM1RkhYSHd5bERpbTEiLCJpYXQiOjE3MjUzODM1NDksImV4cCI6MTcyNTM4NzE0OSwicGhvbmVfbnVtYmVyIjoiKzkxNjI2NDQ2NTQ3NSIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzkxNjI2NDQ2NTQ3NSJdfSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ.omDn9ln5-dKAflvxtb_UwxJDU2c85vwfC_JZ0ij42g775nLoHH85wbp7GRx2vNOZFkWHedk9Z5aEMEi7SFs37rMdHFsdgbYMmLTm2VFOTFQy32tHD-HAQYc4NvnMnLyCRf5wKe7V9NIaxL1vf4B7FjcaOu-sI95jN8Xs1L9GrCn_7jRmCgsI1T7PZS-O6ZSPVCWBh9xWbX0FBXEiq6RywKXmCoX_z5e7JLROMWAAQLTFg65y8EefPQ_su9D-3g8_vuVr8SQF_9b06kv6ePdLU1_uWqDfxSOLZ7CDj08Pt6ccyPRZxLO3cCqBh-dF66p1quDmnvkeJWtLvv3OP_jNfw";
      let code = await redeemOffers(offer.id,userId,token);
      setRedeemedCode(code);
      setRedeemedCodeLoading(false);
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
            <button className="offer-button" onClick={handleButtonClick} disabled={redeemCodeLoading}>
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
