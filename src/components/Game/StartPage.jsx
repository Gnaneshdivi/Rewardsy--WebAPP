// src/pages/StartPage.js
import React, { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import "./StartPage.css";

const StartPage = ({onNext,ctaDetails }) => {
  const [loading, setLoading] = useState(false);


  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="start-page-content" style={{ backgroundImage: `url(${ctaDetails.cta.start})` }}>
      <h1>Finish the game In less then 15 Moves</h1>
      <Button className="start-button" style={{ fontWeight: "bold" }} onClick={onNext}>Start</Button>
    </div>
  );
};

export default StartPage;