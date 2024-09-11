import React, { useEffect, useState } from "react";
import CarouselComponent from "../components/Carousel";
import Categories from "../components/categories";
import Tabs from "../components/Tabs";
import "./HomePage.css";
import { getOffers } from "../services/OffersService";
import { getReels } from "../services/ReelsServices";
import { getStoreByLocation } from "../services/StoreServices";
// import Navbar from "../components/Navbar";

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

  const bannerImages = ["/carousal/1.png", "/carousal/2.png"];

  const categories = [
    { name: "All", asset: "/categories/discount.png" },
    { name: "Restaurants", asset: "/categories/cutlery.png" },
    { name: "Beauty", asset: "/categories/cosmetics.png" },
    { name: "Fashion", asset: "/categories/tshirt.png" },
    // { name: "Grocery", asset: "temp" },
    { name: "Fitness", asset: "/categories/fitness.png" },
    { name: "Electronics", asset: "/categories/technology.png" },
    { name: "Hotel", asset: "/categories/hotel.png" },
    { name: "Pharmacy", asset: "/categories/tablets.png" },
    { name: "Home Services", asset: "/categories/service.png" },
    { name: "Media & Education", asset: "/categories/open-book.png" },
    // { name: "Automobiles", asset: "temp" },
    { name: "Discount", asset: "/categories/discount.png" },
  ];
  
  

  return (
    <div className="homepage">
      {/* <Navbar /> */}
      <CarouselComponent images={bannerImages} />
      <Categories categories={categories} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory}/>
      <Tabs
        offers={Offers.filter((offer)=> selectedCategory=="All" || offer.tags.includes(selectedCategory))}
        contents={Reels.filter((reel)=> selectedCategory=="All" || reel.tags.includes(selectedCategory))}
        stores={Stores.filter((store)=> selectedCategory=="All" || store.category.includes(selectedCategory))}
        context={"home"}
        isOffersLoading={isOffersLoading}
        isContentsLoading={isReelsLoading}
        isContentLoading={isContentLoading}
      />
    </div>
  );
};

export default HomePage;
