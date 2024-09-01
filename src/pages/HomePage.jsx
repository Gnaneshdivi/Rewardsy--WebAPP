import React, { useEffect, useState } from "react";
import CarouselComponent from "../components/Carousel";
import Categories from "../components/categories";
import Tabs from "../components/Tabs";
import "./HomePage.css";
import { getOffers } from "../services/OffersService";
import { getReels } from "../services/ReelsServices";

const HomePage = () => {
  const [ Offers, setOffers ] = useState([]);
  const [ Reels, setReels ] = useState([]);
  const [ isOffersLoading, setisOffersLoading ] = useState(true);
  const [ isReelsLoading, setisReelsLoading ] = useState(true);

  useEffect(() => {
    const updateData = async () => {
      setOffers(await getOffers());
      setReels(await getReels());
      setisOffersLoading(false);
      setisReelsLoading(false);
    };
    updateData();
  }, []);

  const images = ["/carousal/1.png", "/carousal/2.png"];

  const categories = ["Category 1", "Category 2", "Category 3", "Category 4"];

  return (
    <div className="homepage">
      <CarouselComponent images={images} />
      <Categories categories={categories} />
      <Tabs
        offers={Offers}
        contents={Reels}
        context={"home"}
        isOffersLoading={isOffersLoading}
        isContentsLoading={isReelsLoading}
      />
    </div>
  );
};

export default HomePage;
