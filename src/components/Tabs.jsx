import React, { useState } from 'react';
import OffersPage from '../components/OffersPage';
import ContentPage from '../components/ContentPage';
import './Tabs.css';

const Tabs = ({ offers, contents, context }) => {
  const [activeTab, setActiveTab] = useState('offers');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tabs-container">
        <div
          className={`tab ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => handleTabClick('offers')}
        >
          Offers
        </div>
        <div
          className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => handleTabClick('content')}
        >
          Content
        </div>
      </div>
      <div className="tab-content-container">
        {activeTab === 'offers' && <OffersPage offers={offers} context={context} />}
        {activeTab === 'content' && <ContentPage contents={contents} />}
      </div>
    </div>
  );
};

export default Tabs;