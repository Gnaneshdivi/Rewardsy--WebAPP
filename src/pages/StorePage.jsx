import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "../components/Tabs";
import Links from "../components/Links";
import "./StorePage.css";
import { getStore } from "../services/StoreServices";
import { getMerchantConfigs } from "../services/MerchantConfig";
import ClipLoader from "react-spinners/ClipLoader";

const StorePage = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [area, setArea] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [config, setconfig] = useState([]);

  const extractTabsFromConfig = (configArray) => {
    const validKeys = { offers: "offers", reels: "content" };
    return configArray
      .filter(({ key, value }) => validKeys[key] && value === "true")
      .map(({ key }) => validKeys[key]);
  };

  useEffect(() => {
    const updateStore = async () => {
      setIsStoreLoading(true);
      try {
        const storeData = await getStore(storeId);
        const configData = await getMerchantConfigs(storeId);
setconfig(configData);
        setTabs(extractTabsFromConfig(configData)); // Extract and set tabs
        setStore(storeData);

        if (storeData.store && storeData.store.location) {
          const [lat, lon] = storeData.store.location.split(",");
          setLatitude(lat);
          setLongitude(lon);
          fetchAreaName(lat, lon);
        }
      } catch (error) {
        console.error("Error fetching store or config data:", error);
      } finally {
        setIsStoreLoading(false);
      }
    };

    const fetchAreaName = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();

        if (data && data.address) {
          const locationName = [
            data.address.road || "",
            data.address.city || data.address.town || data.address.village || "",
            data.address.state || "",
            data.address.country || "",
          ]
            .filter(Boolean)
            .join(", ");

          setArea(locationName.split(",")[0].trim());
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
                <br />
                <p id="desc">{store.desc}</p>
              </div>
            </div>
          </div>
          <Links config={{merchantid:store.id }}/>
          <Tabs context={"store"} config={{ tabs:tabs,merchantid:store.id }} />
        </div>
      )}
    </>
  );
};

export default StorePage;
