import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Typography, Button, Image, Card, Spin } from "antd";
import { EnvironmentOutlined, ShareAltOutlined, PhoneOutlined } from "@ant-design/icons";
import Tabs from "../components/Tabs";
import Links from "../components/Links";
import { getStore } from "../services/StoreServices";
import { getMerchantConfigs } from "../services/MerchantConfig";
import "./StorePage.css";
import { getLinksByStore } from "../services/LinksService";
import { getOffersByStore } from "../services/OffersService";

const { Title, Text } = Typography;

const StorePage = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [area, setArea] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [config, setConfig] = useState([]);
  const [offers, setOffers] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLinksEnabled, setisLinksEnabled] = useState(false);
  const [isOffersEnabled, setisOffersEnabled] = useState(false);
   
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
        const links=configData.some((item) => item.key === "links" && item.value === "true");
        const offers=configData.some((item) => item.key === "offers" && item.value === "true");
        setisLinksEnabled(links);
  setisOffersEnabled(offers);
        setConfig(configData);
        setTabs(extractTabsFromConfig(configData));
        setStore(storeData);
        console.log("figma",links);
        if (links) {
          const linksData = await getLinksByStore(storeId);
          setLinks(linksData);
        }

        // Fetch offers data if enabled
        if (offers) {
          const offersData = await getOffersByStore(storeId);
          setOffers(offersData);
        }

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `Check out Offers and Rewards at our ${store.name} on Rewardsy!`,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const handleCall = () => {
    if (store.phone) {
      window.location.href = `tel:${store.phone}`;
    } else {
      alert("Contact number not available.");
    }
  };

  const handleOpenMaps = () => {
    window.open(googleMapsLink, "_blank");
  };
  return (
    <div className="store-page">
      {isStoreLoading ? (
        <div className="store-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="store-header">
            <img
              src={store.background}
              alt={`${store.name} banner`}
              className="store-banner"
            />
          </div>

          <Card className="store-info-card">
            <Row align="middle" justify="space-between">
              <Col span={16}>
                <Title level={3} className="store-title">{store.name}</Title>
                <Text className="store-description">{store.desc}</Text>
                <Text className="store-area">{store.area}</Text>
              </Col>
              <Col span={8} className="store-icons-column">
  <Button icon={<ShareAltOutlined className="icon-share" />} type="link" onClick={handleShare} />
  <Button icon={<PhoneOutlined className="icon-phone" />} type="link" onClick={handleCall} />
  <Button icon={<EnvironmentOutlined className="icon-location" />} type="link" onClick={handleOpenMaps} />
</Col>

            </Row>
          </Card>
          {isLinksEnabled  && <Links config={{ merchantid: store.id,offers:offers,links:links }} />}
          <Tabs context={"store"} config={{ tabs: tabs, merchantid: store.id,offers:offers?offers:[] }} />
        </>
      )}
    </div>
  );
};

export default StorePage;
