import React from 'react';
import OfferCard from '../components/OfferCard';
import './OffersPage.css';

const OffersPage = ({ offers,context }) => {
  return (
    <div className="offers-page-container">
      <div className="offers-page-grid-container">
        {offers.map((offer, index) => (
          <OfferCard key={index} offer={offer} context={context}/>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
