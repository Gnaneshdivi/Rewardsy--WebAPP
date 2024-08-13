// src/pages/StorePage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tabs from '../components/Tabs';
import './StorePage.css';

const StorePage = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);

  // Mock data for now
  useEffect(() => {
    const dummyStoreData = {
      id: storeId,
      name: "L'Oréal",
      location: 'Hyderabad, India',
      category: 'Cosmetics',
      banner: '../carousal/1.png',
      logo: '/path-to-logo-image.jpg',
      offers: [
        {
          title: 'NIKE',
          description: 'Flat 10% discount',
          tags: ['Recommended', 'Fast selling'],
          logo: '/path-to-nike-logo.jpg',
        },
        // Add more offers here
      ],
      content: [
        {
          id:"reel1",
          description: "testing1",
          interactions: "",
          link: "/offers/id",
          store: "/stores/id",
          image:"https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/Screenshot%202024-08-11%20at%207.30.42%20PM.png?alt=media&token=e408fb1a-b3da-4cbe-b3a9-0bebf08e92be",
          url: 'https://firebasestorage.googleapis.com/v0/b/clap-2425e.appspot.com/o/videos%2F2020-08-13%2018%3A55%3A38.501279?alt=media&token=0f9e8f13-12c4-41e8-97d1-dde944ca4015',
        },
        {
          id:"reel2",
          description: "testing2",
          interactions: "",
          link: "/offers/id",
          store: "/stores/id",
          url: 'https://firebasestorage.googleapis.com/v0/b/clap-2425e.appspot.com/o/videos%2F2020-08-14%2021%3A18%3A25.854864?alt=media&token=e55cb5c6-e20e-41c6-b45d-d8720a8f4120',
          image:"https://firebasestorage.googleapis.com/v0/b/rewardsy-app.appspot.com/o/Screenshot%202024-08-11%20at%207.30.36%20PM.png?alt=media&token=fcc3f5e0-e987-4bd1-bed3-51a06ac7b851",
          
        },
        // Add more content here
      ],
    };

    // Simulate fetching data from Firestore
    setStore(dummyStoreData);
  }, [storeId]);

  if (!store) {
    return <div>Loading...</div>;
  }

  return (
    <div className="store-page">
      <div className="store-header">
        <img src={store.banner} alt={`${store.name} banner`} className="store-banner" />
        <div className="store-info">
          <img src={store.logo} alt={`${store.name} logo`} className="store-logo" />
          <div className="store-details">
            <h1>{store.name}</h1>
            <p>{store.location}</p>
            <p>{store.category}</p>
          </div>
        </div>
      </div>
      <Tabs offers={store.offers} contents={store.content} context={"store"} />
    </div>
  );
};

export default StorePage;
