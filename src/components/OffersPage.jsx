import React from "react";
import OfferCard from "../components/OfferCard";
import "./OffersPage.css";
import ClipLoader from "react-spinners/ClipLoader";

const OffersPage = ({ offers, context, isLoading }) => {
  return (
    <>
      <div className="offers-page-container">
        {isLoading ? (
          <ClipLoader loading={isLoading} color="white" />
        ) : (
          <>
            <div className="offers-page-grid-container">
              {offers.map((offer, index) => (
                <OfferCard key={index} offer={offer} context={context} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OffersPage;
