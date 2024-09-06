import React, { useEffect, useState } from "react";
import CarouselComponent from "../components/Carousel";
import Categories from "../components/categories";
import Tabs from "../components/Tabs";
import "./HomePage.css";
import { getOffers } from "../services/OffersService";
import { getReels } from "../services/ReelsServices";
import { getStoreByLocation } from "../services/StoreServices";

const HomePage = () => {
  const [ Offers, setOffers ] = useState([]);
  const [ Reels, setReels ] = useState([]);
  const [ Stores, setStores ] = useState([]);
  const [ isOffersLoading, setisOffersLoading ] = useState(true);
  const [ isReelsLoading, setisReelsLoading ] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ isContentLoading, setisContentLoading ] = useState(true);

  useEffect(() => {
    const updateData = async () => {
      try {
        // Call both APIs concurrently
        const [offersData, reelsData,storeData] = await Promise.all([getOffers(), getReels(),getStoreByLocation("")]);
        
        // Update the state once both API calls are complete
        setOffers(offersData);
        setReels(reelsData);
        setStores(storeData)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // Ensure loading states are updated regardless of success or failure
        setisOffersLoading(false);
        setisReelsLoading(false);
        setisContentLoading(false);
      }
    };
  
    updateData();
  }, []);

  // useEffect(() => {
  //   console.log("Updated Stores: ", Stores); // Log when `Stores` state updates
  // }, [Stores]);

  const images = ["/carousal/1.png", "/carousal/2.png"];

  const categories = ["All", "Fitness", "Discount"];

  return (
    <div className="homepage">
      <CarouselComponent images={images} />
      <Categories categories={categories} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory}/>
      <Tabs
        offers={Offers.filter((offer)=> selectedCategory=="All" || offer.tags.includes(selectedCategory))}
        contents={Reels}
        stores={Stores}
        context={"home"}
        isOffersLoading={isOffersLoading}
        isContentsLoading={isReelsLoading}
        isContentLoading={isContentLoading}
      />
    </div>
  );
};

export default HomePage;
