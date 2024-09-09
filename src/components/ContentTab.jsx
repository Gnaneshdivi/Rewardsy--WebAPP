import React from "react";
import ContentCard from "./ContentCard";
import "./ContentTab.css";
import ClipLoader from "react-spinners/ClipLoader";

const ContentTab = ({ contents, isLoading }) => {
  return (
    <div className="content-tab-container">
      {isLoading ? (
        <ClipLoader loading={isLoading} color="white" />
      ) : (
        <>
          <div className="content-tab-grid-container">
            {contents.map((content, index) => (
              <ContentCard
                key={index}
                content={content}
                contentList={contents}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ContentTab;
