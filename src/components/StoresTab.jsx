import React from "react";
import StoreCard from "./StoreCard";
import "./StoresTab.css";
import ClipLoader from "react-spinners/ClipLoader";

const StoresTab = ({ stores, context, isLoading }) => {
  return (
    <>
      <div className="store-tab-container">
        {isLoading ? (
          <ClipLoader loading={isLoading} color="white" />
        ) : (
          <>
            <div className="store-tab-grid-container">
              {stores.map((store, index) => (
                <StoreCard key={index} store={store} context={context} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default StoresTab;
