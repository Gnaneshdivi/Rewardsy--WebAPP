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
  const [area, setArea] = useState(""); 
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const updateStore = async () => {
      setIsStoreLoading(true);
      let storeData = await getStore(storeId);
      setStore(storeData);
      // setOffer(storeData.offers);
      // setContent(storeData.content);
      setIsStoreLoading(false);

      if (storeData.store && storeData.store.location) {
        const [lat, lon] = storeData.store.location.split(",");
        setLatitude(lat);
        setLongitude(lon);
        fetchAreaName(lat, lon);
      }
    };

    const fetchAreaName = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();

        if (data && data.address) {
          const road = data.address.road || "";
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "";
          const state = data.address.state || "";
          const country = data.address.country || "";

          const locationName = [road, city, state, country]
            .filter(Boolean)
            .join(", ");

          const firstPart = locationName.split(",")[0].trim();
          setArea(firstPart);
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

  const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

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
                <div className="name-location-div">
                  <h1>{store.name}</h1>
                  <p>
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="area-link"
                    >
                      {area} 📍
                    </a>
                  </p>
                </div>
                <p>
                  {store.category.map((tag, index) => (
                    <span key={index} className="store-tag">
                      {tag}
                    </span>
                  ))}
                </p>
                <br></br>
                <p id="desc">{store.desc}</p>
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
