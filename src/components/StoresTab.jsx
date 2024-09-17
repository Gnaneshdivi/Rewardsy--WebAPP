import React from "react";
import StoreCard from "./StoreCard";
import "./StoresTab.css";
// import ClipLoader from "react-spinners/ClipLoader";
import { LoadingOutlined } from '@ant-design/icons';

const StoresTab = ({ stores, context, isLoading }) => {
  console.log(stores);
  return (
    <div className="store-tab-container">
      {isLoading ? (
        <LoadingOutlined loading={isLoading} color="white"/>
        // <ClipLoader loading={isLoading} color="white" />
      ) : (
        <>
          {stores.length === 0 ? (
            <div className="store-placeholder-text">
              No stores found under this categories
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
