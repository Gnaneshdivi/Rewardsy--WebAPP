import React from 'react';
import ContentCard from './ContentCard';
import './ContentPage.css';

const ContentPage = ({ contents }) => {
  return (
    <div className="content-page-container">
      <div className="content-page-grid-container">
        {contents.map((content, index) => (
          <ContentCard key={index} content={content} contentList={contents} />
        ))}
      </div>
    </div>
  );
};

export default ContentPage;
