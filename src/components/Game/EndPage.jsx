import React from "react";
import OfferCard from "../OfferCard";
import "./EndPage.css";

const EndPage = ({ gameResult, ctaDetails, offer }) => {
  const redirectToStore = () => {
    if (offer && offer.offer) {
      window.location.href = `/store/${offer.offer.store}`;
    }
    window.location.href = `/`;
  };
  return (
    <div
      className="end-section-content"
      // style={{ backgroundImage: `url(${ctaDetails.cta.end})` }}
    >
      <h1 className="end-heading">
        {gameResult?.result === "won" ? "Congratulations! You Won!" : "Game Over!"}
      </h1>
      <img
      
        src=  {gameResult.result === "won"
        ? "https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/application%2Fwin.gif?alt=media&token=8e0f8c04-efea-4a6b-b629-53fddfa226e5"
        : "https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/application%2FLose.gif?alt=media&token=25f45e91-e71c-4332-b524-309d554b3356"}
        alt="Celebration or Game Over"
        className="end-gif"
      />
      {gameResult?.result !== "won" ? (
        <button className="retry-button" onClick={redirectToStore}>
          Bad Luck! Try Again
        </button>
      ) : (
        offer?.offer && (
          <div className="offer-container">
            <OfferCard offer={offer.offer} context={"cta"} code={offer?.redemption?.code} />
            <button className="store-button" onClick={redirectToStore}>
              Go to Store Page
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default EndPage;
