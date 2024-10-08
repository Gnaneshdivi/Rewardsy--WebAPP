import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./StoreCard.css";

const StoreCard = ({ store, context }) => {
  const navigate = useNavigate();
  const [redeemedCode, setRedeemedCode] = useState(null);
  const [redeemCodeLoading, setRedeemedCodeLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  // Determine the button text based on the context prop
  const buttonText = context === "store" ? "Redeem" : "Explore";

  // Handle the redeem button click
  const handleButtonClick = async () => {
    if (context === "home") {
      navigate(`/store/${store.id}`);
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
    <div className="store-card">
      <div className="store-body">
        <div className="offer-logo">
          <img src={store.dp} alt={store.name} />
        </div>
        <div className="divider"></div>
        <div className="store-details">
          <div className="offer-header">
            {store.category.map((tag, index) => (
              <span key={index} className="store-tag">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="store-title">{store.name}</h3>
          <p className="store-description">{store.desc}</p>
          {context === "store" && redeemedCode ? (
            <div className="redeemed-section" onClick={handleCopyClick}>
              <p className="redeemed-code">Redeem Code: {redeemedCode}</p>
              <p className="copy-message">{copyMessage}</p>
            </div>
          ) : (
            <button
              className="store-button"
              onClick={handleButtonClick}
              disabled={redeemCodeLoading}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>

// my component

    // <div className="store-card">
    //   <div className="store-body">
    //     <div className="top">
    //       <div className="left">
    //         <div className="offer-logo">
    //           <img src={store.dp} alt={store.name} />
    //         </div>
    //       </div>
    //       <div className="right">
    //         <div className="name-button">
    //           <h3 className="store-title">{store.name}</h3>
    //           <div className="button">
    //             {context === "store" && redeemedCode ? (
    //               <div className="redeemed-section" onClick={handleCopyClick}>
    //                 <p className="redeemed-code">Redeem Code: {redeemedCode}</p>
    //                 <p className="copy-message">{copyMessage}</p>
    //               </div>
    //             ) : (
    //               <button
    //                 className="store-button"
    //                 onClick={handleButtonClick}
    //                 disabled={redeemCodeLoading}
    //               >
    //                 {buttonText}
    //               </button>
    //             )}
    //           </div>
    //         </div>
    //         <div className="offer-header">
    //           {store.category.map((tag, index) => (
    //             <span key={index} className="store-tag">
    //               {tag}
    //             </span>
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //     <div className="bottom">
    //       <p className="store-description">{store.desc}</p>
    //     </div>
    //   </div>
    // </div>
  );
};

export default StoreCard;
