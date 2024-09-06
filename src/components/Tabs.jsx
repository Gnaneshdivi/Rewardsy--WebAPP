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
  const [activeTab, setActiveTab] = useState("offers");

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
        <div
          className={`tab ${activeTab === "content" ? "active" : ""}`}
          onClick={() => handleTabClick("content")}
        >
          Content
        </div>
        {context === "store" ? <div></div> : 
        <div
          className={`tab ${activeTab === "stores" ? "active" : ""}`}
          onClick={() => handleTabClick("stores")}
        >
          Stores
        </div>}
      </div>
      <div className="tab-content-container">
        {activeTab === "offers" && (
          <OffersTab
            offers={offers}
            context={context}
            isLoading={isOffersLoading}
          />
        )}
        {activeTab === "content" && (
          <ContentTab contents={contents} isLoading={isContentsLoading} />
        )}
        {activeTab === "stores" && (
          <StoresTab
            stores={stores}
            context={context}
            isLoading={isStoreLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;
