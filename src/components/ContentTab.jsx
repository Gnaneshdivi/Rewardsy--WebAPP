import React from "react";
import ContentCard from "./ContentCard";
import "./ContentTab.css";
// import ClipLoader from "react-spinners/ClipLoader";
import { LoadingOutlined } from '@ant-design/icons';

const ContentTab = ({ contents, isLoading }) => {
  return (
    <div className="content-tab-container">
      {isLoading ? (
        <LoadingOutlined loading={isLoading} color="white"/>
        // <ClipLoader loading={isLoading} color="white" />
      ) : (
        <>
          {contents.length > 0 && (
            <div className="content-tab-grid-container">
              {contents.map((content, index) => (
                <ContentCard key={index} content={content} reels={contents} />
              ))}
            </div>
          )}
          {contents.length === 0 && (
            <div className="content-placeholder-text">
              No reels found under this categories
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContentTab;
