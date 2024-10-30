import React from "react";
import { Row, Col, Spin, Typography } from "antd";
import OfferCard from "./OfferCard";
import { LoadingOutlined } from '@ant-design/icons';
import "./OffersTab.css";

const { Text } = Typography;

const OffersTab = ({ offers, context, isLoading }) => {
  return (
    <div className="offers-tab-container">
      {isLoading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: 'var(--secondary-color)' }} spin />} />
      ) : (
        <>
          {offers.length === 0 ? (
            <Text className="offer-placeholder-text">No offers found under this category</Text>
          ) : (
            <Row gutter={[15, 15]} justify="center" className="offers-tab-grid-container">
              {offers.map((offer, index) => (
                <Col key={index}
                xs={24}  // 1 column on extra small screens
                sm={24}  // 1 column on small screens
                md={24}  // 1 column on medium screens (up to 1450px)
                lg={12}  // 2 columns on large screens
                xl={12}  // 2 columns on extra-large screens
                style={{ display: 'flex', justifyContent: 'center' }}>
                  <OfferCard offer={offer} context={context} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default OffersTab;
