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
      />
    </div>
  );
};

export default HomePage;
