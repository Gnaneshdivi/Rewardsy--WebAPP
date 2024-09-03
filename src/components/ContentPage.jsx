import React from "react";
import ContentCard from "./ContentCard";
import "./ContentPage.css";
import ClipLoader from "react-spinners/ClipLoader";

const ContentPage = ({ contents, isLoading }) => {
  return (
    <div className="content-page-container">
      {isLoading ? (
        <ClipLoader loading={isLoading} color="white" />
      ) : (
        <>
          <div className="content-page-grid-container">
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

export default ContentPage;
