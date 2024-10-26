import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OfferCard.css";
import { redeemOffers } from "../services/OffersService";
import { useSelector } from "react-redux";

const OfferCard = ({ offer, context }) => {
  const navigate = useNavigate();
  const [redeemedCode, setRedeemedCode] = useState(null);
  const [redeemCodeLoading, setRedeemedCodeLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const { userDetails } = useSelector((state) => state.user);

  const buttonText = context === "store" ? "Redeem" : "Explore";

  const handleButtonClick = async () => {
    if (context === "home") {
      navigate(`/store/${offer.store}`);
    } else if (context === "store") {
      if (userDetails) {
        setRedeemedCodeLoading(true);
        let userId = userDetails.uid;
        let token = userDetails.token;
        let code = await redeemOffers(offer.id, userId, token);
        setRedeemedCode(code);
        setRedeemedCodeLoading(false);
      } else {
        navigate(`/login`);
      }
    }
  };

  const handleCopyClick = () => {
    if (redeemedCode) {
      navigator.clipboard.writeText(redeemedCode).then(() => {
        setCopyMessage("Code copied to clipboard!");
        setTimeout(() => setCopyMessage(""), 2000);
      });
    }
  };

  const onFocus = (clickedId) => {
    if (context === "store") {
      const offers = document.querySelectorAll(".offer-card");

      offers.forEach((offer) => {
        const offerId = offer.getAttribute("data-offer-id");

        if (offerId === clickedId) {
          offer.classList.remove("blurred");
        } else {
          offer.classList.add("blurred");
        }
      });
    }
  };

  return (
    <div
      className={`offer-card ${context === "store" ? "blurred" : ""}`}
      data-offer-id={offer.id}
      onClick={() => onFocus(offer.id)}
    >
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
