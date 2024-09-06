import React, { useState, useEffect } from "react";
import CarouselComponent from "../components/Carousel";
// import useFetchAd from "../hooks/UseFetchAd";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AdPopup from "../components/AdPopup";
import Categories from "../components/categories";
import Tabs from "../components/Tabs";
import "./HomePage.css";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const images = ["/carousal/1.png", "/carousal/2.png"];

  const categories = ["Category 1", "Category 2", "Category 3", "Category 4"];

  const offers = [
    {
      title: "BIKE",
      description: "Flat 10% discount",
      tags: ["Recommended", "Fast selling"],
      active: true,
      endDate: "",
      image: "./offerLogo.png",
      numberOfOffers: 0,
      redemptions: 0,
      startDate: "",
      store: "ids",
    },
    {
      title: "NIKE",
      description: "Flat 10% discount",
      tags: ["Recommended", "Fast selling"],
      active: true,
      endDate: "",
      image: "./offerLogo.png",
      numberOfOffers: 0,
      redemptions: 0,
      startDate: "",
      store: "/stores/id",
    },
    {
      title: "NIKE",
      description: "Flat 10% discount",
      tags: ["Recommended", "Fast selling"],
      active: true,
      endDate: "",
      image: "./offerLogo.png",
      numberOfOffers: 0,
      redemptions: 0,
      startDate: "",
      store: "/stores/id",
    },
    {
      title: "NIKE",
      description: "Flat 10% discount",
      tags: ["Recommended", "Fast selling"],
      active: true,
      endDate: "",
      image: "./offerLogo.png",
      numberOfOffers: 0,
      redemptions: 0,
      startDate: "",
      store: "/stores/id",
    },
    {
      title: "Adidas",
      ddescription: "Flat 15% discount",
      tags: ["Recommended"],
      active: true,
      endDate: "",
      image: "",
      numberOfOffers: 0,
      redemptions: 0,
      startDate: "",
      store: "/stores/id",
    },
    {
      title: "Adidas",
      ddescription: "Flat 15% discount",
      tags: ["Recommended"],
      active: true,
      endDate: "",
      image: "",
      numberOfOffers: 0,
      redemptions: 0,
      startDate: "",
      store: "/stores/id",
    },

    {
      title: "Adidas",
      ddescription: "Flat 15% discount",
      tags: ["Recommended"],
      active: true,
      endDate: "",
      image: "",
      numberOfOffers: 0,
      redemptions: 0,
      startDate: "",
      store: "/stores/id",
    },

    {
      title: "Adidas",
      ddescription: "Flat 15% discount",
      tags: ["Recommended"],
      active: true,
      endDate: "",
      image: "",
      numberOfOffers: 0,
      redemptions: 0,
      startDate: "",
      store: "/stores/id",
    },

    // Add more offers here
  ];

  const contents = [
    {
      description: "testing",
      interactions: "",
      link: "/offers/id",
      store: "/stores/id",
      url: "",
      image: "../content.png",
    },
    {
      description: "testing",
      interactions: "",
      link: "/offers/id",
      store: "/stores/id",
      url: "",
      image: "../content.png",
    },

    {
      description: "testing",
      interactions: "",
      link: "/offers/id",
      store: "/stores/id",
      url: "",
      image: "../content.png",
    },
    {
      description: "testing",
      interactions: "",
      link: "/offers/id",
      store: "/stores/id",
      url: "",
      image: "../content.png",
    },
  ];

  const location = useLocation();
  const data = location.state?.data;
  const error = location.state?.error;
  const [showAdPopup, setShowAdPopup] = useState(false);

  useEffect(() => {
    console.log(data);
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

  return (
    <div className="homepage">
      {showAdPopup && (
        <AdPopup adData={data} onClose={() => setShowAdPopup(false)} />
      )}
      <CarouselComponent images={images} />
      <Categories categories={categories} />
      <Tabs offers={offers} contents={contents} context={"home"} />
      {/* Add other sections of the HomePage here */}
    </div>
  );
};

export default HomePage;
