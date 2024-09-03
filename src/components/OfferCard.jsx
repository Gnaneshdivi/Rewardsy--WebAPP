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
      let userId = "abcd";
      let token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNjNWU0MTg0M2M1ZDUyZTY4ZWY1M2UyYmVjOTgxNDNkYTE0NDkwNWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmV3YXJkc3ktYXBwIiwiYXVkIjoicmV3YXJkc3ktYXBwIiwiYXV0aF90aW1lIjoxNzI1MzgwNzU5LCJ1c2VyX2lkIjoiYWJjZCIsInN1YiI6ImFiY2QiLCJpYXQiOjE3MjUzODA3NTksImV4cCI6MTcyNTM4NDM1OSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJjdXN0b20ifX0.VQRAeZVYRinsWYv_FFIBv-KQFKHcqciTVz5Q7_WSVc2DV03Az7WO2WGlLn2MXQslBp39wKFV6IaKF32dnSy9Hn3_h96fQHOxLjcAP8p1DTB36TAUY_Ij5nrHOj4_QxCKsDSnty55UKe4PtUhWnahxNzCxtqbnB45tH-8c_1UfpPP5Xp-2y03Ui34LEXiW3w2i2v5UeLIwvUSZqGCfI-rr3_BDQEnPk6Bs0lv-Cw3t4vF__sAb36L4ZEShj1jvtlba0RVQysEMWTc-M2aphYHVH9u5XXJboG-GzAAE8rBz_PpdyTjJG3lS_BNxqprTkGvMkPzisR1Z4dCTBJzsniP0Q";
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
