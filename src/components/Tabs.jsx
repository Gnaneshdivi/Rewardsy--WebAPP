import React, { useState, useEffect } from "react";
import OffersTab from "./OffersTab";
import ContentTab from "../components/ContentTab";
import StoresTab from "./StoresTab";
import "./Tabs.css";
import { getOffers } from "../services/OffersService";
import { getReels } from "../services/ReelsServices";
import { getStoreByLocation } from "../services/StoreServices";

const Tabs = ({ SearchKey, selectedCategory, context }) => {
  const [activeTab, setActiveTab] = useState("stores");
  const [Offers, setOffers] = useState([]);
  const [Reels, setReels] = useState([]);
  const [Stores, setStores] = useState([]);
  const [FilteredOffers, setFilteredOffers] = useState([]);
  const [FilteredStores, setFilteredStores] = useState([]);
  const [isOffersLoading, setisOffersLoading] = useState(false);
  const [isReelsLoading, setisReelsLoading] = useState(false);
  const [isStoreLoading, setisStoreLoading] = useState(true);
  const [searchKey, setSearchKey] = useState(SearchKey || "All");

  useEffect(() => {
    const loadStores = async () => {
      try {
        const storeData = await getStoreByLocation("");
        setStores(storeData);
        setFilteredStores(storeData);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setisStoreLoading(false);
      }
    };

    loadStores();
  }, []);

  useEffect(() => {
    setSearchKey(SearchKey);
  }, [SearchKey]);

  const isValidString = (value) => typeof value === "string";

  const filterOffersAndStores = () => {
    const lowerSearchKey = searchKey ? searchKey.toLowerCase() : "";
    const lowerCategory = selectedCategory
      ? selectedCategory.toLowerCase()
      : "all";

    if (!isStoreLoading) {
      const filteredOffers = Offers.filter(
        (offer) =>
          (lowerCategory === "all" ||
            (isValidString(offer.category) &&
              offer.category.toLowerCase() === lowerCategory)) &&
          (offer.title.toLowerCase().includes(lowerSearchKey) ||
            offer.tags.some((tag) =>
              tag.toLowerCase().includes(lowerSearchKey)
            ))
      );

      const filteredStores = Stores.filter(
        (store) =>
          (lowerCategory === "all" ||
            (isValidString(store.category) &&
              store.category.toLowerCase() === lowerCategory)) &&
          isValidString(store.name) &&
          store.name.toLowerCase().includes(lowerSearchKey)
      );

      return {
        offers: filteredOffers,
        stores: filteredStores,
      };
    }
  };

  useEffect(() => {
    const searchResults = filterOffersAndStores();
    if (searchResults) {
      setFilteredOffers(searchResults.offers);
      setFilteredStores(searchResults.stores);
    }
  }, [searchKey, Offers, Stores, selectedCategory, isStoreLoading]);

  const handleTabClick = async (tab) => {
    setActiveTab(tab);

    if (tab === "offers" && Offers.length === 0) {
      setisOffersLoading(true);
      try {
        const offersData = await getOffers();
        setOffers(offersData);
        setFilteredOffers(offersData);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setisOffersLoading(false);
      }
    }

    if (tab === "content" && Reels.length === 0) {
      setisReelsLoading(true);
      try {
        const reelsData = await getReels();
        setReels(reelsData);
      } catch (error) {
        console.error("Error fetching reels:", error);
      } finally {
        setisReelsLoading(false);
      }
    }
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
        {context === "store" ? null : (
          <div
            className={`tab ${activeTab === "stores" ? "active" : ""}`}
            onClick={() => handleTabClick("stores")}
          >
            Stores
          </div>
        )}
        <div
          className={`tab ${activeTab === "content" ? "active" : ""}`}
          onClick={() => handleTabClick("content")}
        >
          Reels
        </div>
      </div>
      <div className="tab-content-container">
        {activeTab === "offers" && (
          <OffersTab
            offers={FilteredOffers}
            context={context}
            isLoading={isOffersLoading}
          />
        )}
        {context === "home" && activeTab === "stores" && (
          <StoresTab
            stores={FilteredStores}
            context={context}
            isLoading={isStoreLoading}
          />
        )}
        {activeTab === "content" && (
          <ContentTab contents={Reels} isLoading={isReelsLoading} />
        )}
      </div>
    </div>
  );
};

export default Tabs;
