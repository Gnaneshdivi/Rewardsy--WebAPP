import React from "react";
import OfferCard from "./OfferCard";
import "./OffersTab.css";
import ClipLoader from "react-spinners/ClipLoader";

const OffersTab = ({ offers, context, isLoading }) => {
  return (
    <>
      <div className="offers-tab-container">
        {isLoading ? (
          <ClipLoader loading={isLoading} color="white" />
        ) : (
          <>
            {offers.length === 0 ? (
              <div className="offer-placeholder-text">
                No offers found under this categories
              </div>
            ) : (
              <div className="offers-tab-grid-container">
                {offers.map((offer, index) => (
                  <OfferCard key={index} offer={offer} context={context} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OffersTab;
