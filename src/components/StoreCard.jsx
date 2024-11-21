// src/components/StoreCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./StoreCard.css";

const StoreCard = ({ store, context }) => {
  const navigate = useNavigate();

  const buttonText = context === "store" ? "Redeem" : "Explore";

  const handleButtonClick = () => {
    if (context === "home") {
      navigate(`/store/${store.id}`);
    }
  };

  return (
    <div className="store-card">
      <div className="store-card-logo">
        <img src={store.background} alt={store.name} />
      </div>
      <div className="store-card-details">
          <div className="store-card-info">
            <h3 className="store-card-title">{store.name}</h3>
            <p className="store-card-description">{store.desc}</p>
          </div>
          <button className="store-card-button" onClick={handleButtonClick}>
            {buttonText}
          </button>
        
      </div>
    </div>
  );
};

export default StoreCard;
