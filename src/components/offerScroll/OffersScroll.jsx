// src/components/OffersScroll.js
import React from "react";
import { Card, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./OffersScroll.css";

const { Text } = Typography;

const OffersScroll = ({ offers, onViewAll }) => {
  const navigate = useNavigate();

  return (
    <div className="offers-scroll-container">
      <div className="offers-header">
        <Text className="offers-title">Offers</Text>
        <Button type="link" className="view-all-button" onClick={onViewAll}>
          View All
        </Button>
      </div>
      <div className="offers-scroll">
        {offers.slice(0, 3).map((offer, index) => (
          <Card key={index} className="offer-card">
            <img src={offer.image} alt={offer.title} className="offer-image" />
            <Text strong>{offer.title}</Text>
            <Text>{offer.description}</Text>
            <Button className="redeem-button">Redeem</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OffersScroll;
