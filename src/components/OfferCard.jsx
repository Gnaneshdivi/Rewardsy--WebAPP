// src/components/OfferCard.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./OfferCard.css";
import { redeemOffers } from "../services/OffersService";
import UserContext from "../context/UserContext";

const OfferCard = ({ offer, context }) => {
  const navigate = useNavigate();
  const [redeemedCode, setRedeemedCode] = useState(null);
  const [redeemCodeLoading, setRedeemedCodeLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const { userDetails } = useContext(UserContext); // Access user details from context

  // Determine the button text based on the context prop
  const buttonText = context === "store" ? "Redeem" : "Explore";

  // Handle the redeem button click
  const handleButtonClick = async () => {
    if (context === "home") {
      navigate(`/store/${offer.store}`);
    } else if (context === "store") {
      if (userDetails) {
        setRedeemedCodeLoading(true);
        let userId = userDetails.uid;
        let token = userDetails.token;
        let code = await redeemOffers(offer.id, userId, token);
        console.log(userDetails);
        setRedeemedCode(code);
        setRedeemedCodeLoading(false);
      } else {
        navigate(`/login`);
      }
    }
  };

  // Handle code copy
  const handleCopyClick = () => {
    if (redeemedCode) {
      navigator.clipboard.writeText(redeemedCode).then(() => {
        setCopyMessage("Code copied to clipboard!");
        setTimeout(() => setCopyMessage(""), 2000); // Clear the message after 2 seconds
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
              <span key={index} className="offer-tag">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="offer-title">{offer.title}</h3>
          <p className="offer-description">{offer.description}</p>
          {context === "store" && redeemedCode ? (
            <div className="redeemed-section" onClick={handleCopyClick}>
              <p className="redeemed-code">Redeem Code: {redeemedCode}</p>
              <p className="copy-message">{copyMessage}</p>
            </div>
          ) : (
            <button
              className="offer-button"
              onClick={handleButtonClick}
              disabled={redeemCodeLoading}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
