import React from "react";
import StoreCard from "./StoreCard";
import "./StoresTab.css";
import { LoadingOutlined } from '@ant-design/icons';

const StoresTab = ({ stores, context, isLoading }) => {
  return (
    <div className="store-tab-container">
      {isLoading ? (
        <div className="loading-container">
          <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />
        </div>
      ) : (
        <>
          {stores.length === 0 ? (
            <div className="store-placeholder-text">
              No stores found under this category
            </div>
          ) : (
            <div className="store-tab-grid-container">
              {stores.map((store, index) => (
                <StoreCard key={index} store={store} context={context} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StoresTab;
