// src/pages/StoresTab.js
import React from "react";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import StoreCard from "./StoreCard";
import "./StoresTab.css";

const StoresTab = ({ stores, context, isLoading }) => {
  return (
    <div className="store-tab-container">
      {isLoading ? (
        <div className="loading-container">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: 'var(--secondary-color)' }} spin />} />
        </div>
      ) : (
        <>
          {stores.length === 0 ? (
            <div className="store-placeholder-text">
              No stores found under this category
            </div>
          ) : (
            <Row
              gutter={[15, 15]}
              className="store-tab-grid-container"
              justify="center"
            >
              {stores.map((store, index) => (
                <Col
                  key={index}
                  xs={24}  // 1 column on extra small screens
                  sm={24}  // 1 column on small screens
                  md={24}  // 1 column on medium screens (up to 1450px)
                  lg={12}  // 2 columns on large screens
                  xl={12}  // 2 columns on extra-large screens
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <StoreCard store={store} context={context} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default StoresTab;
