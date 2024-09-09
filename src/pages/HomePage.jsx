import React, { useState, useEffect } from "react";
import CarouselComponent from "../components/Carousel";
import AdPopup from "../components/AdPopup";
import Categories from "../components/categories";
import Tabs from "../components/Tabs";
import "./HomePage.css";
import { getOffers } from "../services/OffersService";
import { getReels } from "../services/ReelsServices";
import { getStoreByLocation } from "../services/StoreServices";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const [ Offers, setOffers ] = useState([]);
  const [ Reels, setReels ] = useState([]);
  const [ Stores, setStores ] = useState([]);
  const [ isOffersLoading, setisOffersLoading ] = useState(true);
  const [ isReelsLoading, setisReelsLoading ] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const location = useLocation();
  const data = location.state?.data;
  const error = location.state?.error;
  const [showAdPopup, setShowAdPopup] = useState(false);  
  useEffect(() => {
    const updateData = async () => {
      setStores(await getStoreByLocation(""));
      setOffers(await getOffers());
      setReels(await getReels());
      setisOffersLoading(false);
      setisReelsLoading(false);
    };
    updateData();
  }, []);

  useEffect(() => {
    console.log("Data",data)
    // const popupShownKey = `popupShown-${data?.id}`;
    // const popupShown = localStorage.getItem(popupShownKey) === "true";

    if (data && data.active && data.ads) {
      setShowAdPopup(true);

      // localStorage.setItem(popupShownKey, "true");
    }
    if (error) {
      console.error("Error:", error);
    }
  }, [data, error]);

  const images = ["/carousal/1.png", "/carousal/2.png"];

  const categories = ["All", "Fitness", "Discount"];

  return (
    <div className="homepage">
      {showAdPopup && (
        <AdPopup adData={data} onClose={() => setShowAdPopup(false)} />
      )}
      <CarouselComponent images={images} />
      <Categories categories={categories} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory}/>
      <Tabs
        offers={Offers.filter((offer)=> selectedCategory=="All" || offer.tags.includes(selectedCategory))}
        contents={Reels}
        stores={Stores}
        context={"home"}
        isOffersLoading={isOffersLoading}
        isContentsLoading={isReelsLoading}
      />
    </div>
  );
};

export default HomePage;
