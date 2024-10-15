import React, { useEffect, useState } from "react";
import OffersTab from "./OffersTab";
import ContentTab from "../components/ContentTab";
import StoresTab from "./StoresTab";
import "./Tabs.css";
import { getOffers,getOffersByStore } from "../services/OffersService";
import { getReels, getReelsByStore } from "../services/ReelsServices";
import { getStoreByLocation } from "../services/StoreServices";

const Tabs = ({ SearchKey, selectedCategory, context, config }) => {
  const availableTabs = config?.tabs || ["offers", "stores", "content"];

  const determineDefaultTab = () => {
    if (availableTabs.includes("stores")) return "stores";
    if (availableTabs.includes("offers")) return "offers";
    return availableTabs[0] || ""; // Default to the first tab or empty
  };

  const [activeTab, setActiveTab] = useState(determineDefaultTab);
  const [Offers, setOffers] = useState([]);
  const [Reels, setReels] = useState([]);
  const [Stores, setStores] = useState([]);
  const [FilteredOffers, setFilteredOffers] = useState([]);
  const [FilteredStores, setFilteredStores] = useState([]);
  const [isOffersLoading, setIsOffersLoading] = useState(false);
  const [isReelsLoading, setIsReelsLoading] = useState(false);
  const [isStoreLoading, setIsStoreLoading] = useState(false);
  const [searchKey, setSearchKey] = useState(SearchKey || "All");

  useEffect(() => {
    setSearchKey(SearchKey);
  }, [SearchKey]);

  const isValidString = (value) => typeof value === "string";

  const filterOffersAndStores = () => {
    if (Offers.length === 0 && Stores.length === 0) return; // Prevent unnecessary filtering

    const lowerSearchKey = searchKey.toLowerCase();
    const lowerCategory = selectedCategory.toLowerCase();

    const filteredOffers = Offers.filter((offer) => {
      const normalizedTags = offer.tags.map((tag) => tag.toLowerCase());
      const categoryMatch =
        lowerCategory === "all" || normalizedTags.includes(lowerCategory);
      const searchKeyMatch = [
        offer.title.toLowerCase(),
        offer.description?.toLowerCase() || "",
        ...normalizedTags,
      ].some((field) => field.includes(lowerSearchKey));

      return categoryMatch && searchKeyMatch;
    });

    const filteredStores = Stores.filter((store) => {
      const hasMatchingCategory =
        lowerCategory === "all" ||
        store.category.some((tag) => tag.toLowerCase() === lowerCategory);

      const matchesSearchKey =
        (isValidString(store.name) &&
          store.name.toLowerCase().includes(lowerSearchKey)) ||
        (isValidString(store.desc) &&
          store.desc.toLowerCase().includes(lowerSearchKey));

      return hasMatchingCategory && matchesSearchKey;
    });

    setFilteredOffers(filteredOffers);
    setFilteredStores(filteredStores);
  };

  useEffect(() => {
    if ((Offers.length > 0 || Stores.length > 0) && context==="home" ) {
      filterOffersAndStores(); // Only filter if there are offers or stores
    }
  }, [searchKey, Offers, Stores, selectedCategory]);

  const handleTabClick = async (tab) => {
    setActiveTab(tab);
    await loadData(tab);
  };

  const loadData = async (tab) => {
    switch (tab) {
      case "offers":
        if (Offers.length === 0) await loadOffers();
        break;
      case "stores":
        if (Stores.length === 0) await loadStores();
        break;
      case "content":
        if (Reels.length === 0) await loadReels();
        break;
      default:
        break;
    }
  };

  const loadOffers = async () => {
    setIsOffersLoading(true);
    try {
      const offersData = context === "store"
      ?await getOffersByStore(config?.merchantid):await getOffers();
      setOffers(offersData);
      setFilteredOffers(offersData);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setIsOffersLoading(false);
    }
  };

  const loadReels = async () => {
    setIsReelsLoading(true);
    try {
      const reelsData =
        context === "store"
          ? await getReelsByStore(config?.merchantid)
          : await getReels();
      setReels(reelsData);
    } catch (error) {
      console.error("Error fetching reels:", error);
    } finally {
      setIsReelsLoading(false);
    }
  };

  const loadStores = async () => {
    setIsStoreLoading(true);
    try {
      const storeData = await getStoreByLocation("");
      setStores(storeData);
      setFilteredStores(storeData);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsStoreLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab); // Load data for the active tab on initial load
  }, []);

  if (availableTabs.length === 0) {
    return null; // Render nothing if no tabs are available
  }

  return (
    <div>
      <div className="tabs-container">
        {availableTabs.map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      <div className="tab-content-container">
        {activeTab === "offers" && (
          <OffersTab
            offers={FilteredOffers}
            context={context}
            isLoading={isOffersLoading}
          />
        )}
        {activeTab === "stores" && (
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
