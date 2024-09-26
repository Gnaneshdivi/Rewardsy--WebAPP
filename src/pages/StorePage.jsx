import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "../components/Tabs";
import "./StorePage.css";
import { getStore } from "../services/StoreServices";
import ClipLoader from "react-spinners/ClipLoader";

const StorePage = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [offers, setOffer] = useState([]);
  const [content, setContent] = useState([]);
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [area, setArea] = useState(""); // State for the area name

  useEffect(() => {
    const updateStore = async () => {
      setIsStoreLoading(true);
      let storeData = await getStore(storeId);
      setStore(storeData.store);
      setOffer(storeData.offers);
      setContent(storeData.content);
      setIsStoreLoading(false);

      // Call reverse geocoding to get area name from coordinates
      if (storeData.store && storeData.store.location) {
        const [latitude, longitude] = storeData.store.location.split(",");
        fetchAreaName(latitude, longitude);
      }
    };

    // Function to fetch the area name using OpenStreetMap (Nominatim)
    const fetchAreaName = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();

        if (data && data.address) {
          // Fallback if some parts of the address are missing
          const road = data.address.road || "";
          const city = data.address.city || data.address.town || data.address.village || "";
          const state = data.address.state || "";
          const country = data.address.country || "";

          // Construct the area name based on available fields
          const locationName = [road, city, state, country].filter(Boolean).join(", ");
          setArea(locationName);
        } else {
          setArea("Unknown Location");
        }
      } catch (error) {
        console.error("Error fetching area name:", error);
        setArea("Unknown Location");
      }
    };

    updateStore();
  }, [storeId]);

  return (
    <>
      {isStoreLoading ? (
        <div className="store-spinner">
          <ClipLoader loading={isStoreLoading} color="white" />
        </div>
      ) : (
        <div className="store-page">
          <div className="store-header">
            <img
              src={store.background}
              alt={`${store.name} banner`}
              className="store-banner"
            />
            <div className="store-info">
              <img
                src={store.dp}
                alt={`${store.name} logo`}
                className="store-logo"
              />
              <div className="store-details">
                <h1>{store.name}</h1>
                {/* Instead of latitude and longitude, show the area name */}
                <p>{area}</p>
                <p>{store.category}</p>
                <br></br>
                <p>{store.desc}</p>
              </div>
            </div>
          </div>
          {!isStoreLoading && (
            <Tabs offers={offers} contents={content} context={"store"} />
          )}
        </div>
      )}
    </>
  );
};

export default StorePage;
