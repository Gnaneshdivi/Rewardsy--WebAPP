import React, { useEffect, useState } from "react";
import CarouselComponent from "../components/Carousel";
import Categories from "../components/categories";
import Tabs from "../components/Tabs";
import "./HomePage.css";
import { getOffers } from "../services/OffersService";
import { getReels } from "../services/ReelsServices";
import { getStoreByLocation } from "../services/StoreServices";
import SearchInput from "../components/SearchInput";

const HomePage = () => {
  const [Offers, setOffers] = useState([]); // Original Offers data
  const [Reels, setReels] = useState([]);
  const [Stores, setStores] = useState([]); // Original Stores data
  const [FilteredOffers, setFilteredOffers] = useState([]); // Filtered Offers
  const [FilteredStores, setFilteredStores] = useState([]); // Filtered Stores
  const [isOffersLoading, setisOffersLoading] = useState(true);
  const [isReelsLoading, setisReelsLoading] = useState(true);
  const [isStoreLoading, setisStoreLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("All");

  useEffect(() => {
    const updateData = async () => {
      try {
        const [offersData, reelsData, storeData] = await Promise.all([
          getOffers(),
          getReels(),
          getStoreByLocation(""),
        ]);
        setOffers(offersData); // Save original Offers
        setStores(storeData); // Save original Stores
        setReels(reelsData);
        setFilteredOffers(offersData); // Initialize filtered Offers with original
        setFilteredStores(storeData); // Initialize filtered Stores with original
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setisOffersLoading(false);
        setisReelsLoading(false);
        setisStoreLoading(false);
      }
    };

    updateData();
  }, []);

  const bannerImages = ["/carousal/1.png", "/carousal/2.png"];

  const categories = [
    { name: "All", asset: "/categories/discount.png" },
    { name: "Restaurants", asset: "/categories/cutlery.png" },
    { name: "Beauty", asset: "/categories/cosmetics.png" },
    { name: "Fashion", asset: "/categories/tshirt.png" },
    { name: "Fitness", asset: "/categories/fitness.png" },
    { name: "Electronics", asset: "/categories/technology.png" },
    { name: "Hotel", asset: "/categories/hotel.png" },
    { name: "Pharmacy", asset: "/categories/tablets.png" },
    { name: "Home Services", asset: "/categories/service.png" },
    { name: "Media & Education", asset: "/categories/open-book.png" },
    { name: "Discount", asset: "/categories/discount.png" },
  ];

  const updateSearchKey = (word) => {
    setSearchKey(word);
  };

  // Search function to filter offers, stores, and categories including tags
  const searchOffersAndStores = () => {
    const lowerSearchKey = searchKey.toLowerCase();

    const filteredOffers = Offers.filter(
      (offer) =>
        offer.title.toLowerCase().includes(lowerSearchKey) ||
        offer.tags.some((tag) => tag.toLowerCase().includes(lowerSearchKey)) // Search by tags
    );

    const filteredStores = Stores.filter((store) =>
      store.name.toLowerCase().includes(lowerSearchKey)
    );

    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(lowerSearchKey)
    );

    const areOffersOrStoresAvailable =
      filteredOffers.length > 0 || filteredStores.length > 0;

    const categoryResult =
      !areOffersOrStoresAvailable && filteredCategories.length > 0
        ? filteredCategories
        : areOffersOrStoresAvailable
        ? filteredCategories
        : "All";

    return {
      offers: filteredOffers.length > 0 ? filteredOffers : [],
      stores: filteredStores.length > 0 ? filteredStores : [],
      categories: categoryResult,
    };
  };

  // Trigger search whenever searchKey changes
  useEffect(() => {
    const searchResults = searchOffersAndStores();

    setFilteredOffers(searchResults.offers); // Set filtered Offers
    setFilteredStores(searchResults.stores); // Set filtered Stores

    // if (searchResults.offers || searchResults.stores || searchResults.categories) {
    //   console.log("Filtered Offers:", searchResults.offers);
    //   console.log("Filtered Stores:", searchResults.stores);
    //   console.log("Categories:", searchResults.categories);
    // } else {
    //   console.log("No results found");
    // }
  }, [searchKey]);

  // Conditionally render Carousel and Categories based on filtered data
  const shouldShowCarouselAndCategories =
    searchKey === "" ||
    searchKey === "All" ||
    (FilteredOffers.length === 0 && FilteredStores.length === 0);


  return (
    <div className="homepage">
      <SearchInput word={updateSearchKey} />

      {/* Conditionally render CarouselComponent and Categories */}
      {shouldShowCarouselAndCategories && (
        <>
          <CarouselComponent images={bannerImages} />
          <Categories
            categories={categories}
            setSelectedCategory={setSearchKey}
            selectedCategory={searchKey}
          />
        </>
      )}

      <Tabs
        offers={FilteredOffers} // Use filtered Offers here
        contents={Reels}
        stores={FilteredStores} // Use filtered Stores here
        context={"home"}
        isOffersLoading={isOffersLoading}
        isContentsLoading={isReelsLoading}
        isStoreLoading={isStoreLoading}
      />
    </div>
  );
};

export default HomePage;
