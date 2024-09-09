import React from "react";
import StoreCard from "../components/StoreCard";
import "./StoresPage.css";
import ClipLoader from "react-spinners/ClipLoader";

const StoresPage = ({ stores, context, isLoading }) => {
  return (
    <>
      <div className="store-page-container">
        {isLoading ? (
          <ClipLoader loading={isLoading} color="white" />
        ) : (
          <>
            <div className="store-page-grid-container">
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

export default StoresPage;
