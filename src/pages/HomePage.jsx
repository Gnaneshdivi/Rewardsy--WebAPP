import React, { useEffect, useState } from "react";
import CarouselComponent from "../components/Carousel";
import Categories from "../components/categories";
import Tabs from "../components/Tabs";
import "./HomePage.css";
import SearchInput from "../components/SearchInput";

const HomePage = () => {
  const [searchKey, setSearchKey] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // Any side-effects related to searchKey/category can go here if needed
  }, [searchKey, selectedCategory]);

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

  return (
    <div className="homepage">
      <SearchInput word={updateSearchKey} />

      
        <CarouselComponent images={bannerImages} />
        {/* <Categories
          categories={categories}
          setSelectedCategory={setSelectedCategory} 
          selectedCategory={selectedCategory}
        /> */}
      

      <Tabs
        SearchKey={searchKey}
        selectedCategory={selectedCategory} 
        context={"home"}
      />
    </div>
  );
};

export default HomePage;

