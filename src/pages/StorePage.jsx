// src/pages/StorePage.js
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

  useEffect(() => {
    const updateStore = async () => {
      setIsStoreLoading(true);
      let storeData = await getStore(storeId);
      setStore(storeData.store);
      setOffer(storeData.offers);
      setContent(storeData.content);
      setIsStoreLoading(false);
    };
    updateStore();
  }, []);

  // console.log(store.area)

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
                <p>{store.location}</p>
                <p>{store.category}</p>
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
