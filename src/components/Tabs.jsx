import React, { useState } from "react";
import OffersTab from "./OffersTab";
import ContentTab from "../components/ContentTab";
import StoresTab from "./StoresTab";
import "./Tabs.css";

const Tabs = ({
  offers,
  contents,
  stores,
  context,
  isOffersLoading,
  isContentsLoading,
  isStoreLoading
}) => {
  const [activeTab, setActiveTab] = useState("stores");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <div>
      <div className="tabs-container">
        <div
          className={`tab ${activeTab === "offers" ? "active" : ""}`}
          onClick={() => handleTabClick("offers")}
        >
          Offers
        </div>
        {context === "store" ? <div></div> : 
        <div
          className={`tab ${activeTab === "stores" ? "active" : ""}`}
          onClick={() => handleTabClick("stores")}
        >
          Stores
        </div>}
        <div
          className={`tab ${activeTab === "content" ? "active" : ""}`}
          onClick={() => handleTabClick("content")}
        >
          Content
        </div>
        
      </div>
      <div className="tab-content-container">
        {activeTab === "offers" && (
          <OffersTab
            offers={offers}
            context={context}
            isLoading={isOffersLoading}
          />
        )}
        {activeTab === "stores" && (
          <StoresTab
            stores={stores}
            context={context}
            isLoading={isStoreLoading}
          />
        )}
        {activeTab === "content" && (
          <ContentTab contents={contents} isLoading={isContentsLoading} />
        )}
        
      </div>
    </div>
  );
};

export default Tabs;
