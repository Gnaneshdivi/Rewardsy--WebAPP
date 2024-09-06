import React, { useState, useEffect } from "react";
import CarouselComponent from "../components/Carousel";
// import useFetchAd from "../hooks/UseFetchAd";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AdPopup from "../components/AdPopup";
import Categories from "../components/categories";
import Tabs from "../components/Tabs";
import "./HomePage.css";

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

  // const [adData, setAdData] = useFetchAd("useDefaultAds");
  const [adData, setAdData] = useState(null);

  useEffect(() => {
    const fetchAdData = async () => {
      const docRef = doc(db, "qr", "DYj9KEMYlThEmP5eCFW5"); // Use a specific doc ID for homepage ad
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().active && docSnap.data().ads) {
        setAdData(docSnap.data());
      }
    };

    const adShown = localStorage.getItem("adShown");

    if (!adData && !adShown) {
      fetchAdData();
    }
  }, [adData]);

  const handleAdClose = () => {
    setAdData(null); // Close the popup
    localStorage.setItem("adShown", "true"); // Set a flag in localStorage so the popup doesn't show again
  };

  return (
    <div className="homepage">
      {adData && <AdPopup adData={adData} onClose={handleAdClose} />}
      <CarouselComponent images={images} />
      <Categories categories={categories} />
      <Tabs offers={offers} contents={contents} context={"home"} />
      {/* Add other sections of the HomePage here */}
    </div>
  );
};

export default HomePage;
